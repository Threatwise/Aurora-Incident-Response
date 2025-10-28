// Keep track of the file backing the current data object
let currentfile = ""

// Preparation to support other storage methods like webdav soon
const currentmethod = "file"

// indicates if the user currently has the lock
let lockedByMe = true

// For new Files set case data to the default template
let case_data = data_template


///////////////////////////
// GUI <> Data Functions //
///////////////////////////


/**
 * retrieves all changes from the various grids and transfers them into the global storage json
 */
function syncAllChanges(){
    w2ui.grd_timeline.save()
    case_data.timeline = w2ui.grd_timeline.records
    w2ui.grd_investigated_systems.save()
    case_data.investigated_systems = w2ui.grd_investigated_systems.records
    w2ui.grd_malware.save()
    case_data.malware = w2ui.grd_malware.records
    w2ui.grd_accounts.save()
    case_data.compromised_accounts = w2ui.grd_accounts.records
    w2ui.grd_network.save()
    case_data.network_indicators = w2ui.grd_network.records
    w2ui.grd_exfiltration.save()
    case_data.exfiltration = w2ui.grd_exfiltration.records
    w2ui.grd_osint.save()
    case_data.osint = w2ui.grd_osint.records
    w2ui.grd_systems.save()
    case_data.systems = w2ui.grd_systems.records
    w2ui.grd_actions.save()
    case_data.actions = w2ui.grd_actions.records
    w2ui.grd_casenotes.save()
    case_data.casenotes = w2ui.grd_casenotes.records
    w2ui.grd_investigators.save()
    case_data.investigators = w2ui.grd_investigators.records
    w2ui.grd_evidence.save()
    case_data.evidence = w2ui.grd_evidence.records
    w2ui.grd_email.save()
    case_data.email = w2ui.grd_email.records
    w2ui.grd_files.save()
    case_data.files = w2ui.grd_files.records
    w2ui.grd_processes.save()
    case_data.processes = w2ui.grd_processes.records
    w2ui.grd_web_activity.save()
    case_data.web_activity = w2ui.grd_web_activity.records
    w2ui.grd_persistence.save()
    case_data.persistence = w2ui.grd_persistence.records
    w2ui.grd_threat_intel.save()
    case_data.threat_intel = w2ui.grd_threat_intel.records
    w2ui.grd_campaigns.save()
    case_data.campaigns = w2ui.grd_campaigns.records

    // Data from the case Details popup is stored right to the storage object. So no need to update it here.
}


/**
 * inverse of syncAllChanges. Takes the data from the storage object and loads it into the grids, etc
 * This function invokes the correct storage method for the currenty opened project
 */

function updateSOD(){
    switch(currentmethod){
        case "file":
            return updateSODFile()
        case "webdav":
            return updateSODWebdav()
        default:
            return true
    }
}



/**
 * Get current information from storage file and write to th ui objects.
 */
function updateSODFile() {     const fs = require('node:fs');
    w2utils.lock($( "#main" ),"Loading file...",true)

    const filebuffer = fs.readFileSync(currentfile.toString());
    case_data = JSON.parse(filebuffer);

    w2utils.unlock($( "#main" ))
    if(case_data.hasOwnProperty(storage_format_version) && case_data.storage_format_version < storage_format_version){
        w2alert("You are opening a file created with a newer version of Aurora IR. Please upgrade to the newest version of Aurora IR and try again")
        return false
    }

    w2ui.grd_timeline.records = case_data.timeline
    w2ui.grd_timeline.refresh()
    w2ui.grd_investigated_systems.records = case_data.investigated_systems
    w2ui.grd_investigated_systems.refresh()
    w2ui.grd_malware.records = case_data.malware
    w2ui.grd_malware.refresh()
    w2ui.grd_accounts.records = case_data.compromised_accounts
    w2ui.grd_accounts.refresh()
    w2ui.grd_network.records = case_data.network_indicators
    w2ui.grd_network.refresh()
    w2ui.grd_exfiltration.records = case_data.exfiltration
    w2ui.grd_exfiltration.refresh()
    w2ui.grd_osint.records = case_data.osint
    w2ui.grd_osint.refresh()
    w2ui.grd_systems.records = case_data.systems
    w2ui.grd_systems.refresh()
    w2ui.grd_actions.records = case_data.actions
    w2ui.grd_actions.refresh()
    w2ui.grd_evidence.records = case_data.evidence
    w2ui.grd_evidence.refresh()
    w2ui.grd_investigators.records = case_data.investigators
    w2ui.grd_investigators.refresh()
    w2ui.grd_casenotes.records = case_data.casenotes
    w2ui.grd_casenotes.refresh()
    w2ui.grd_email.records = case_data.email || []
    w2ui.grd_email.refresh()
    w2ui.grd_files.records = case_data.files || []
    w2ui.grd_files.refresh()
    w2ui.grd_processes.records = case_data.processes || []
    w2ui.grd_processes.refresh()
    w2ui.grd_web_activity.records = case_data.web_activity || []
    w2ui.grd_web_activity.refresh()
    w2ui.grd_persistence.records = case_data.persistence || []
    w2ui.grd_persistence.refresh()
    w2ui.grd_threat_intel.records = case_data.threat_intel || []
    w2ui.grd_threat_intel.refresh()
    w2ui.grd_campaigns.records = case_data.campaigns || []
    w2ui.grd_campaigns.refresh()

    if(lockedByMe) { // can only update editables when the fields are editable

        w2ui['grd_timeline'].getColumn('owner').editable.items = case_data.investigators
        w2ui.grd_timeline.getColumn('event_host').editable.items = case_data.systems
        w2ui.grd_timeline.getColumn('event_source_host').editable.items = case_data.systems
        w2ui.grd_timeline.getColumn('direction').editable.items = case_data.direction
        w2ui.grd_timeline.getColumn('killchain').editable.items = case_data.killchain
        w2ui.grd_timeline.getColumn('mitre_attack').editable.items = case_data.attack_techniques
    }

    // Data from the case Details popup is taken right from the storage object. So no need to update it here.
    return true
}


function updateSODWebdav() {
    alert("Not implemented yet.")
    return true
}


//////////////////
// SOD Handling //
//////////////////

/**
 * Clears all grids and creates a new case_data object from the template
 */
function newSOD() {
    w2confirm('Are you sure you want to create a new SOD? All unsaved data will be lost.', function btn(answer) {
        if (answer == "Yes") {
            case_data = data_template
            w2ui.grd_timeline.clear()
            w2ui.grd_timeline.render()
            w2ui.grd_investigated_systems.clear()
            w2ui.grd_investigated_systems.render()
            w2ui.grd_malware.clear()
            w2ui.grd_malware.render()
            w2ui.grd_accounts.clear()
            w2ui.grd_accounts.render()
            w2ui.grd_network.clear()
            w2ui.grd_network.render()
            w2ui.grd_exfiltration.clear()
            w2ui.grd_exfiltration.render()
            w2ui.grd_osint.clear()
            w2ui.grd_osint.render()
            w2ui.grd_systems.clear()
            w2ui.grd_systems.render()
            w2ui.grd_actions.clear()
            w2ui.grd_actions.render()
            w2ui.grd_casenotes.clear()
            w2ui.grd_casenotes.render()
            w2ui.grd_investigators.clear()
            w2ui.grd_investigators.render()
            w2ui.grd_evidence.clear()
            w2ui.grd_evidence.render()
            w2ui.grd_email.clear()
            w2ui.grd_email.render()
            w2ui.grd_files.clear()
            w2ui.grd_files.render()
            w2ui.grd_processes.clear()
            w2ui.grd_processes.render()
            w2ui.grd_web_activity.clear()
            w2ui.grd_web_activity.render()
            w2ui.grd_persistence.clear()
            w2ui.grd_persistence.render()
            w2ui.grd_threat_intel.clear()
            w2ui.grd_threat_intel.render()
            w2ui.grd_campaigns.clear()
            w2ui.grd_campaigns.render()

            currentfile = "";
            deactivateReadOnly()
            stopAutoUpdate()
            startAutoSave()
            const lockstate = "&#128272; Case unlocked (edits allowed)"
            $("#lock").html(lockstate)
            lockedByMe = true

            w2ui.main_layout.content('main', w2ui.grd_timeline);
        }
    });
}


/**
 * Method to invoke when there is reason to save back. Controlled by the
 * currentmethod variable it calls the correct concrete implementation
 */
function saveSOD(){
        switch(currentmethod){
        case "file":
            return saveSODFile()

        case "webdav":
            return saveSODWebdav()
    }
}


/**
 * Method to invoke when there is reason to open. Controlled by the
 * currentmethod variable it calls the correct concrete implementation
 */
function openSOD(){
    switch(currentmethod){
        case "file":
            openSODFile()
            break;

        case "webdav":
            openSODWebdav()
            break
    }
}



/////////////////////////////
///// VersionManagement /////
/////////////////////////////
/**
 * These are The updates that need to be made to an older sod file. This functionality was first introduced with
 * Storage file version 3. So 2->3 is the first fix here. Whenever we update the storage file format version we need
 * to supply patches here to lift the old file format to the new file format.
 */
function updateVersion(current_version){
    case_data.storage_format_version = storage_format_version

    // 2 -> 3
    if(current_version<3) {
        _upgradeTo3();
    }

    // 3 -> 4
    if(current_version<4) {
        case_data.evidence = []
    }

    // 4 -> 5
    if(current_version<5) {
        _upgradeTo5()
    }

    // 5->6
    if(current_version<6) {
        _upgradeTo6()
    }

    case_data.storage_format_version = 6

    // 6->7
    case_data.storage_format_version = 7

    // 7->8
    if(current_version<8) {
        _upgradeTo8()
    }

    // 8->9: Add CTI fields
    if (current_version < 9) {
        _upgradeTo9();
    }

    // 9->10: Add new investigation grids
    if (current_version < 10) {
        _upgradeTo10();
    }

    case_data.storage_format_version = 10;
}

    function _upgradeTo6() {
        case_data.osint = []
    }

    function _upgradeTo8() {
        case_data.attack_techniques = mitre_attack_techniques
        if(Array.isArray(case_data.timeline)) {
            for (const entry of case_data.timeline) {
                if(entry && typeof entry.mitre_attack === 'object' && entry.mitre_attack.id) {
                    entry.mitre_attack = entry.mitre_attack.id
                }
            }
        }
    }

function _upgradeTo5() {
    case_data.system_types =[
        {id:1,text:"Desktop"},
        {id:2,text:"Server"},
        {id:3,text:"Phone"},
        {id:4,text:"Tablet"},
        {id:5,text:"TV"},
        {id:6,text:"Networking device"},
        {id:7,text:"IoT device"},
        {id:8,text:"Other"},
        {id:8,text:"Attacker Infra"}
    ]

    case_data.event_types.push({id:11, text:"C2"})
    // ensure consistent version progression
    // current_version handling is done in caller
}

function _upgradeTo3() {
    case_data.direction = [{id: 1, text: "<-"}, {id: 2, text: "->"}]
    case_data.killchain = [
        {id: 1, text: 'Recon'},
        {id: 2, text: 'Weaponization'},
        {id: 3, text: 'Delivery'},
        {id: 4, text: 'Exploitation'},
        {id: 5, text: 'Installation'},
        {id: 6, text: 'C2'},
        {id: 7, text: 'Actions on Obj.'},
    ]
}

function _upgradeTo9() {
    case_data.case_type = "IR";
    case_data.cti_mode = {
        enabled: false,
        primary_objective: "",
        threat_actor: {
            name: "",
            aliases: [],
            motivation: "",
            sophistication: "",
            first_seen: "",
            last_seen: "",
            associated_campaigns: [],
            target_sectors: [],
            target_geos: []
        },
        attribution: {
            confidence: "Unknown",
            indicators: {
                infrastructure_overlap: 0,
                ttp_overlap: 0,
                target_overlap: 0,
                temporal_correlation: 0,
                technical_evidence: 0
            },
            confidence_notes: ""
        },
        pyramid_analysis: {
            hash_values: [],
            ip_addresses: [],
            domain_names: [],
            network_artifacts: [],
            host_artifacts: [],
            tools: [],
            ttps: []
        }
    };

    case_data.pyramid_levels = [
        {id: 1, text: "Hash Values", color: "#90EE90"},
        {id: 2, text: "IP Addresses", color: "#FFD700"},
        {id: 3, text: "Domain Names", color: "#FFA500"},
        {id: 4, text: "Network/Host Artifacts", color: "#FF6347"},
        {id: 5, text: "Tools", color: "#DC143C"},
        {id: 6, text: "TTPs", color: "#8B0000"}
    ];

    case_data.kill_chain = {
        mode: "linked",
        stages: [
            { name: "Recon", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "Weaponization", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "Delivery", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "Exploitation", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "Installation", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "C2", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 },
            { name: "Actions on Obj.", techniques: [], indicators: [], notes: "", timeline_refs: [], confidence: 0 }
        ]
    };

    case_data.diamond_model = {
        mode: "linked",
        adversary: { actor_id: "", capability_level: "", intent: "", known_groups: [], timeline_refs: [] },
        capability: { tools: [], techniques: [], exploits: [], malware_families: [], timeline_refs: [] },
        infrastructure: { c2_servers: [], domains: [], hosting_providers: [], registrars: [], ssl_certs: [], timeline_refs: [] },
        victim: { organization: "", sector: "", geography: "", targeted_assets: [], data_targeted: [], timeline_refs: [] },
        meta_features: { social_political: "", technology: "", timestamp: "" }
    };

    case_data.mitre_attack = {
        enterprise_version: "",
        techniques_used: [],
        tactics_observed: [],
        matrices_affected: []
    };
}

function _upgradeTo10() {
    // Add new investigation grid data arrays
    case_data.email = [];
    case_data.files = [];
    case_data.processes = [];
    case_data.web_activity = [];
    case_data.persistence = [];
    case_data.threat_intel = [];
    case_data.campaigns = [];
}






////////////////////////
// Filesystem Storage //
////////////////////////

/**
 * Saves file to drive or share
 */
function saveSODFile(){
    if(case_data.locked && !lockedByMe){
        w2alert("Cannot save. File locked by another analyst." );
        return
    }
    syncAllChanges()
    case_data.storage_format_version=storage_format_version
    if(currentfile == "") {
        const {remote} = require('electron')
        const {dialog} = remote
        const selectedPaths = dialog.showSaveDialog({filters: [{name: "Case File", extensions: ["fox"]}]});
        if (selectedPaths == undefined) {

            w2alert('Could not save case.');
            return false

        }
        currentfile = selectedPaths
    }

    const fs = require('node:fs');
    w2utils.lock($( "#main" ),"Saving file...",true)
    const buffer = Buffer.from(JSON.stringify(case_data,null, "\t"));
    fs.writeFileSync(currentfile.toString(), buffer);
    w2utils.unlock($( "#main" ))
    w2ui.sidebar.bottomHTML = '<div id="lock" style="background-color: #eee; padding: 10px 5px; border-top: 1px solid silver">'+lockstate+'</div>'
    w2ui.sidebar.refresh()

    return true
}

/**
 * Opens SOD file from Disk or Share
 */
function openSODFile() {
    w2confirm('Are you sure you want to open a SOD? All unsaved data in the current one will be lost.', function btn(answer) {
        if (answer == "Yes") {
            const {remote} = require('electron')
            const {dialog} = remote
            const path = dialog.showOpenDialog({filters:[{name:"Case File",extensions:["fox"]}]});

            if(path == undefined) return;
            currentfile = path

            const fs = require('node:fs');

            const filebuffer = fs.readFileSync(path.toString());
            case_data = JSON.parse(filebuffer);

            if(case_data.hasOwnProperty(storage_format_version) && case_data.storage_format_version < storage_format_version){
                w2alert("You are opening a file created with a newer version of Aurora IR. Please upgrade to the newest version of Aurora IR and try again")
                return
            }

            if(case_data.storage_format_version< storage_format_version){
                updateVersion(case_data.storage_format_version)
            }

            w2ui.grd_timeline.records = case_data.timeline
            w2ui.grd_timeline.refresh()
            w2ui.grd_investigated_systems.records = case_data.investigated_systems
            w2ui.grd_investigated_systems.refresh()
            w2ui.grd_malware.records = case_data.malware
            w2ui.grd_malware.refresh()
            w2ui.grd_accounts.records = case_data.compromised_accounts
            w2ui.grd_accounts.refresh()
            w2ui.grd_network.records = case_data.network_indicators
            w2ui.grd_network.refresh()
            w2ui.grd_exfiltration.records = case_data.exfiltration
            w2ui.grd_exfiltration.refresh()
            w2ui.grd_osint.records = case_data.osint
            w2ui.grd_osint.refresh()
            w2ui.grd_systems.records = case_data.systems
            w2ui.grd_systems.refresh()
            w2ui.grd_actions.records = case_data.actions
            w2ui.grd_actions.refresh()
            w2ui.grd_evidence.records = case_data.evidence
            w2ui.grd_evidence.refresh()
            w2ui.grd_investigators.records = case_data.investigators
            w2ui.grd_investigators.refresh()
            w2ui.grd_casenotes.records = case_data.casenotes
            w2ui.grd_casenotes.refresh()
            w2ui.grd_email.records = case_data.email || []
            w2ui.grd_email.refresh()
            w2ui.grd_files.records = case_data.files || []
            w2ui.grd_files.refresh()
            w2ui.grd_processes.records = case_data.processes || []
            w2ui.grd_processes.refresh()
            w2ui.grd_web_activity.records = case_data.web_activity || []
            w2ui.grd_web_activity.refresh()
            w2ui.grd_persistence.records = case_data.persistence || []
            w2ui.grd_persistence.refresh()
            w2ui.grd_threat_intel.records = case_data.threat_intel || []
            w2ui.grd_threat_intel.refresh()
            w2ui.grd_campaigns.records = case_data.campaigns || []
            w2ui.grd_campaigns.refresh()

            w2ui['grd_timeline'].getColumn('owner').editable.items = case_data.investigators
            w2ui.grd_timeline.getColumn('event_host').editable.items = case_data.systems
            w2ui.grd_timeline.getColumn('event_source_host').editable.items = case_data.systems

            w2ui.main_layout.content('main', w2ui.grd_timeline);
            w2ui.sidebar.select('timeline')

            // check if its locked
            if (case_data.locked){
                w2alert("The SOD is locked by another analyst. Opening in Readonly mode.")
                lockedByMe = false
                activateReadOnly()
                stopAutoSave()
                startAutoUpdate()
            }
            else {

                requestLock(true)
            }

            w2ui.main_layout.content('main', w2ui.grd_timeline);
        }
    });
}



////////////////////
// Webdav Storage //
////////////////////

/**
 * Saves file to webdav
 */
function saveSODWebdav() {
    alert("Not implemented yet.")
    return true
}

/**
 * Opens file from webdav
 */
function openSODWebdav() {
    alert("Not implemented yet.")
}


/////////////////////
// Lock Management //
/////////////////////

/**
 * The user wants to lock the file so editing is possible
 */
function lockSOD(){ // check if it is still needed - switched everything over to requestlock()

    case_data.locked=true
    lockedByMe = true
    const fs = require('node:fs');
    const buffer = Buffer.from(JSON.stringify(case_data,null, "\t"));
    fs.writeFileSync(currentfile.toString(), buffer);
    deactivateReadOnly()
    saveSOD()

}

/**
 * The user releases the file so anyone else can successfully obtain the lock
 */
function releaseLock(){
    case_data.locked = false
    saveSOD()
    lockedByMe = false
    activateReadOnly()
    stopAutoSave()
    startAutoUpdate()
}

/**
 * Try to obtain the lock to make the data editable
 * @param sodiscurrent - if this method is called right after a sod was loaded there is no need to load it again to check the lock state.
 */
function requestLock(sodiscurrent) {
    if (sodiscurrent !== true) {
        if (updateSOD() === false) {
            activateReadOnly()
            w2alert("You are opening a file created with a newer version of Aurora IR. Please upgrade to the newest version of Aurora IR and try again")
            return
        }
    }

    if(case_data.locked) {
        w2alert("The SOD is still locked by another analyst.")
        return
    }

    stopAutoUpdate()
    startAutoSave()
    deactivateReadOnly()

    let lockstate = "&#128272; Case unlocked (edits allowed)"

    $( "#lock" ).html(lockstate)
    lockedByMe = true
    case_data.locked=true

    saveSOD()
}

/**
 * Forces the lock. Data could become inconsistent
 */
function forceUnLock() {
    w2confirm('You are about to force-aqcuire the lock on the file. If anyone else still has the file opened it might lead to data loss.', function btn(answer) {
        if (answer == "No") {
            return
        }
        else {
            if (updateSOD() === false) {
                activateReadOnly()
                w2alert("You are opening a file created with a newer version of Aurora IR. Please upgrade to the newest version of Aurora IR and try again.")
                return
            }

            stopAutoUpdate()
            startAutoSave()
            deactivateReadOnly()
            const lockstate = "&#128272; Case unlocked (edits allowed)"
            $( "#lock" ).html(lockstate)
            lockedByMe = true
            case_data.locked=true

            // Deal with save button
            w2ui['toolbar'].enable('file:save_sod');

            // Deal with locks
            w2ui['toolbar'].enable('file:release_lock');
            w2ui['toolbar'].disable('file:request_lock');
            w2ui['toolbar'].disable('file:force_unlock');
            saveSOD()
        }
    })
}




//////////////////////
// Helper Functions //
//////////////////////


/**
 * Returns the next useable recid for a grid. A bit clunky this workaround but needed for w2ui
 * @param grid - W2ui Grid object
 */
function getNextRECID(grid){

    // make sure all the gui entries are already in the records array. That makes the red flags in the grid boxes go away as an additional result
    grid.save()

    if(grid.records.length < 1) {
        return 1
    }

    let highest = 1;

    for (const rec of grid.records) {
        const recid = rec.recid
        if (recid > highest) highest = recid
    }
    // return an id one higher then the existing highest
    return highest+1
}



/////////////////////////
///// Timer Control /////
/////////////////////////

let autosave_interval = null   // for write mode
let autoupdate_interval = null // for readonly mode


/**
 * Autosave mode is activated when the user has the write lock. The Current state will be saved to the storage file every 5 minutes.
 */
function startAutoSave(){

    autosave_interval = setInterval(saveSOD, 5 * 60 * 1000); // autosave all 5 minutes
}

function stopAutoSave(){

    clearInterval(autosave_interval);
}

/**
 * AutoUpdate mode is activated when the user is in read-only mode. The current state will be read from the storage file every minute and pushed into the gui.
 */
function startAutoUpdate(){

    autoupdate_interval = setInterval(updateSOD, 60 * 1000); // autoupdate every minute
}

function stopAutoUpdate(){

    clearInterval(autoupdate_interval)
}



/////////////////////////////
///// Systems Management ////
/////////////////////////////

function updateSystems(event){
    const old_system = event.value_original
    const new_system = event.value_new

    if(old_system=="" || old_system==null) return; // don't override all fields with new values when the old value was an empty field
    // delegate work to helpers to keep complexity down
    _updateSystemsTimeline(old_system, new_system);
    _updateSystemsInvestigated(old_system, new_system);
    _updateSystemsMalware(old_system, new_system);
    _updateSystemsExfil(old_system, new_system);
}

function _updateSystemsTimeline(old_system, new_system) {
    const records = w2ui.grd_timeline.records || [];
    for (const rec of records){
        const system1 = rec.event_host
        const system2 = rec.event_source_host
        if(system1 == old_system ) rec.event_host = new_system
        if(system2 == old_system) rec.event_source_host = new_system
    }
}

function _updateSystemsInvestigated(old_system, new_system) {
    const records = w2ui.grd_investigated_systems.records || [];
    for (const rec of records){
        const system1 = rec.hostname
        if(system1 == old_system) rec.hostname = new_system
    }
}

function _updateSystemsMalware(old_system, new_system) {
    const records = w2ui.grd_malware.records || [];
    for (const rec of records){
        const system1 = rec.hostname
        if(system1 == old_system) rec.hostname = new_system
    }
}

function _updateSystemsExfil(old_system, new_system) {
    const records = w2ui.grd_exfiltration.records || [];
    for (const rec of records){
        const system1 = rec.stagingsystem
        const system2 = rec.original
        const system3 = rec.exfil_to
        if(system1 == old_system) rec.stagingsystem = new_system
        if(system2 == old_system) rec.original = new_system
        if(system3 == old_system) rec.exfil_to = new_system
    }
}

///////////////
///// IPC /////
///////////////

function cleanup (){

    if(case_data.locked && lockedByMe){
        case_data.locked=false
        saveSOD()
        const remote = require('electron').remote
        remote.getGlobal('Dirty').is_dirty = false   // file on drive/server is unlocked again
        let w = remote.getCurrentWindow()
        w.close()
    } else {
        const remote = require('electron').remote
        remote.getGlobal('Dirty').is_dirty = false   // file on drive/server is unlocked again
        let w = remote.getCurrentWindow()
        w.close()
    }

}


///////////////////////
// CTI Analytics     //
///////////////////////

// Internal helpers to keep the public analytics functions small and easier to test
function _updateCoverageForEvent(event, coverage) {
    if (!event.killchain) return;
    const stage = typeof event.killchain === 'object' ? event.killchain.text : event.killchain;
    if (!coverage[stage]) return;

    coverage[stage].covered = true;
    coverage[stage].count++;

    if (!event.date_time) return;
    const eventTime = new Date(event.date_time);

    if (!coverage[stage].earliest || eventTime < coverage[stage].earliest) {
        coverage[stage].earliest = eventTime;
    }
    if (!coverage[stage].latest || eventTime > coverage[stage].latest) {
        coverage[stage].latest = eventTime;
    }
}

function _countPyramidFrom(items, getPid, distribution, pyramid_levels) {
    if (!items) return 0;
    let added = 0;
    for (const it of items) {
        const pid = getPid(it);
        if (pid === undefined || pid === null || !pyramid_levels) continue;
        let level = null;
        if (typeof pid === 'string') {
            level = pyramid_levels.find(l => l.text === pid || String(l.id) === pid);
        } else {
            level = pyramid_levels.find(l => l.id == pid);
        }
        if (level && distribution[level.text]) {
            distribution[level.text].count++;
            added++;
        }
    }
    return added;
}

function _processMitreEvent(event, techniques) {
    if (!event.mitre_attack) return;
    const technique = typeof event.mitre_attack === 'object' ? event.mitre_attack.text : event.mitre_attack;
    if (!techniques[technique]) {
        techniques[technique] = {
            count: 0,
            systems: new Set(),
            earliest: null,
            latest: null
        };
    }

    techniques[technique].count++;
    if (event.event_host) techniques[technique].systems.add(event.event_host);

    if (event.date_time) {
        const eventTime = new Date(event.date_time);
        if (!techniques[technique].earliest || eventTime < techniques[technique].earliest) {
            techniques[technique].earliest = eventTime;
        }
        if (!techniques[technique].latest || eventTime > techniques[technique].latest) {
            techniques[technique].latest = eventTime;
        }
    }
}

function _classifyTimelinePyramid(pyramid) {
    if (!case_data.timeline) return;
    const ttpLabel = _pyramidLevelText(6);
    for (const event of case_data.timeline) {
        if (event.mitre_attack) {
            pyramid.ttps.push({ type: 'timeline', recid: event.recid, technique: event.mitre_attack });
            event.pyramid_pain = ttpLabel; // TTPs
        }
    }
}

function _classifyMalwarePyramid(pyramid) {
    if (!case_data.malware) return;
    const hashLabel = _pyramidLevelText(1);
    const toolLabel = _pyramidLevelText(5);
    for (const malware of case_data.malware) {
        if (malware.md5) {
            pyramid.hash_values.push({ type: 'hash', recid: malware.recid, value: malware.md5 });
            malware.pyramid_pain = hashLabel; // Hash
        }
        if (malware.text) {
            pyramid.tools.push({ type: 'tool', recid: malware.recid, name: malware.text });
            if (malware.pyramid_pain === hashLabel) malware.pyramid_pain = toolLabel;
        }
    }
}

function _classifyNetworkPyramid(pyramid) {
    if (!case_data.network_indicators) return;
    const ipLabel = _pyramidLevelText(2);
    const domainLabel = _pyramidLevelText(3);
    for (const indicator of case_data.network_indicators) {
        if (indicator.ip) {
            pyramid.ip_addresses.push({ type: 'ip', recid: indicator.recid, value: indicator.ip });
            indicator.pyramid_pain = ipLabel; // IP
        }
        if (indicator.domainname) {
            pyramid.domain_names.push({ type: 'domain', recid: indicator.recid, value: indicator.domainname });
            indicator.pyramid_pain = domainLabel;
        }
    }
}

function _pyramidLevelText(id) {
    if (!case_data.pyramid_levels) return id;
    const level = case_data.pyramid_levels.find(l => l.id === id);
    return level ? level.text : id;
}

/**
 * Analyze kill chain coverage based on timeline events
 * Returns object with stage completion and event counts
 */
function analyzeKillChain() {
    const coverage = {
        'Recon': { covered: false, count: 0, earliest: null, latest: null },
        'Weaponization': { covered: false, count: 0, earliest: null, latest: null },
        'Delivery': { covered: false, count: 0, earliest: null, latest: null },
        'Exploitation': { covered: false, count: 0, earliest: null, latest: null },
        'Installation': { covered: false, count: 0, earliest: null, latest: null },
        'C2': { covered: false, count: 0, earliest: null, latest: null },
        'Actions on Obj.': { covered: false, count: 0, earliest: null, latest: null }
    };

    syncAllChanges();

    if (case_data.timeline) {
        for (const event of case_data.timeline) {
            _updateCoverageForEvent(event, coverage);
        }
    }

    return coverage;
}

/**
 * Analyze Pyramid of Pain distribution across all indicators
 * Returns counts and percentages for each level
 */
function analyzePyramidOfPain() {
    const distribution = {};

    // Initialize counters
    if (case_data.pyramid_levels) {
        for (const level of case_data.pyramid_levels) {
            distribution[level.text] = { count: 0, percentage: 0, color: level.color };
        }
    }

    syncAllChanges();

    let total = 0;
    // Use helper to count contributions from different collections
    total += _countPyramidFrom(case_data.timeline, it => it.pyramid_pain, distribution, case_data.pyramid_levels);
    total += _countPyramidFrom(case_data.malware, it => it.pyramid_pain, distribution, case_data.pyramid_levels);
    total += _countPyramidFrom(case_data.network_indicators, it => it.pyramid_pain, distribution, case_data.pyramid_levels);

    // Calculate percentages
    for (const key of Object.keys(distribution)) {
        distribution[key].percentage = total > 0 ?
            Math.round((distribution[key].count / total) * 100) : 0;
    }

    return { distribution, total };
}

/**
 * Generate MITRE ATT&CK technique frequency report
 */
function analyzeMitreAttack() {
    const techniques = {};

    syncAllChanges();

    if (case_data.timeline) {
        for (const event of case_data.timeline) {
            _processMitreEvent(event, techniques);
        }
    }

    // Convert Sets to arrays for serialization
    for (const key of Object.keys(techniques)) {
        techniques[key].systems = Array.from(techniques[key].systems);
    }

    return techniques;
}

/**
 * Generate comprehensive CTI summary report
 */
function generateCTISummary() {
    const killchain = analyzeKillChain();
    const pyramid = analyzePyramidOfPain();
    const mitre = analyzeMitreAttack();

    return {
        case_name: case_data.case_id || "Unnamed Case",
        threat_actor: case_data.cti_mode?.threat_actor?.name ?? "Unknown",
        attribution_confidence: case_data.cti_mode?.attribution?.confidence ?? "Unknown",
        attack_narrative: case_data.summary || "",
        killchain_analysis: killchain,
        pyramid_analysis: pyramid,
        mitre_techniques: mitre,
        generated_at: new Date().toISOString()
    };
}

/**
 * Auto-classify all indicators into Pyramid of Pain levels
 */
function classifyIndicatorsPyramid() {
    syncAllChanges();

    if (!case_data.cti_mode || !case_data.pyramid_levels) {
        w2alert('CTI mode not initialized');
        return;
    }

    const pyramid = case_data.cti_mode.pyramid_analysis;

    // Clear existing
    for (const key of Object.keys(pyramid)) pyramid[key] = [];

    // Run classification helpers
    _classifyTimelinePyramid(pyramid);
    _classifyMalwarePyramid(pyramid);
    _classifyNetworkPyramid(pyramid);

    // Update grids
    if (w2ui.grd_timeline) w2ui.grd_timeline.refresh();
    if (w2ui.grd_malware) w2ui.grd_malware.refresh();
    if (w2ui.grd_network) w2ui.grd_network.refresh();

    saveSOD();
}
