// Main Data Template for new files

const storage_format_version = 10

const data_template  = {
    "storage_format_version": storage_format_version,
    "locked":true,
    "case_id":"XXX",
    "client":"",
    "start_date":"",
    "summary":"",
    "timeline":[],
    "investigated_systems":[],
    "malware":[],
    "compromised_accounts":[],
    "network_indicators":[],
    "exfiltration":[],
    "hosts":[],
    "systems":[],
    "osint":[],
    "investigators":[],
    "evidence":[],
    "actions":[],
    "casenotes":[],
    "email":[],
    "files":[],
    "processes":[],
    "web_activity":[],
    "persistence":[],
    "threat_intel":[],
    "campaigns":[],
    "attack_techniques": mitre_attack_techniques,
    "event_types":[
        {id:1,text:"EventLog"},
        {id:2,text:"File"},
        {id:3,text:"Human"},
        {id:4,text:"Engagement"},
        {id:5,text:"Lateral Movement"},
        {id:6,text:"Exfil"},
        {id:7,text:"Tanium Trace"},
        {id:8,text:"Malware"},
        {id:9,text:"eMail"},
        {id:10,text:"Misc"},
        {id:11,text:"C2"}
    ],
    "system_types":[
        {id:1,text:"Desktop"},
        {id:2,text:"Server"},
        {id:3,text:"Phone"},
        {id:4,text:"Tablet"},
        {id:5,text:"TV"},
        {id:6,text:"Networking device"},
        {id:7,text:"IoT device"},
        {id:8,text:"Other"},
        {id:9,text:"Attacker Infra"}
    ],
    "verdicts":[
        {id:1,text:"Infected"},
        {id:2,text:"Accessed"},
        {id:3,text:"Commodity"},
        {id:3,text:"Clean"},
    ],
    "status":[
        {id:1,text:"Assigned"},
        {id:2,text:"In Progress"},
        {id:3,text:"Completed"},
        {id:4,text:"Closed"},
        {id:5,text:"Rejected"},
    ],
    "task_types":[
        {id:1,text:"Information request"},
        {id:2,text:"Analysis"},
        {id:3,text:"Deliverable"},
        {id:4,text:"Checkpoint"},
        {id:5,text:"Other"},
    ],
    "direction":[
        {id:1,text:"<-"},
        {id:2,text:"->"},
    ],
    "killchain":[
        { id: 1, text: 'Recon' },
        { id: 2, text: 'Weaponization' },
        { id: 3, text: 'Delivery' },
        { id: 4, text: 'Exploitation' },
        { id: 5, text: 'Installation' },
        { id: 6, text: 'C2' },
        { id: 7, text: 'Actions on Obj.' },
    ],
    "evidence_types":[
        { id: 1, text: 'File' },
        { id: 2, text: 'System Logs' },
        { id: 3, text: 'Network Logs' },
        { id: 4, text: 'Triaged System' },
        { id: 5, text: 'Cloned System' },
        { id: 6, text: 'Memory Dump' },
        { id: 7, text: 'External Source' },
        { id: 8, text: 'Other' },
    ],

    // CTI Mode Fields
    "case_type": "IR", // "IR", "CTI", "ThreatModel", "Hybrid"

    "cti_mode": {
        "enabled": false,
        "primary_objective": "",

        "threat_actor": {
            "name": "",
            "aliases": [],
            "motivation": "",
            "sophistication": "",
            "first_seen": "",
            "last_seen": "",
            "associated_campaigns": [],
            "target_sectors": [],
            "target_geos": []
        },

        "attribution": {
            "confidence": "Unknown",
            "indicators": {
                "infrastructure_overlap": 0,
                "ttp_overlap": 0,
                "target_overlap": 0,
                "temporal_correlation": 0,
                "technical_evidence": 0
            },
            "confidence_notes": ""
        },

        "pyramid_analysis": {
            "hash_values": [],
            "ip_addresses": [],
            "domain_names": [],
            "network_artifacts": [],
            "host_artifacts": [],
            "tools": [],
            "ttps": []
        }
    },

    // Pyramid of Pain levels
    "pyramid_levels": [
        {id: 1, text: "Hash Values", color: "#90EE90"},
        {id: 2, text: "IP Addresses", color: "#FFD700"},
        {id: 3, text: "Domain Names", color: "#FFA500"},
        {id: 4, text: "Network/Host Artifacts", color: "#FF6347"},
        {id: 5, text: "Tools", color: "#DC143C"},
        {id: 6, text: "TTPs", color: "#8B0000"}
    ],

    // Cyber Kill Chain (standalone or linked to timeline)
    "kill_chain": {
        "mode": "linked",
        "stages": [
            {
                "name": "Recon",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "Weaponization",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "Delivery",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "Exploitation",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "Installation",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "C2",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            },
            {
                "name": "Actions on Obj.",
                "techniques": [],
                "indicators": [],
                "notes": "",
                "timeline_refs": [],
                "confidence": 0
            }
        ]
    },

    // Diamond Model
    "diamond_model": {
        "mode": "linked",

        "adversary": {
            "actor_id": "",
            "capability_level": "",
            "intent": "",
            "known_groups": [],
            "timeline_refs": []
        },

        "capability": {
            "tools": [],
            "techniques": [],
            "exploits": [],
            "malware_families": [],
            "timeline_refs": []
        },

        "infrastructure": {
            "c2_servers": [],
            "domains": [],
            "hosting_providers": [],
            "registrars": [],
            "ssl_certs": [],
            "timeline_refs": []
        },

        "victim": {
            "organization": "",
            "sector": "",
            "geography": "",
            "targeted_assets": [],
            "data_targeted": [],
            "timeline_refs": []
        },

        "meta_features": {
            "social_political": "",
            "technology": "",
            "timestamp": ""
        }
    },

    // MITRE ATT&CK integration
    "mitre_attack": {
        "enterprise_version": "",
        "techniques_used": [],
        "tactics_observed": [],
        "matrices_affected": []
    }
}


const misp_attribute_types = [
    { id: 1, text: 'filename' },
    { id: 2, text: 'domain' },
    { id: 3, text: 'ip-dst' },
    { id: 4, text: 'ip-dst|port' },
    { id: 5, text: 'ip-src' },
    { id: 6, text: 'ip-src|port' },
    { id: 7, text: 'md5' },
    { id: 8, text: 'url' },
    { id: 9, text: 'domain|ip' },
];
