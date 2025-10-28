/**
 *
 * Opens a web url in an external browser window rather than in the electron app.
 * @param {string} url - url to open in external browser windows
 */
const browser_open = function(url){
    const { shell } = require('electron')
    shell.openExternal(url)
}


/**
 * Duplicate a record from one grid by creating a copy with a new RECID
 * @param {object} grid - w2ui grid object
 * @param {number} recid - record ID to duplicate
 */
function duplicate_record(grid, recid) {
    try {
        const record = grid.get(recid);
        if (!record) {
            logger.error('Record not found for duplication', { recid });
            return;
        }

    // Create a shallow copy and assign new recid
    const newRecord = { ...record };
    newRecord.recid = getNextRECID(grid);
    grid.add(newRecord);
    logger.info('Record duplicated', { originalRecid: recid, newRecid: newRecord.recid });
    } catch (error) {
        logger.error('Error duplicating record', { error: error.message, recid });
    }
}

/**
 * Copy a record from source grid to timeline grid
 * @param {object} sourceGrid - source w2ui grid object
 * @param {number} recid - record ID to copy to timeline
 */
function to_timeline(sourceGrid, recid) {
    try {
        const record = sourceGrid.get(recid);
        if (!record) {
            logger.error('Record not found for timeline transfer', { recid });
            return;
        }

        // Determine event type and data based on source grid
        let eventType = 'Unknown';
        let eventData = '';
        let eventHost = record.hostname || '';
        let eventTime = null;

        // Map grid-specific fields to timeline fields
        if (sourceGrid.name === 'grd_email') {
            eventType = 'Email/Phishing';
            eventData = `Subject: ${record.subject || ''}, From: ${record.sender || ''}, To: ${record.recipient || ''}`;
            eventTime = record.date_received;
        } else if (sourceGrid.name === 'grd_files') {
            eventType = 'File Artifact';
            eventData = `${record.artifact_type || 'File'}: ${record.file_path || ''}${record.file_name || ''} (${record.file_hash || 'no hash'})`;
            eventTime = record.date_found;
        } else if (sourceGrid.name === 'grd_processes') {
            eventType = 'Process Execution';
            eventData = `${record.process_name || ''} (PID: ${record.process_id || ''}) - ${record.command_line || ''}`;
            eventTime = record.execution_time;
        } else if (sourceGrid.name === 'grd_persistence') {
            eventType = 'Persistence Mechanism';
            eventData = `${record.persistence_type || ''}: ${record.name || ''} - ${record.path || ''}`;
            eventTime = record.date_discovered;
        }

        // Add to timeline grid
        w2ui.grd_timeline.add({
            recid: getNextRECID(w2ui.grd_timeline),
            event_host: eventHost,
            event_type: eventType,
            event_data: eventData,
            event_time: eventTime || Date.now(),
            event_source_host: record.hostname || '',
            notes: record.notes || ''
        });

        logger.info('Record copied to timeline', { sourceGrid: sourceGrid.name, recid });
        w2alert('Record added to timeline');
    } catch (error) {
        logger.error('Error copying to timeline', { error: error.message, recid });
    }
}

/**
 * Copy a record from web activity grid to network indicators grid
 * @param {object} sourceGrid - source w2ui grid object
 * @param {number} recid - record ID to copy to network indicators
 */
function to_network_indicators(sourceGrid, recid) {
    try {
        const record = sourceGrid.get(recid);
        if (!record) {
            logger.error('Record not found for network transfer', { recid });
            return;
        }

        // Add to network grid
        w2ui.grd_network.add({
            recid: getNextRECID(w2ui.grd_network),
            date: record.date_observed || Date.now(),
            source_host: record.hostname || '',
            dest_host: record.domain || '',
            dest_ip: record.ip_address || '',
            dest_port: '',
            protocol: record.http_method || 'HTTP',
            notes: `URL: ${record.url || ''}\nType: ${record.url_type || ''}\n${record.notes || ''}`
        });
        logger.info('Record copied to network indicators', { sourceGrid: sourceGrid.name, recid });
        w2alert('Record added to network indicators');
    } catch (error) {
        logger.error('Error copying to network indicators', { error: error.message, recid });
    }
}
/**
 * Check a file hash against VirusTotal (wrapper for files grid)
 * @param {number} recid - record ID in files grid
 */
function vtCheckFile(recid) {
    try {
        const record = w2ui.grd_files.get(recid);
        if (!record) {
            logger.error('Record not found for VT check', { recid });
            return;
        }
        // Create a temporary grid-like object with md5 field for check_vt compatibility
        const tempGrid = {
            name: 'grd_files',
            get: (id) => ({ md5: record.file_hash }),
            set: (id, data) => w2ui.grd_files.set(id, data)
        };
        // Call the existing check_vt function
        check_vt(tempGrid, recid);
    } catch (error) {
        logger.error('Error checking file with VirusTotal', { error: error.message, recid });
    }
}
