/**
 * CTI Export Functions
 * Export case data as STIX 2.1, threat reports, and other CTI formats
 */

/**
 * Generate a UUID for STIX objects
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.trunc(Math.random() * 16);
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Convert confidence string to STIX numeric scale (0-100)
 */
function confidenceToSTIX(confidence) {
    const map = {
        'Confirmed': 95,
        'Suspected': 70,
        'Possible': 40,
        'Unknown': 0
    };
    return map[confidence] || 0;
}

/**
 * Add incident object to STIX bundle
 */
function addIncidentToBundle(bundle) {
    const incidentId = `incident--${generateUUID()}`;
    bundle.objects.push({
        type: "incident",
        spec_version: "2.1",
        id: incidentId,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: case_data.case_id || "Unnamed Incident",
        description: case_data.summary || "",
        confidence: case_data.cti_mode?.attribution?.confidence ? confidenceToSTIX(case_data.cti_mode.attribution.confidence) : 0
    });
    return incidentId;
}

/**
 * Add threat actor to STIX bundle if available
 */
function addThreatActorToBundle(bundle) {
    if (!case_data.cti_mode?.threat_actor?.name) return;

    const actor = case_data.cti_mode.threat_actor;
    bundle.objects.push({
        type: "threat-actor",
        spec_version: "2.1",
        id: `threat-actor--${generateUUID()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: actor.name,
        aliases: actor.aliases || [],
        description: `Sophistication: ${actor.sophistication || 'Unknown'}. Motivation: ${actor.motivation || 'Unknown'}`,
        threat_actor_types: actor.motivation ? [actor.motivation.toLowerCase()] : ["unknown"],
        sophistication: actor.sophistication ? actor.sophistication.toLowerCase() : "unknown",
        goals: actor.target_sectors || [],
        confidence: case_data.cti_mode ? confidenceToSTIX(case_data.cti_mode.attribution.confidence) : 0
    });
}

/**
 * Add network indicators to STIX bundle
 */
function addNetworkIndicatorsToBundle(bundle) {
    if (!case_data.network_indicators) return;

    for (const indicator of case_data.network_indicators) {
        const indicatorData = createNetworkIndicator(indicator);
        if (indicatorData) {
            bundle.objects.push(indicatorData);
        }
    }
}

/**
 * Create a network indicator object
 */
function createNetworkIndicator(indicator) {
    let pattern = '';
    let indicatorTypes;

    if (indicator.ip && indicator.domainname) {
        pattern = `[domain-name:value = '${indicator.domainname}' AND domain-name:resolves_to_refs[*].value = '${indicator.ip}']`;
        indicatorTypes = ['malicious-activity', 'c2'];
    } else if (indicator.domainname) {
        pattern = `[domain-name:value = '${indicator.domainname}']`;
        indicatorTypes = ['malicious-activity', 'c2'];
    } else if (indicator.ip) {
        pattern = `[ipv4-addr:value = '${indicator.ip}']`;
        indicatorTypes = ['malicious-activity', 'c2'];
    } else {
        return null; // Skip if no useful indicator
    }

    const labels = [];
    if (indicator.pyramid_pain && case_data.pyramid_levels) {
        const level = case_data.pyramid_levels.find(l => l.id == indicator.pyramid_pain || l.text === indicator.pyramid_pain);
        if (level) labels.push(`pyramid:${level.text.toLowerCase().replace(/\s+/g, '-')}`);
    }

    return {
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--${generateUUID()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: indicator.domainname || indicator.ip || "Network Indicator",
        description: indicator.context || "",
        pattern: pattern,
        pattern_type: "stix",
        valid_from: new Date().toISOString(),
        indicator_types: indicatorTypes,
        labels: labels
    };
}

/**
 * Add malware samples to STIX bundle
 */
function addMalwareToBundle(bundle) {
    if (!case_data.malware) return;

    for (const malware of case_data.malware) {
        if (!malware.md5 && !malware.text) continue;

        const malwareObj = {
            type: "malware",
            spec_version: "2.1",
            id: `malware--${generateUUID()}`,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            name: malware.text || "Unknown Malware",
            description: malware.notes || "",
            is_family: false,
            malware_types: ["unknown"]
        };

        bundle.objects.push(malwareObj);
        addMalwareHashIndicator(bundle, malware);
    }
}

/**
 * Add hash indicator for malware
 */
function addMalwareHashIndicator(bundle, malware) {
    if (!malware.md5) return;

    const hashLength = malware.md5.length;
    let hashType = 'MD5';
    if (hashLength === 40) hashType = 'SHA-1';
    else if (hashLength === 64) hashType = 'SHA-256';

    bundle.objects.push({
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--${generateUUID()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: `Hash: ${malware.md5}`,
        pattern: `[file:hashes.'${hashType}' = '${malware.md5}']`,
        pattern_type: "stix",
        valid_from: new Date().toISOString(),
        indicator_types: ["malicious-activity"],
        labels: ["pyramid:hash-values"]
    });
}

/**
 * Save STIX bundle to file
 */
function saveSTIXBundle(bundle) {
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('node:fs');

    const path = dialog.showSaveDialogSync({
        filters: [{name: "STIX Bundle", extensions: ["json"]}],
        defaultPath: `${case_data.case_id || 'case'}_stix.json`
    });

    if (path) {
        fs.writeFileSync(path.toString(), JSON.stringify(bundle, null, 2));
        w2alert(`STIX 2.1 bundle exported successfully with ${bundle.objects.length} objects`);
    }
}

/**
 * Export case as STIX 2.1 bundle
 */
function exportSTIX() {
    syncAllChanges();

    const bundle = {
        type: "bundle",
        id: `bundle--${generateUUID()}`,
        spec_version: "2.1",
        objects: []
    };

    addIncidentToBundle(bundle);
    addThreatActorToBundle(bundle);
    addNetworkIndicatorsToBundle(bundle);
    addMalwareToBundle(bundle);
    saveSTIXBundle(bundle);
}

/**
 * Export comprehensive CTI report as JSON
 */
function exportCTIReport() {
    const report = generateCTISummary();
    
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('node:fs');
    
    const path = dialog.showSaveDialogSync({
        filters: [{name: "JSON Report", extensions: ["json"]}],
        defaultPath: `${case_data.case_id || 'case'}_cti_report.json`
    });
    
    if (path) {
        fs.writeFileSync(path.toString(), JSON.stringify(report, null, 2));
        w2alert('CTI report exported successfully');
    }
}

/**
 * Export Kill Chain analysis as JSON
 */
function exportKillChain() {
    syncAllChanges();

    const stages = (typeof ensureKillChainStages === 'function')
        ? ensureKillChainStages()
        : (case_data.kill_chain && Array.isArray(case_data.kill_chain.stages) ? case_data.kill_chain.stages : []);

    const killChainData = {
        case_id: case_data.case_id || "Unknown",
        mode: case_data.kill_chain?.mode || 'linked',
        stages: stages,
        coverage_analysis: analyzeKillChain(),
        exported_at: new Date().toISOString()
    };
    
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('node:fs');
    
    const path = dialog.showSaveDialogSync({
        filters: [{name: "JSON Report", extensions: ["json"]}],
        defaultPath: `${case_data.case_id || 'case'}_killchain.json`
    });
    
    if (path) {
        fs.writeFileSync(path.toString(), JSON.stringify(killChainData, null, 2));
        w2alert('Kill Chain analysis exported successfully');
    }
}

/**
 * Export Diamond Model as JSON
 */
function exportDiamondModel() {
    syncAllChanges();
    
    const diamondData = {
        case_id: case_data.case_id || "Unknown",
        mode: case_data.diamond_model.mode,
        adversary: case_data.diamond_model.adversary,
        capability: case_data.diamond_model.capability,
        infrastructure: case_data.diamond_model.infrastructure,
        victim: case_data.diamond_model.victim,
        meta_features: case_data.diamond_model.meta_features,
        exported_at: new Date().toISOString()
    };
    
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('node:fs');
    
    const path = dialog.showSaveDialogSync({
        filters: [{name: "JSON Report", extensions: ["json"]}],
        defaultPath: `${case_data.case_id || 'case'}_diamond.json`
    });
    
    if (path) {
        fs.writeFileSync(path.toString(), JSON.stringify(diamondData, null, 2));
        w2alert('Diamond Model exported successfully');
    }
}
