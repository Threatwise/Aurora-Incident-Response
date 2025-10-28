/**
 * Simple logging framework for Aurora Incident Response
 * Provides different log levels and consistent formatting
 */

class Logger {
    constructor() {
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };

        // Set default log level (can be changed via environment variable)
        this.currentLevel = process.env.AURORA_LOG_LEVEL
            ? this.levels[process.env.AURORA_LOG_LEVEL.toUpperCase()] || this.levels.INFO
            : this.levels.INFO;
    }

    /**
     * Format log message with timestamp and level
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {*} data - Optional data to log
     * @returns {string} Formatted log message
     */
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        let formatted = `[${timestamp}] [${level}] ${message}`;

        if (data !== undefined) {
            formatted += ` ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`;
        }

        return formatted;
    }

    /**
     * Log error message
     * @param {string} message - Error message
     * @param {*} data - Optional error data
     */
    error(message, data) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(this.formatMessage('ERROR', message, data));
        }
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {*} data - Optional warning data
     */
    warn(message, data) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(this.formatMessage('WARN', message, data));
        }
    }

    /**
     * Log info message
     * @param {string} message - Info message
     * @param {*} data - Optional info data
     */
    info(message, data) {
        if (this.currentLevel >= this.levels.INFO) {
            console.info(this.formatMessage('INFO', message, data));
        }
    }

    /**
     * Log debug message
     * @param {string} message - Debug message
     * @param {*} data - Optional debug data
     */
    debug(message, data) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.debug(this.formatMessage('DEBUG', message, data));
        }
    }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;