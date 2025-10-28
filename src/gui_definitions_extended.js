/**
 * Extended Grid Definitions for New Investigation Areas
 * These grids extend the Investigation section with additional data collection capabilities
 */

const extended_grids = {

    /////////////////////////
    ///// EMAIL GRID /////
    /////////////////////////

    grd_email: {
        name: 'grd_email',
        show: {
            toolbar: true,
            footer: true
        },
        menu: [
            { id: "duplicate", text: 'Duplicate Line', icon: 'fa fa-copy'},
            { id: "to_tl", text: 'To Timeline', icon: 'fa fa-clock-o' },
        ],
        multiSearch: true,
        searches: [
            { field: 'subject', caption: 'Subject', type: 'text' },
            { field: 'sender', caption: 'Sender', type: 'text' },
            { field: 'recipient', caption: 'Recipient', type: 'text' },
            { field: 'sender_ip', caption: 'Sender IP', type: 'text' },
            { field: 'email_type', caption: 'Type', type: 'list', options:{items:['Phishing', 'Spear Phishing', 'Business Email Compromise', 'Malware Delivery', 'C2 Communication', 'Data Exfiltration', 'Other']} },
        ],
        columns: [
            { field: 'date_received', sortable: true, caption: 'Date Received', type:'datetime', size: '140px', editable: { type: 'datetime' } },
            { field: 'subject', sortable: true, caption: 'Subject', size: '200px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'sender', sortable: true, caption: 'Sender', size: '150px', editable: { type: 'text', min: 0, max: 200 } },
            { field: 'recipient', sortable: true, caption: 'Recipient', size: '150px', editable: { type: 'text', min: 0, max: 200 } },
            { field: 'sender_ip', sortable: true, caption: 'Sender IP', size: '110px', editable: { type: 'text', min: 0, max: 45 } },
            { field: 'email_type', sortable: true, caption: 'Type', size: '120px',
                editable: { type: 'list', items: ['Phishing', 'Spear Phishing', 'Business Email Compromise', 'Malware Delivery', 'C2 Communication', 'Data Exfiltration', 'Other'], showAll: true }
            },
            { field: 'attachment', sortable: true, caption: 'Attachment', size: '150px', editable: { type: 'text', min: 0, max: 300 } },
            { field: 'attachment_hash', sortable: true, caption: 'Hash', size: '100px', editable: { type: 'text', min: 0, max: 64 } },
            { field: 'headers', caption: 'Email Headers', size: '100%', info: true, editable: { type: 'text', min: 0, max: 2000 } },
            { field: 'notes', caption: 'Notes', size: '150px', editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Email', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Email', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    ///////////////////////////////////
    ///// FILES & REGISTRY GRID /////
    ///////////////////////////////////

    grd_files: {
        name: 'grd_files',
        show: {
            toolbar: true,
            footer: true
        },
        menu: [
            { id: "duplicate", text: 'Duplicate Line', icon: 'fa fa-copy'},
            { id: "to_tl", text: 'To Timeline', icon: 'fa fa-clock-o' },
            { id: "vt", text: 'Check VirusTotal', icon: 'fa fa-shield' },
        ],
        multiSearch: true,
        searches: [
            { field: 'hostname', caption: 'Hostname', type: 'text' },
            { field: 'file_path', caption: 'File Path', type: 'text' },
            { field: 'file_name', caption: 'Filename', type: 'text' },
            { field: 'file_hash', caption: 'Hash', type: 'text' },
            { field: 'artifact_type', caption: 'Type', type: 'list', options:{items:['File', 'Registry Key', 'Registry Value', 'Directory', 'Symbolic Link']} },
        ],
        columns: [
            { field: 'date_found', sortable: true, caption: 'Date Found', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'hostname', sortable: true, caption: 'Hostname', size: '120px', editable: { type: 'list', items: case_data.systems, showAll: true, match: 'contains' } },
            { field: 'artifact_type', sortable: true, caption: 'Type', size: '100px',
                editable: { type: 'list', items: ['File', 'Registry Key', 'Registry Value', 'Directory', 'Symbolic Link'], showAll: true }
            },
            { field: 'file_path', sortable: true, caption: 'Path', size: '200px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'file_name', sortable: true, caption: 'Filename', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'file_hash', sortable: true, caption: 'Hash (MD5/SHA256)', size: '150px', editable: { type: 'text', min: 0, max: 64 } },
            { field: 'file_size', sortable: true, caption: 'Size (bytes)', size: '100px', type: 'int', editable: { type: 'int' } },
            { field: 'creation_time', sortable: true, caption: 'Created', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'modification_time', sortable: true, caption: 'Modified', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'vt', sortable: true, caption: 'VT', size: '60px',
                render: function(record) {
                    if (record.vt === 'infected') return '<span style="color: red; font-weight: bold;">Malicious</span>';
                    if (record.vt === 'clean') return '<span style="color: green;">Clean</span>';
                    if (record.vt === 'noresult') return '<span style="color: gray;">No Result</span>';
                    return '';
                }
            },
            { field: 'notes', caption: 'Notes', size: '100%', info: true, editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Artifact', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Artifact', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    /////////////////////////////////////
    ///// PROCESS EXECUTION GRID /////
    /////////////////////////////////////

    grd_processes: {
        name: 'grd_processes',
        show: {
            toolbar: true,
            footer: true
        },
        menu: [
            { id: "duplicate", text: 'Duplicate Line', icon: 'fa fa-copy'},
            { id: "to_tl", text: 'To Timeline', icon: 'fa fa-clock-o' },
        ],
        multiSearch: true,
        searches: [
            { field: 'hostname', caption: 'Hostname', type: 'text' },
            { field: 'process_name', caption: 'Process Name', type: 'text' },
            { field: 'command_line', caption: 'Command Line', type: 'text' },
            { field: 'parent_process', caption: 'Parent Process', type: 'text' },
            { field: 'user', caption: 'User', type: 'text' },
        ],
        columns: [
            { field: 'execution_time', sortable: true, caption: 'Execution Time', type:'datetime', size: '140px', editable: { type: 'datetime' } },
            { field: 'hostname', sortable: true, caption: 'Hostname', size: '120px', editable: { type: 'list', items: case_data.systems, showAll: true, match: 'contains' } },
            { field: 'process_name', sortable: true, caption: 'Process Name', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'process_id', sortable: true, caption: 'PID', size: '70px', type: 'int', editable: { type: 'int' } },
            { field: 'parent_process', sortable: true, caption: 'Parent Process', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'parent_pid', sortable: true, caption: 'Parent PID', size: '80px', type: 'int', editable: { type: 'int' } },
            { field: 'user', sortable: true, caption: 'User', size: '100px', editable: { type: 'text', min: 0, max: 100 } },
            { field: 'command_line', caption: 'Command Line', size: '100%', info: true, editable: { type: 'text', min: 0, max: 2000 } },
            { field: 'notes', caption: 'Notes', size: '150px', editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Process', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Process', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    /////////////////////////////////
    ///// WEB ACTIVITY GRID /////
    /////////////////////////////////

    grd_web_activity: {
        name: 'grd_web_activity',
        show: {
            toolbar: true,
            footer: true
        },
        menu: [
            { id: "duplicate", text: 'Duplicate Line', icon: 'fa fa-copy'},
            { id: "to_network", text: 'To Network Indicators', icon: 'fa fa-sitemap' },
        ],
        multiSearch: true,
        searches: [
            { field: 'url', caption: 'URL', type: 'text' },
            { field: 'hostname', caption: 'Hostname', type: 'text' },
            { field: 'domain', caption: 'Domain', type: 'text' },
            { field: 'url_type', caption: 'Type', type: 'list', options:{items:['C2 Callback', 'Malware Download', 'Phishing Page', 'Web Shell', 'Data Exfiltration', 'Exploit Kit', 'Other']} },
        ],
        columns: [
            { field: 'date_observed', sortable: true, caption: 'Date Observed', type:'datetime', size: '140px', editable: { type: 'datetime' } },
            { field: 'hostname', sortable: true, caption: 'Source Host', size: '120px', editable: { type: 'list', items: case_data.systems, showAll: true, match: 'contains' } },
            { field: 'url', sortable: true, caption: 'URL', size: '250px', editable: { type: 'text', min: 0, max: 2000 } },
            { field: 'domain', sortable: true, caption: 'Domain', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'ip_address', sortable: true, caption: 'IP Address', size: '110px', editable: { type: 'text', min: 0, max: 45 } },
            { field: 'url_type', sortable: true, caption: 'Type', size: '120px',
                editable: { type: 'list', items: ['C2 Callback', 'Malware Download', 'Phishing Page', 'Web Shell', 'Data Exfiltration', 'Exploit Kit', 'Other'], showAll: true }
            },
            { field: 'http_method', sortable: true, caption: 'Method', size: '80px', editable: { type: 'text', min: 0, max: 10 } },
            { field: 'user_agent', sortable: true, caption: 'User Agent', size: '150px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'notes', caption: 'Notes', size: '100%', info: true, editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add URL', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove URL', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    ////////////////////////////////////
    ///// PERSISTENCE GRID /////
    ////////////////////////////////////

    grd_persistence: {
        name: 'grd_persistence',
        show: {
            toolbar: true,
            footer: true
        },
        menu: [
            { id: "duplicate", text: 'Duplicate Line', icon: 'fa fa-copy'},
            { id: "to_tl", text: 'To Timeline', icon: 'fa fa-clock-o' },
        ],
        multiSearch: true,
        searches: [
            { field: 'hostname', caption: 'Hostname', type: 'text' },
            { field: 'persistence_type', caption: 'Type', type: 'list', options:{items:['Scheduled Task', 'Service', 'Registry Run Key', 'Startup Folder', 'WMI Event', 'DLL Hijacking', 'Account Manipulation', 'Other']} },
            { field: 'name', caption: 'Name', type: 'text' },
            { field: 'path', caption: 'Path', type: 'text' },
        ],
        columns: [
            { field: 'date_discovered', sortable: true, caption: 'Discovered', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'hostname', sortable: true, caption: 'Hostname', size: '120px', editable: { type: 'list', items: case_data.systems, showAll: true, match: 'contains' } },
            { field: 'persistence_type', sortable: true, caption: 'Type', size: '130px',
                editable: { type: 'list', items: ['Scheduled Task', 'Service', 'Registry Run Key', 'Startup Folder', 'WMI Event', 'DLL Hijacking', 'Account Manipulation', 'Other'], showAll: true }
            },
            { field: 'name', sortable: true, caption: 'Name', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'path', sortable: true, caption: 'Path/Command', size: '200px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'trigger', sortable: true, caption: 'Trigger/Schedule', size: '120px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'user_context', sortable: true, caption: 'User Context', size: '100px', editable: { type: 'text', min: 0, max: 100 } },
            { field: 'mitre_technique', sortable: true, caption: 'MITRE Technique', size: '120px', 
                editable: { type: 'list', items: case_data.attack_techniques, showAll: true, match: 'contains' }
            },
            { field: 'notes', caption: 'Notes', size: '100%', info: true, editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Mechanism', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Mechanism', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    ///////////////////////////////////////
    ///// THREAT INTELLIGENCE GRID /////
    ///////////////////////////////////////

    grd_threat_intel: {
        name: 'grd_threat_intel',
        show: {
            toolbar: true,
            footer: true
        },
        multiSearch: true,
        searches: [
            { field: 'indicator', caption: 'Indicator', type: 'text' },
            { field: 'indicator_type', caption: 'Type', type: 'list', options:{items:['IP Address', 'Domain', 'URL', 'File Hash', 'Email', 'CVE', 'YARA Rule', 'Other']} },
            { field: 'threat_type', caption: 'Threat Type', type: 'text' },
            { field: 'source', caption: 'Source', type: 'text' },
        ],
        columns: [
            { field: 'date_added', sortable: true, caption: 'Date Added', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'indicator', sortable: true, caption: 'Indicator', size: '200px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'indicator_type', sortable: true, caption: 'Type', size: '100px',
                editable: { type: 'list', items: ['IP Address', 'Domain', 'URL', 'File Hash', 'Email', 'CVE', 'YARA Rule', 'Other'], showAll: true }
            },
            { field: 'threat_type', sortable: true, caption: 'Threat Type', size: '120px', editable: { type: 'text', min: 0, max: 100 } },
            { field: 'confidence', sortable: true, caption: 'Confidence', size: '90px',
                editable: { type: 'list', items: ['High', 'Medium', 'Low', 'Unknown'], showAll: true }
            },
            { field: 'source', sortable: true, caption: 'Source', size: '120px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'first_seen', sortable: true, caption: 'First Seen', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'last_seen', sortable: true, caption: 'Last Seen', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'tags', sortable: true, caption: 'Tags', size: '120px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'notes', caption: 'Context/Description', size: '100%', info: true, editable: { type: 'text', min: 0, max: 1500 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Intel', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Intel', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    },


    //////////////////////////////
    ///// CAMPAIGNS GRID /////
    //////////////////////////////

    grd_campaigns: {
        name: 'grd_campaigns',
        show: {
            toolbar: true,
            footer: true
        },
        multiSearch: true,
        searches: [
            { field: 'campaign_name', caption: 'Campaign Name', type: 'text' },
            { field: 'threat_actor', caption: 'Threat Actor', type: 'text' },
            { field: 'campaign_type', caption: 'Type', type: 'text' },
        ],
        columns: [
            { field: 'campaign_name', sortable: true, caption: 'Campaign Name', size: '150px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'threat_actor', sortable: true, caption: 'Threat Actor', size: '120px', editable: { type: 'text', min: 0, max: 255 } },
            { field: 'campaign_type', sortable: true, caption: 'Type', size: '120px', editable: { type: 'text', min: 0, max: 100 } },
            { field: 'first_activity', sortable: true, caption: 'First Activity', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'last_activity', sortable: true, caption: 'Last Activity', type:'datetime', size: '120px', editable: { type: 'datetime' } },
            { field: 'target_sectors', sortable: true, caption: 'Target Sectors', size: '150px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'target_countries', sortable: true, caption: 'Target Countries', size: '120px', editable: { type: 'text', min: 0, max: 500 } },
            { field: 'ttps', sortable: true, caption: 'TTPs', size: '150px', editable: { type: 'text', min: 0, max: 1000 } },
            { field: 'confidence', sortable: true, caption: 'Confidence', size: '90px',
                editable: { type: 'list', items: ['High', 'Medium', 'Low', 'Unknown'], showAll: true }
            },
            { field: 'notes', caption: 'Description', size: '100%', info: true, editable: { type: 'text', min: 0, max: 2000 } },
        ],
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Add Campaign', icon: 'w2ui-icon-plus' },
                { id: 'remove', type: 'button', caption: 'Remove Campaign', icon: 'fa fa-minus' },
                { id: 'import', type: 'button', caption: 'Import CSV', icon: 'fa fa-upload' },
                { id: 'export', type: 'button', caption: 'Export CSV', icon: 'fa fa-download' }
            ],
        },
        records: []
    }
};

// Merge extended grids into config
Object.assign(config, extended_grids);
