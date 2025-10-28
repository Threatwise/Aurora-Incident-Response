/**
 * Browser-compatible logging framework for Aurora Incident Response
 * Provides different log levels and consistent formatting
 */

const logger = {
    levels: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    },

    currentLevel: 2, // INFO level by default

    /**
     * Format log message with timestamp and level
     */
    formatMessage: function(level, message, data) {
        const timestamp = new Date().toISOString();
        let formatted = `[${timestamp}] [${level}] ${message}`;

        if (data !== undefined) {
            try {
                formatted += ` ${typeof data === 'object' ? JSON.stringify(data) : data}`;
            } catch (e) {
                formatted += ` [unserializable object]`;
                console.error(`[Logger] Failed to serialize data for log message:`, e);
            }
        }

        return formatted;
    },

    /**
     * Log error message
     */
    error: function(message, data) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(this.formatMessage('ERROR', message, data));
        }
    },

    /**
     * Log warning message
     */
    warn: function(message, data) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(this.formatMessage('WARN', message, data));
        }
    },

    /**
     * Log info message
     */
    info: function(message, data) {
        if (this.currentLevel >= this.levels.INFO) {
            console.info(this.formatMessage('INFO', message, data));
        }
    },

    /**
     * Log debug message
     */
    debug: function(message, data) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.debug(this.formatMessage('DEBUG', message, data));
        }
    }
};
