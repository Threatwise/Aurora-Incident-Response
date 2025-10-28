/**
 * Build the ATT&CK technique catalogue from the MITRE CTI submodule.
 * Falls back to a concise default set if the dataset cannot be read.
 */
var mitre_attack_techniques = (function buildMitreTechniqueList() {
    const fallback = [
        { id: 'T1003', text: 'Credential Dumping' },
        { id: 'T1021', text: 'Remote Services' },
        { id: 'T1059', text: 'Command and Scripting Interpreter' },
        { id: 'T1078', text: 'Valid Accounts' },
        { id: 'T1486', text: 'Data Encrypted for Impact' },
        { id: 'T1566', text: 'Phishing' },
        { id: 'T1570', text: 'Lateral Tool Transfer' }
    ]

    try {
        const path = require('path');
        const fs = require('fs');

        const datasetPath = path.join(__dirname, '..', 'vendor', 'mitre-cti', 'enterprise-attack', 'enterprise-attack.json')
        if (!fs.existsSync(datasetPath)) {
            console.warn('Aurora ATT&CK catalogue: dataset not found at', datasetPath)
            return fallback
        }

        const raw = fs.readFileSync(datasetPath, 'utf8')
        const bundle = JSON.parse(raw)
        if (!bundle || !Array.isArray(bundle.objects)) {
            console.warn('Aurora ATT&CK catalogue: invalid bundle format')
            return fallback
        }

        const seen = new Set()
        const techniques = []

        bundle.objects.forEach(function (object) {
            if (!object || object.type !== 'attack-pattern') {
                return
            }
            if (!object.name) {
                return
            }
            if (!Array.isArray(object.external_references)) {
                return
            }

            const mitreRef = object.external_references.find(function (ref) {
                return ref && ref.source_name === 'mitre-attack' && ref.external_id
            })
            if (!mitreRef) {
                return
            }

            const techId = mitreRef.external_id
            if (!techId || seen.has(techId)) {
                return
            }

            seen.add(techId)
            techniques.push({
                id: techId,
                text: object.name
            })
        })

        if (techniques.length === 0) {
            console.warn('Aurora ATT&CK catalogue: no attack-pattern entries extracted; falling back to defaults')
            return fallback
        }

        techniques.sort(function (a, b) {
            // lexical sort keeps sub-techniques grouped
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            return a.text.localeCompare(b.text)
        })

        return techniques
    } catch (err) {
        console.warn('Aurora ATT&CK catalogue: failed to load dataset', err)
        return fallback
    }
})();

