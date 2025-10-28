/**
 * CTI Export Functions
 * Export case data as STIX 2.1, threat reports, and other CTI formats
 */

/**
 * Generate a UUID for STIX objects
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
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
    
    // Add Incident object
    const incidentId = `incident--${generateUUID()}`;
    bundle.objects.push({
        type: "incident",
        spec_version: "2.1",
        id: incidentId,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: case_data.case_id || "Unnamed Incident",
        description: case_data.summary || "",
        confidence: case_data.cti_mode ? confidenceToSTIX(case_data.cti_mode.attribution.confidence) : 0
    });
    
    // Add Threat Actor if available
    if (case_data.cti_mode && case_data.cti_mode.threat_actor.name) {
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
    
    // Add Network Indicators
    if (case_data.network_indicators) {
        case_data.network_indicators.forEach(indicator => {
            let pattern = '';
            let indicatorTypes = ['malicious-activity'];
            
            if (indicator.ip && indicator.domainname) {
                // Domain with IP
                pattern = `[domain-name:value = '${indicator.domainname}' AND domain-name:resolves_to_refs[*].value = '${indicator.ip}']`;
                indicatorTypes = ['malicious-activity', 'c2'];
            } else if (indicator.domainname) {
                pattern = `[domain-name:value = '${indicator.domainname}']`;
                indicatorTypes = ['malicious-activity', 'c2'];
            } else if (indicator.ip) {
                pattern = `[ipv4-addr:value = '${indicator.ip}']`;
                indicatorTypes = ['malicious-activity', 'c2'];
            } else {
                return; // Skip if no useful indicator
            }
            
            const labels = [];
            if (indicator.pyramid_pain && case_data.pyramid_levels) {
                const level = case_data.pyramid_levels.find(l => l.id == indicator.pyramid_pain);
                if (level) labels.push(`pyramid:${level.text.toLowerCase().replace(/\s+/g, '-')}`);
            }
            
            bundle.objects.push({
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
            });
        });
    }
    
    // Add Malware samples
    if (case_data.malware) {
        case_data.malware.forEach(malware => {
            if (!malware.md5 && !malware.text) return;
            
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
            
            // Add hash indicator if available
            if (malware.md5) {
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
        });
    }
    
    // Save to file
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('fs');
    
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
 * Export comprehensive CTI report as JSON
 */
function exportCTIReport() {
    const report = generateCTISummary();
    
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('fs');
    
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
    
    const killChainData = {
        case_id: case_data.case_id || "Unknown",
        mode: case_data.kill_chain.mode,
        stages: case_data.kill_chain.stages,
        coverage_analysis: analyzeKillChain(),
        exported_at: new Date().toISOString()
    };
    
    const {remote} = require('electron');
    const {dialog} = remote;
    const fs = require('fs');
    
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
    const fs = require('fs');
    
    const path = dialog.showSaveDialogSync({
        filters: [{name: "JSON Report", extensions: ["json"]}],
        defaultPath: `${case_data.case_id || 'case'}_diamond.json`
    });
    
    if (path) {
        fs.writeFileSync(path.toString(), JSON.stringify(diamondData, null, 2));
        w2alert('Diamond Model exported successfully');
    }
}
