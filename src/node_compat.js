/**
 * Node.js compatibility layer for renderer process
 * Provides familiar Node.js APIs using Electron's secure context bridge
 */

// Wait for window.electronAPI to be available (set by preload script)
let hasElectronAPI = globalThis.window?.electronAPI;

// Debug logging
console.log('[NodeCompat] Initializing compatibility layer...');
console.log('[NodeCompat] window.electronAPI available:', !!globalThis.window.electronAPI);

if (!hasElectronAPI) {
    console.warn('[NodeCompat] electronAPI not yet available. Waiting for DOMContentLoaded...');
    // Sometimes electronAPI isn't ready immediately, wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        hasElectronAPI = globalThis.window?.electronAPI;
        console.log('[NodeCompat] After DOMContentLoaded, electronAPI available:', !!hasElectronAPI);
    });
}

/**
 * File system module compatible with Node.js fs
 * Lazy evaluation to ensure electronAPI is available
 */
const getFS = () => {
    if (!globalThis.window.electronAPI) {
        throw new Error('Electron API not available. File system operations require the preload script.');
    }
    return globalThis.window.electronAPI.fs;
};

const fs = {
    readFileSync: (path, encoding) => getFS().readFileSync(path, encoding),
    writeFileSync: (path, data, encoding) => getFS().writeFileSync(path, data, encoding),
    existsSync: (path) => getFS().existsSync(path),
    readdirSync: (path) => getFS().readdirSync(path),
    statSync: (path) => getFS().statSync(path),
    mkdirSync: (path, options) => getFS().mkdirSync(path, options),
    unlinkSync: (path) => getFS().unlinkSync(path)
};

/**
 * Path module compatible with Node.js path
 * Lazy evaluation to ensure electronAPI is available
 */
const getPath = () => {
    if (!globalThis.window.electronAPI) {
        throw new Error('Electron API not available. Path operations require the preload script.');
    }
    return globalThis.window.electronAPI.path;
};

const path = {
    join: (...args) => getPath().join(...args),
    dirname: (p) => getPath().dirname(p),
    basename: (p) => getPath().basename(p),
    extname: (p) => getPath().extname(p),
    resolve: (...args) => getPath().resolve(...args),
    normalize: (p) => getPath().normalize(p)
};

/**
 * Crypto module (limited)
 */
const crypto = {
    randomUUID: () => {
        // Use Web Crypto API (available in browsers)
        if (globalThis.window?.crypto?.randomUUID) {
            return globalThis.window.crypto.randomUUID();
        }
        // Fallback
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, function(c) {
            const r = Math.trunc(Math.random() * 16);
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

/**
 * Get application directory
 */
const getAppPath = () => {
    if (!globalThis.window.electronAPI) {
        throw new Error('Electron API not available. Cannot get app path.');
    }
    return globalThis.window.electronAPI.getAppPath();
};

/**
 * Compatibility require function
 * Maps Node.js module names to our compatibility layer
 */
globalThis.require = function(moduleName) {
    console.log('[NodeCompat] require() called for:', moduleName);
    console.log('[NodeCompat] window.electronAPI available:', !!globalThis.window.electronAPI);
    
    switch(moduleName) {
        case 'node:fs':
        case 'fs':
            return fs;
            
        case 'node:path':
        case 'path':
            return path;
            
        case 'node:crypto':
        case 'crypto':
            return crypto;
            
        default:
            throw new Error(`Module '${moduleName}' not available in renderer context`);
    }
};

// Define __dirname getter for compatibility (lazy evaluation)
Object.defineProperty(globalThis, '__dirname', {
    get: () => {
        if (!globalThis.window.electronAPI) {
            console.warn('[NodeCompat] __dirname accessed before electronAPI ready');
            return '';
        }
        return globalThis.window.electronAPI.getAppPath();
    }
});

console.log('[NodeCompat] Node.js compatibility layer initialized');
