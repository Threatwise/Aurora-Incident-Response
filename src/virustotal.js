/**
 * VirusTotal integration with modern JavaScript features
 */

/**
 * Test VirusTotal API connection
 * @returns {Promise<void>}
 */
const vt_connection_test = async () => {
    try {
        const vtapikey = w2ui.case_form.record['vtapikey'];

        if (!vtapikey) {
            alert("Please specify an API key first.");
            return;
        }

        logger.info('Testing VirusTotal API connection');

        // Use a well-known test hash instead of hardcoded one
        const testHash = '44d88612fea8a8f36de82e1278abb02f'; // EICAR test file hash

        const url = `https://www.virustotal.com/vtapi/v2/file/report?apikey=${vtapikey}&resource=${testHash}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                logger.warn('VirusTotal API key invalid');
                alert("Your API key seems to be invalid.");
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        await response.json(); // Consume the response
        logger.info('VirusTotal connection test successful');
        alert("Test OK. VT Connected...");

    } catch (error) {
        logger.error('VirusTotal connection test failed', { error: error.message });
        alert("Connection Error!");
    }
};



/**
 * Check file hash against VirusTotal database
 * @param {Object} grid - W2UI grid object
 * @param {string|number} recid - Record ID in the grid
 * @returns {Promise<void>}
 */
const check_vt = async (grid, recid) => {
    try {
        const vtapikey = case_data.vtapikey;
        const resource = grid.get(recid).md5;

        if (!vtapikey) {
            alert("Please specify an API key first under Case Settings.");
            return;
        }

        if (!resource) {
            logger.warn('No MD5 hash available for VirusTotal check', { recid });
            grid.set(recid, { vt: "noresult" });
            return;
        }

        logger.debug('Checking hash against VirusTotal', { recid, hash: resource });

        const url = `https://www.virustotal.com/vtapi/v2/file/report?apikey=${vtapikey}&resource=${resource}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                logger.warn('VirusTotal API rate limit exceeded');
                alert("Your API request rate seems to be exceeded. Try again later or change API key.");
                return;
            }
            if (response.status === 204) {
                logger.warn('VirusTotal API key invalid');
                alert("Your API key seems to be invalid.");
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Update grid based on results
        if (data.response_code === 1) {
            if (data.positives > 0) {
                grid.set(recid, { vt: "infected" });
                logger.info('VirusTotal check: file infected', { recid, positives: data.positives, total: data.total });
            } else {
                grid.set(recid, { vt: "clean" });
                logger.info('VirusTotal check: file clean', { recid });
            }
        } else {
            grid.set(recid, { vt: "noresult" });
            logger.info('VirusTotal check: no results', { recid });
        }

    } catch (error) {
        logger.error('VirusTotal check failed', { recid, error: error.message });
        alert("Connection Error!");
        // Set to noresult on error
        grid.set(recid, { vt: "noresult" });
    }
};