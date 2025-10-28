/**
 * WebDAV client library with modern JavaScript features
 * Provides async/await based WebDAV operations with proper error handling
 */

const WebDAV = {
    /**
     * List directory contents via WebDAV PROPFIND
     * @param {string} url - WebDAV directory URL
     * @returns {Promise<Array>} Array of file objects with name and type
     */
    dir: async (url) => {
        try {
            logger.debug('WebDAV dir request', { url });

            const response = await fetch(url, {
                method: 'PROPFIND',
                headers: {
                    'Depth': '1'
                }
            });

            if (!response.ok) {
                throw new Error(`WebDAV PROPFIND failed: ${response.status} ${response.statusText}`);
            }

            const xmlText = await response.text();
            logger.debug('WebDAV PROPFIND response received', { status: response.status, length: xmlText.length });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const responses = xmlDoc.getElementsByTagName('D:response');

            const files = [];
            for (const response of responses) {
                const href = response.getElementsByTagName('D:href')[0]?.textContent;
                const contentType = response.getElementsByTagName('D:getcontenttype')[0]?.textContent;

                if (href) {
                    const filename = href.split('/').pop() || href;
                    files.push({
                        name: filename,
                        type: contentType || 'unknown',
                        href: href
                    });
                    logger.debug('Parsed file entry', { filename, type: contentType });
                }
            }

            logger.info(`WebDAV directory listing completed`, { url, fileCount: files.length });
            return files;

        } catch (error) {
            logger.error('WebDAV directory listing failed', { url, error: error.message });
            throw error;
        }
    },

    /**
     * Read file contents via WebDAV GET
     * @param {string} url - WebDAV file URL
     * @returns {Promise<string>} File contents as string
     */
    read: async (url) => {
        try {
            logger.debug('WebDAV read request', { url });

            const response = await fetch(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`WebDAV GET failed: ${response.status} ${response.statusText}`);
            }

            const content = await response.text();
            logger.debug('WebDAV file read completed', { url, length: content.length });

            return content;

        } catch (error) {
            logger.error('WebDAV file read failed', { url, error: error.message });
            throw error;
        }
    },

    /**
     * Write file contents via WebDAV PUT
     * @param {string} url - WebDAV file URL
     * @param {string} data - File contents to write
     * @returns {Promise<boolean>} Success status
     */
    write: async (url, data) => {
        try {
            logger.debug('WebDAV write request', { url, dataLength: data.length });

            const response = await fetch(url, {
                method: 'PUT',
                body: data,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            if (!response.ok) {
                throw new Error(`WebDAV PUT failed: ${response.status} ${response.statusText}`);
            }

            logger.info('WebDAV file write completed', { url });
            return true;

        } catch (error) {
            logger.error('WebDAV file write failed', { url, error: error.message });
            throw error;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebDAV;
}