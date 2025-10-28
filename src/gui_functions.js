//////////////////////////////
//////// Lock Changes ////////
//////////////////////////////

let lockstate;

/**
 * Change to GUI to read only mode when the user does not have the lock
 */
function activateReadOnly(){
    // Deactivate save button
    w2ui['toolbar'].disable('file:save_sod');

    // Deal with locks
    w2ui['toolbar'].disable('file:release_lock');
    w2ui['toolbar'].enable('file:request_lock');
    w2ui['toolbar'].enable('file:force_unlock');

    //remove buttons in grids
    w2ui.grd_timeline.toolbar.disable("add","remove","import","export")
    w2ui.grd_investigated_systems.toolbar.disable("add","remove","import","export")
    w2ui.grd_malware.toolbar.disable("add","remove","import","export")
    w2ui.grd_accounts.toolbar.disable("add","remove","import","export")
    w2ui.grd_network.toolbar.disable("add","remove","import","export")
    w2ui.grd_exfiltration.toolbar.disable("add","remove","import","export")
    w2ui.grd_osint.toolbar.disable("add","remove","import","export")
    w2ui.grd_systems.toolbar.disable("add","remove","import","export")
    w2ui.grd_actions.toolbar.disable("add","remove","import","export")
    w2ui.grd_casenotes.toolbar.disable("add","remove","import","export")
    w2ui.grd_investigators.toolbar.disable("add","remove","import","export")
    w2ui.grd_evidence.toolbar.disable("add","remove","import","export")

    //deactivate context menus
    deactivate_all_context_items(w2ui.grd_timeline.menu)
    deactivate_all_context_items(w2ui.grd_investigated_systems.menu)
    deactivate_all_context_items(w2ui.grd_malware.menu)
    deactivate_all_context_items(w2ui.grd_accounts.menu)
    deactivate_all_context_items(w2ui.grd_network.menu)
    deactivate_all_context_items(w2ui.grd_exfiltration.menu)
    deactivate_all_context_items(w2ui.grd_osint.menu)
    deactivate_all_context_items(w2ui.grd_systems.menu)
    deactivate_all_context_items(w2ui.grd_investigators.menu)
    deactivate_all_context_items(w2ui.grd_evidence.menu)
    deactivate_all_context_items(w2ui.grd_actions.menu)
    deactivate_all_context_items(w2ui.grd_casenotes.menu)

    lockstate = "&#128274; Case locked (no edits allowed)"
    $( "#lock" ).html(lockstate)

    //deactivate grid editable

    writeprotect_grid(w2ui.grd_timeline)
    writeprotect_grid(w2ui.grd_investigated_systems)
    writeprotect_grid(w2ui.grd_malware)
    writeprotect_grid(w2ui.grd_accounts)
    writeprotect_grid(w2ui.grd_network)
    writeprotect_grid(w2ui.grd_exfiltration)
    writeprotect_grid(w2ui.grd_osint)
    writeprotect_grid(w2ui.grd_systems)
    writeprotect_grid(w2ui.grd_actions)
    writeprotect_grid(w2ui.grd_casenotes)
    writeprotect_grid(w2ui.grd_investigators)
    writeprotect_grid(w2ui.grd_evidence)

    w2ui.grd_timeline.refresh()
    w2ui.grd_investigated_systems.refresh()
    w2ui.grd_malware.refresh()
    w2ui.grd_accounts.refresh()
    w2ui.grd_network.refresh()
    w2ui.grd_exfiltration.refresh()
    w2ui.grd_osint.refresh()
    w2ui.grd_systems.refresh()
    w2ui.grd_actions.refresh()
    w2ui.grd_casenotes.refresh()
    w2ui.grd_investigators.refresh()
    w2ui.grd_evidence.refresh()
}


/**
 * Change to gui to read only mode when the user does not have the lock
 */
function deactivateReadOnly(){
    // Activate save button
    w2ui['toolbar'].enable('file:save_sod');

    // Deal with locks
    w2ui['toolbar'].enable('file:release_lock');
    w2ui['toolbar'].disable('file:request_lock');
    w2ui['toolbar'].disable('file:force_unlock');

    //remove buttons in grids
    w2ui.grd_timeline.toolbar.enable("add","remove","import","export")
    w2ui.grd_investigated_systems.toolbar.enable("add","remove","import","export")
    w2ui.grd_malware.toolbar.enable("add","remove","import","export")
    w2ui.grd_accounts.toolbar.enable("add","remove","import","export")
    w2ui.grd_network.toolbar.enable("add","remove","import","export")
    w2ui.grd_exfiltration.toolbar.enable("add","remove","import","export")
    w2ui.grd_osint.toolbar.enable("add","remove","import","export")
    w2ui.grd_systems.toolbar.enable("add","remove","import","export")
    w2ui.grd_casenotes.toolbar.enable("add","remove","import","export")
    w2ui.grd_investigators.toolbar.enable("add","remove","import","export")
    w2ui.grd_evidence.toolbar.enable("add","remove","import","export")

    lockstate = "&#128272; Case unlocked (edits allowed)"
    $( "#lock" ).html(lockstate)

    //activate grid editable

    writeenable_grid(w2ui.grd_timeline,config.grd_timeline)
    writeenable_grid(w2ui.grd_investigated_systems,config.grd_investigated_systems)
    writeenable_grid(w2ui.grd_malware,config.grd_malware)
    writeenable_grid(w2ui.grd_accounts,config.grd_accounts)
    writeenable_grid(w2ui.grd_network,config.grd_network)
    writeenable_grid(w2ui.grd_exfiltration,config.grd_exfiltration)
    writeenable_grid(w2ui.grd_osint,config.grd_osint)
    writeenable_grid(w2ui.grd_systems,config.grd_systems)
    writeenable_grid(w2ui.grd_actions,config.grd_actions)
    writeenable_grid(w2ui.grd_casenotes,config.grd_casenotes)
    writeenable_grid(w2ui.grd_investigators,config.grd_investigators)
    writeenable_grid(w2ui.grd_evidence,config.grd_evidence)

    //activate context menus
    activate_all_context_items(w2ui.grd_timeline.menu)
    activate_all_context_items(w2ui.grd_investigated_systems.menu)
    activate_all_context_items(w2ui.grd_malware.menu)
    activate_all_context_items(w2ui.grd_accounts.menu)
    activate_all_context_items(w2ui.grd_network.menu)
    activate_all_context_items(w2ui.grd_exfiltration.menu)
    activate_all_context_items(w2ui.grd_osint.menu)
    activate_all_context_items(w2ui.grd_systems.menu)
    activate_all_context_items(w2ui.grd_investigators.menu)
    activate_all_context_items(w2ui.grd_evidence.menu)
    activate_all_context_items(w2ui.grd_actions.menu)
    activate_all_context_items(w2ui.grd_casenotes.menu)

    //repropagate dropdowns
    w2ui.grd_timeline.getColumn('owner').editable.items = case_data.investigators
    w2ui.grd_timeline.getColumn('event_host').editable.items = case_data.systems
    w2ui.grd_timeline.getColumn('event_source_host').editable.items = case_data.systems
    w2ui.grd_timeline.getColumn('direction').editable.items = case_data.direction
    w2ui.grd_investigated_systems.getColumn('analyst').editable.items = case_data.investigators
    w2ui.grd_investigated_systems.getColumn('hostname').editable.items = case_data.systems
    w2ui.grd_malware.getColumn('hostname').editable.items = case_data.systems
    w2ui.grd_network.getColumn('malware').editable.items = case_data.malware
    w2ui.grd_exfiltration.getColumn('stagingsystem').editable.items = case_data.systems
    w2ui.grd_exfiltration.getColumn('original').editable.items = case_data.systems
    w2ui.grd_exfiltration.getColumn('exfil_to').editable.items = case_data.systems
    w2ui.grd_actions.getColumn('owner').editable.items = case_data.investigators
    w2ui.grd_casenotes.getColumn('owner').editable.items = case_data.investigators

    w2ui.grd_timeline.refresh()
    w2ui.grd_investigated_systems.refresh()
    w2ui.grd_malware.refresh()
    w2ui.grd_accounts.refresh()
    w2ui.grd_network.refresh()
    w2ui.grd_exfiltration.refresh()
    w2ui.grd_osint.refresh()
    w2ui.grd_systems.refresh()
    w2ui.grd_actions.refresh()
    w2ui.grd_casenotes.refresh()
    w2ui.grd_investigators.refresh()
    w2ui.grd_evidence.refresh()

    // Note: Case data editing requires additional form validation
}


////////////////////////
//////// Popups ////////
////////////////////////

/**
 * Open the about popup
 */
function openAboutPopup() {

    w2popup.open({
        title: 'About Aurora IR',
        width: 900,
        height: 600,
        showMax: true,
        body: about_content,      //specified in gui_definitions to keep logic and gui as separate as possible
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.popup_layout.resize();
            }
        }
    });
}


/**
 * Show case Details
 */
function openCasePopup() {
    if (case_data.locked && !lockedByMe){
        alert("Can't change case data when the file is locked.")
        return;
    }
    w2ui.case_form.record['caseid']=case_data.case_id
    w2ui.case_form.record['client']=case_data.client
    w2ui.case_form.record['start_date']=case_data.start_date
    w2ui.case_form.record['summary']=case_data.summary
    w2ui.case_form.record['mispserver']=case_data.mispserver
    w2ui.case_form.record['mispapikey']=case_data.mispapikey
    w2ui.case_form.record['mispeventid']=case_data.mispeventid
    w2ui.case_form.record['vtapikey']=case_data.vtapikey

    w2popup.open({
        title: 'Case Details',
        width: 550,
        height: 400,
        showMax: true,
        body: '<div id="main"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('popup_layout')
                w2ui.popup_layout.content('main', w2ui.case_form);
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.popup_layout.resize();
            }
        }
    });
}


/**
 * Prepare and open the popup for malware misp transfer
 * @param recid -record id of right clicked record.
 */
function openMispAddMalwarePopup(recid) {
    const filename = w2ui.grd_malware.get(recid).text
    const path= w2ui.grd_malware.get(recid).path_on_disk

    if (!path) path = ""

    let fullpath= ""

    if (path.endsWith("\\")){
        fullpath = path+filename
    }
    else{
        fullpath = path + "\\" + filename
    }
    const hash = w2ui.grd_malware.get(recid).md5
    const notes = w2ui.grd_malware.get(recid).notes

    //check what type of hash it is
    let hashtype = "none"
    if(hash) {
        hashtype = "md5"
        if (hash.length == 40) hashtype = "sha1"
        if (hash.length == 64) hashtype = "sha256"
    }


    const records = [ {recid:1, aurora_field_type:"Filename",misp_field_type:"filename",value:filename,comment:notes},
                {recid:2, aurora_field_type:"Fullpath",misp_field_type:"filename",value:fullpath,comment:notes},
                {recid:3, aurora_field_type:"Hash",misp_field_type:hashtype,value:hash,comment:notes},
    ]

    w2ui.grd_add_misp.records = records
    w2ui.grd_add_misp.refresh()


    w2popup.open({
        title: 'Add to MISP',
        width: 550,
        height: 400,
        showMax: true,
        body: '<div id="main"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('popup_layout')
                //render grid into form
                w2ui.popup_layout.content('main', w2ui.grd_add_misp);

            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.popup_layout.resize();
            }
        }
    });
}



/**
 * Prepare and open the popup for network misp transfer
 * @param recid -record id of right clicked record.
 */
function openMispAddNetworkPopup(recid) { // Network MISP integration
    const domainname = w2ui.grd_network.get(recid).domainname
    const ip = w2ui.grd_network.get(recid).ip
    const port = w2ui.grd_network.get(recid).port
    const notes = w2ui.grd_network.get(recid).context

    const ip_port = ip + "|" + port

    const records = []

    if (domainname) {
        records.push({
            recid: records.length+1,
            aurora_field_type: "Domain Name",
            misp_field_type: "domain",
            value: domainname,
            comment:notes
        })
    }

    if (ip) {
        records.push({
            recid: records.length + 1,
            aurora_field_type: "IP",
            misp_field_type: "ip-dst",
            value: ip,
            comment: notes
        })
    }

    if (ip && domainname) {
        records.push({
            recid:records.length + 1,
            aurora_field_type: "Domain IP",
            misp_field_type: "domain|ip",
            value: domainname + "|" + ip,
            comment: notes
        })
    }

    if (ip && port) {
        records.push({
            recid: records.length + 1,
            aurora_field_type: "IP Port",
            misp_field_type: "ip-dst|port",
            value: ip + "|" + port,
            comment:notes
        })
    }

    w2ui.grd_add_misp.records = records
    w2ui.grd_add_misp.refresh()

    w2popup.open({
        title: 'Add to MISP',
        width: 550,
        height: 400,
        showMax: true,
        body: '<div id="main"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('popup_layout')
                //render grid into form
                w2ui.popup_layout.content('main', w2ui.grd_add_misp);
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.popup_layout.resize();
            }
        }
    });
}


///////////////////////////////
//////// Timeline View ////////
///////////////////////////////

/**
 * Create Dataset for vis.js timeline view
 * @param tl - timeline object
 * @returns {Array} - vis.js object
 */
function timeline2vis(tl){
    const vis_array=[]

    for(const item of tl) {
        const visual = item.visual;
        if (!visual) {
            continue;
        }
        const event_data = item.event_data;
        const start = item.date_time;

        if (!start) {
            continue;
        } // can't display something without timestamp in a timeline

        let classname = ""

        if (item.event_type == "EventLog") {     // Event type styling configuration
            classname = "log"
        }
        else if (item.event_type == "File") {
            classname = "file"
        }
        else if (item.event_type == "Human") {
            classname = "human"
        }
        else if (item.event_type == "Engagement") {
            classname = "engagement"
        }
        else if (item.event_type == "Lateral Movement") {
            classname = "lateral"
        }
        else if (item.event_type == "Exfil") {
            classname = "exfil"
        }
        else if (item.event_type == "Tanium Trace") {
            classname = "tanium"
        }
        else if (item.event_type == "Malware") {
            classname = "malware"
        }
        else if (item.event_type == "eMail") {
            classname = "email"
        }
        else if (item.event_type == "Misc") {
            classname = "misc"
        }

        let host;
        if (item.event_host == "") {
            host = "N/A"
        } else {
            host = item.event_host
        }
        let source_host;
        if (item.event_source_host == "") {
            source_host = "N/A"
        } else {
            source_host = item.event_source_host
        }

        let systems;
        if (item.direction == "<-") {
            systems = host + " ← " + source_host
        } else if (item.direction == "->") {
            systems = host + " → " + source_host
        } else {
            systems = host + " | " + source_host
        }

        let event_type;
        if (item.event_type) {
            event_type = "<b>[" + item.event_type + "]</b> "
        } else {
            event_type = ""
        }

        vis_array.push(
            {
                id: vis_array.length,
                content: event_type + systems + "<br><small>" + event_data + "</small>",
                start: start.toString(),
                className: classname
            }
        )
    }

    return vis_array
}

/**
 * Display a visual timeline in main
 */
function showTimelineView(){
    syncAllChanges()
    w2ui.main_layout.content(
        'main',
        '<div style="height:100%;width:100%" id="graph"></div>');

    const data = timeline2vis(case_data.timeline)
    if (data.length == 0){
        $('#graph').html("<div style='align-items: center;'><center><h2>No events to display</h2><p>Add new events in the timeline tab first and mark them as 'Visualizable' to show them here.</p></center></div>")
    } else {
        const container = document.getElementById('graph');
        const dataset = new vis.DataSet(data)

        // Configuration for the Timeline
        const options = {};

        // Create a Timeline
        new vis.Timeline(container, dataset, options);
    }
}


///////////////////////////////////////
//////// Lateral Movement View ////////
///////////////////////////////////////

/**
 * Generates the data object for vis.js
 * @param systems
 * @param target_host
 * @returns {"string"}|*}
 */
function getHostIP(systems, target_host) {
    for (const system of systems) {
        if (system.text == target_host) {
            if (system.ip == null) {
                return "N/A"
            } else {
                return system.ip
            }
        }
    }
    return "N/A"
}

/**
 * Generates the data object for vis.js
 * @param systems
 * @param target_host
 * @returns {"string"}|*}
 */
function getHostType(systems, target_host) {
    for (const system of systems) {
        if (system.text == target_host) {
            return system.system_type
        }
    }
    return "Other"
}

/**
 * Generates the data object for vis.js
 * @param data
 * @returns {{nodes: Array, edges: Array}|*}
 */
function getLateralMovements(data){
    const nodes = []
    const edges = []

    const hosts = []      // Stores the label for host i-th
    const types = []      // Stores the type of host i-th


    for (const timelineItem of data.timeline) {
        // Only add when both hosts need to be set
        if (timelineItem.event_host == null || timelineItem.event_source_host == null || timelineItem.event_host == "" || timelineItem.event_source_host == "") {
            continue;
        }

        //only show if visual is activated
        if(!timelineItem.visual || timelineItem.visual ==0) continue;

        // Add hosts
        // ---------

        // Add host 1
        const host1 = timelineItem.event_host
        let idx1 = hosts.indexOf(host1)

        if (idx1 == -1){
            hosts.push(host1)
            types.push(getHostType(data.systems, host1))
            idx1 = hosts.length - 1
        }

        // Add host 2
        const host2 = timelineItem.event_source_host
        let idx2 = hosts.indexOf(host2)
        if (idx2 == -1){
            hosts.push(host2)
            types.push(getHostType(data.systems, host2))
            idx2 = hosts.length - 1
        }

        // Figure out direction
        const direction = timelineItem.direction

        let source = 0;
        let destination = 0;
        if (direction == "->") {
            //from 1 > 2
            source = idx1
            destination = idx2
        }
        else {
            //from 2 > 1
            source = idx2
            destination = idx1
        }

        // Add connections
        // --------------

        // color lateral and exfil differently
        let color = "#cccccc"

        if (timelineItem.event_type == "EventLog") {
            color = "limegreen"
        } else if (timelineItem.event_type == "File") {
            color = "gold"
        } else if (timelineItem.event_type == "Human") {
            color = "palevioletred"
        } else if (timelineItem.event_type == "Engagement") {
            color = "lightskyblue"
        } else if (timelineItem.event_type == "Lateral Movement") {
            color = "lightseagreen"
        } else if (timelineItem.event_type == "Exfil") {
            color = "plum"
        } else if (timelineItem.event_type == "Tanium Trace") {
            color = "palevioletred"
        } else if (timelineItem.event_type == "Malware") {
            color = "firebrick"
        } else if (timelineItem.event_type == "eMail") {
            color = "dodgerblue"
        } else if (timelineItem.event_type == "Misc") {
            color = "darksalmon"
        } else if (timelineItem.event_type == "C2") {
            color = "lightgrey"
        }

        const entry = {
            from: source,
            to: destination,
            arrows: {
                enabled: true,
                type: 'vee',
                to: { enabled: true }
            },
            value: 1,
            smooth: "discrete",
            length: 300,
            color: {
                color: color
            },
            title: "<center><b>[" + timelineItem.event_type + "]</b> " + timelineItem.date_time + "<br><small>" + timelineItem.event_data + "</small></center>"
        }
        edges.push(entry)
    }

    // Build nodes array
    for (let i = 0; i < hosts.length;i++){
        const entry = {
            id: i,
            label: "\n" + hosts[i] + "\n" + getHostIP(data.systems, hosts[i]),
            group: types[i]
        }
        nodes.push(entry)
    }

    const result = {
        nodes: nodes,
        edges:edges
    }

    return result
}

/**
 * Prepare and display the lateral movement view
 */
function showLateralMovement(){
    syncAllChanges()
    w2ui.main_layout.content(
        'main',
        '<div style="height:100%;width:100%" id="graph"></div>'
    )

    const data = getLateralMovements(case_data)
    if (data.nodes.length == 0){
        $('#graph').html("<div style='align-items: center;'><center><h2>No events to display</h2><p>Add new events in the timeline tab first and mark them as 'Visualizable' to show them here.</p></center></div>")
    } else {
        const container = document.getElementById('graph')

        // Configuration for the Timeline
        const options = {
            physics:{
                enabled: false
            },
            edges: {},
            nodes: {
                font: {
                    size: 14
                }
            },
            groups: {
                "Desktop": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        code: '\uf109',
                        size: 50,
                        color: 'cadetblue'
                    }
                },
                "Server": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        code: '\uf233',
                        size: 50,
                        color: 'coral'
                    }
                },
                "Phone": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        weight: "bold",
                        code: "\uf10b",
                        size: 50,
                        color: 'crimson'
                    }
                },
                "Tablet": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        weight: "bold",
                        code: "\uf10a",
                        size: 50,
                        color: 'blueviolet'
                    }
                },
                "TV": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        weight: "bold",
                        code: "\uf26c",
                        size: 50,
                        color: 'darkgoldenrot'
                    }
                },
                "Networking device": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        weight: "bold",
                        code: "\uf0c2",
                        size: 50,
                        color: 'darkblue'
                    }
                },
                "IoT device": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        code: "\uf2db",
                        size: 50,
                        color: 'darkorchid'
                    }
                },
                "Other": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        code: "\uf1e6",
                        size: 50,
                        color: 'dimgray'
                    }
                },
                "Attacker Infra": {
                    shape: 'icon',
                    icon: {
                        //face: "'Font Awesome 5 Free'",
                        face: "FontAwesome",
                        code: "\uf21b",
                        size: 50,
                        color: 'black'
                    }
                }
            }
        }

        new vis.Network(container, data, options);
    }
}



///////////////////////////////
//////// Activity Plot ////////
///////////////////////////////

/**
 * Labels to display in the Activity Plot view
 *
 */
const timeseries_labels = ["00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00","06:00-07:00","07:00-08:00","08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-017:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00","23:00-24:00",]


/**
 * Create a histogram based on event data, do not include engagement management
 * @param tl - Timeline array
 * @returns {number[]} - Number of events
 */
function getActivity(tl){
    const buckets = [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ]

    for(const item of tl){

        if (item.event_type == "Engagement Management") continue; // That's not the attacker working, so we don't want to have it in our histogram

        const date = new Date(item.date_time)
        const hour = date.getHours()
        buckets[hour]++

    }

    console.log(buckets)

    return buckets
}


/**
 * * Loads the activity plot into main
 */
function showActivityPlot(){
    syncAllChanges()

    w2ui.main_layout.content('main', '<div style="width:100%;height:100%,position: relative" ><canvas id="chart"></canvas></div>');
    const chart = document.getElementById('chart');
    const data = getActivity(case_data.timeline)

    new Chart(chart, {
        type: 'bar',
        data: {
            labels: timeseries_labels,
            datasets: [{
                label: 'Activity Distribution (Daytime)',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    })
}

//////////////////////////////////////
//////// Import GUI Functions ////////
//////////////////////////////////////

/**
 * Prepare and open the popup for import column mapping
 * @param recid -record id of right clicked record.
 */
function openImportPopup(fields,content,import_fieldset) {

    const records = []

    const firstline = CSVtoArrayEasy(content[0]) //need that for mapping and can't use it for the editable items as w2ui will mess with it


    for(const field of fields){
        records.push({recid:records.length+1, csv:"", grid:field,fieldname:import_fieldset[records.length]})
    }


    w2ui.grd_import_mapping.getColumn('csv').editable.items = CSVtoArray(content[0])
    w2ui.grd_import_mapping.records = records
    w2ui.grd_import_mapping.refresh()


    w2popup.open({
        title: 'Import Mapping',
        width: 550,
        height: 400,
        showMax: true,
        body: '<div id="main"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('popup_layout')
                //render grid into form
                w2ui.popup_layout.content('main', w2ui.grd_import_mapping);
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.popup_layout.resize();
            }
        }
    });
}




//////////////////////////////////
//////// Helper Functions ////////
//////////////////////////////////

/**
 * This function iterates through all configured columns of the grid and removes the editable object. This leaves all grid fields read only.
 * @param grid - w2ui grid object
 */
function writeprotect_grid(grid) {
    for (let i = 0; i < grid.columns.length; i++){ //disable inline editing for all columns of the grid
        grid.columns[i].editable = null
    }
    grid.refresh()
}

/**
 * reactivate inline editing of a grid
 * @param grid - grid to reanable
 * @param template - template to get the editables from
 */
function writeenable_grid(grid, template){
    for (let i = 0; i < grid.columns.length; i++){ //disable inline editing for all columns of the grid
        grid.columns[i].editable = template.columns[i].editable
    }
    grid.refresh()
}

/**
 * deactivate all context menu items
 * @param menu
 */
function deactivate_all_context_items(menu){
    if (menu == null) return;
    for (let i = 0; i < menu.length; i++){
        menu[i].disabled = true
    }
}

/**
 * deactivate all context menu items
 * @param menu
 */
function activate_all_context_items(menu){
    if (menu == null) return;
    for (let i = 0; i < menu.length; i++){
        menu[i].disabled = false
    }
}
