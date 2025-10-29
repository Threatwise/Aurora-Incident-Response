/**
 * MITRE ATT&CK Integration Layer
 * Loads and queries enterprise-attack.json from submodule
 */

let mitre_enterprise_data = null;
let mitre_techniques_cache = null;

/**
 * Load MITRE ATT&CK data from submodule
 * Expected path: ../mitre-attack/enterprise-attack/enterprise-attack.json
 * @returns {boolean} Success status
 */
const loadMitreAttackData = () => {
    try {
        const fs = require('node:fs');
        const path = require('node:path');

        logger.info('Loading MITRE ATT&CK data');

        // Try multiple possible paths
        const possiblePaths = [
            path.join(__dirname, '../vendor/mitre-cti/enterprise-attack/enterprise-attack.json'),
            path.join(__dirname, '../mitre-attack/enterprise-attack/enterprise-attack.json'),
            path.join(__dirname, '../mitre-attack/enterprise-attack.json'),
            path.join(__dirname, '../../mitre-attack/enterprise-attack/enterprise-attack.json')
        ];

        let mitrePath = null;
        for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
                mitrePath = testPath;
                logger.debug('Found MITRE data file', { path: testPath });
                break;
            }
        }

        if (!mitrePath) {
            logger.warn('MITRE ATT&CK data not found. Advanced CTI features will be limited.');
            return false;
        }

        const rawData = fs.readFileSync(mitrePath, 'utf8');
        mitre_enterprise_data = JSON.parse(rawData);

        // Extract version
        const versionObj = mitre_enterprise_data.objects.find(obj => obj.type === 'x-mitre-matrix');
        if (versionObj && case_data.mitre_attack) {
            case_data.mitre_attack.enterprise_version = versionObj.x_mitre_version || 'unknown';
        }

        logger.info(`Loaded MITRE ATT&CK data successfully`, {
            version: case_data.mitre_attack?.enterprise_version || 'unknown',
            objects: mitre_enterprise_data.objects.length
        });

        // Build technique cache
        buildTechniqueCache();

        return true;
    } catch (error) {
        logger.error('Failed to load MITRE ATT&CK data', { error: error.message, stack: error.stack });
        return false;
    }
};

/**
 * Build indexed cache of techniques for fast lookup
 */
const buildTechniqueCache = () => {
    if (!mitre_enterprise_data) {
        logger.warn('Cannot build technique cache: MITRE data not loaded');
        return;
    }

    mitre_techniques_cache = {};

    try {
        const techniques = mitre_enterprise_data.objects
            .filter(obj => obj.type === 'attack-pattern' && !obj.revoked && !obj.x_mitre_deprecated);

        for (const technique of techniques) {
            const extRef = technique.external_references?.find(ref => ref.source_name === 'mitre-attack');
            if (!extRef) continue;

            const id = extRef.external_id;
            mitre_techniques_cache[id] = {
                id: id,
                name: technique.name,
                description: technique.description || '',
                tactics: technique.kill_chain_phases?.map(phase => phase.phase_name) || [],
                detection: technique.x_mitre_detection || '',
                platforms: technique.x_mitre_platforms || [],
                data_sources: technique.x_mitre_data_sources || [],
                is_subtechnique: id.includes('.'),
                url: extRef.url || ''
            };
        }

        logger.info(`Built MITRE ATT&CK technique cache`, {
            techniqueCount: Object.keys(mitre_techniques_cache).length
        });
    } catch (error) {
        logger.error('Failed to build technique cache', { error: error.message });
        mitre_techniques_cache = {};
    }
};

/**
 * Get all techniques indexed by ID
 * @returns {Object} Techniques cache object
 */
const getMitreTechniques = () => {
    if (!mitre_techniques_cache) {
        logger.debug('Technique cache not built, building now');
        buildTechniqueCache();
    }
    return mitre_techniques_cache || {};
};

/**
 * Get technique details by ID
 */
function getMitreTechniqueById(techniqueId) {
    const techniques = getMitreTechniques();
    return techniques[techniqueId] || null;
}

/**
 * Get all unique tactics from MITRE ATT&CK
 */
function getMitreTactics() {
    if (!mitre_enterprise_data) return [];
    
    const matrix = mitre_enterprise_data.objects.find(obj => obj.type === 'x-mitre-matrix');
    if (!matrix?.tactic_refs) return [];
    
    return matrix.tactic_refs.map(ref => {
        const tactic = mitre_enterprise_data.objects.find(obj => obj.id === ref);
        if (!tactic) return null;
        
        return {
            id: tactic.x_mitre_shortname || '',
            name: tactic.name || '',
            description: tactic.description || ''
        };
    }).filter(t => t !== null);
}

/**
 * Search techniques by keyword
 */
function searchMitreTechniques(query) {
    const techniques = getMitreTechniques();
    const queryLower = query.toLowerCase();
    
    return Object.values(techniques).filter(tech => 
        tech.name.toLowerCase().includes(queryLower) ||
        tech.description.toLowerCase().includes(queryLower) ||
        tech.id.toLowerCase().includes(queryLower)
    );
}

/**
 * Get techniques filtered by tactic
 */
function getMitreTechniquesByTactic(tacticName) {
    const techniques = getMitreTechniques();
    return Object.values(techniques).filter(tech => 
        tech.tactics.includes(tacticName)
    );
}

/**
 * Add technique suggestions based on malware name and path
 */
function addMalwareTechniques(malware, suggestions) {
    const name = (malware.text || '').toLowerCase();
    const path = (malware.path_on_disk || '').toLowerCase();

    if (name.includes('mimikatz')) {
        suggestions.add('T1003.001'); // LSASS Memory
        suggestions.add('T1558'); // Steal or Forge Kerberos Tickets
    }
    if (name.includes('cobalt') || name.includes('beacon')) {
        suggestions.add('T1071.001'); // Web Protocols
        suggestions.add('T1090'); // Proxy
        suggestions.add('T1573'); // Encrypted Channel
    }
    if (name.includes('psexec')) {
        suggestions.add('T1021.002'); // SMB/Windows Admin Shares
        suggestions.add('T1569.002'); // Service Execution
    }
    if (name.includes('powershell') || path.includes('powershell')) {
        suggestions.add('T1059.001'); // PowerShell
    }
    if (name.includes('cmd.exe') || name.includes('cmd ')) {
        suggestions.add('T1059.003'); // Windows Command Shell
    }
}

/**
 * Add technique suggestions based on network indicators
 */
function addNetworkTechniques(indicator, suggestions) {
    const context = (indicator.context || '').toLowerCase();

    if (context.includes('c2') || context.includes('command')) {
        suggestions.add('T1071'); // Application Layer Protocol
        suggestions.add('T1573'); // Encrypted Channel
    }
    if (indicator.port === 443 || indicator.port === 80) {
        suggestions.add('T1071.001'); // Web Protocols
    }
    if (indicator.port === 22) {
        suggestions.add('T1021.004'); // SSH
    }
    if (indicator.port === 3389) {
        suggestions.add('T1021.001'); // Remote Desktop Protocol
    }
}

/**
 * Suggest techniques based on observed indicators
 */
function suggestTechniquesFromIndicators() {
    const suggestions = new Set();
    
    // Check malware/tools for technique hints
    if (case_data.malware) {
        for (const malware of case_data.malware) {
            addMalwareTechniques(malware, suggestions);
        }
    }
    
    // Check network indicators for C2 patterns
    if (case_data.network_indicators) {
        for (const indicator of case_data.network_indicators) {
            addNetworkTechniques(indicator, suggestions);
        }
    }
    
    return Array.from(suggestions);
}

/**
 * Get technique list formatted for w2ui dropdown
 */
function getMitreTechniquesForDropdown() {
    const techniques = getMitreTechniques();
    return Object.values(techniques).map(tech => ({
        id: tech.id,
        text: `${tech.id}: ${tech.name}`
    }));
}

// Auto-load on window load event with retry logic
if (globalThis.window !== undefined) {
    // Wait for both window load AND electronAPI to be available
    const attemptLoad = () => {
        if (globalThis.window.electronAPI) {
            console.log('[MITRE] electronAPI available, loading MITRE data');
            loadMitreAttackData();
        } else {
            console.warn('[MITRE] electronAPI not yet available, retrying in 100ms');
            setTimeout(attemptLoad, 100);
        }
    };

    globalThis.window.addEventListener('load', attemptLoad);
}
