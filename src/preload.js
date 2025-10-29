/**
 * Preload script for Electron
 * Exposes limited Node.js APIs to renderer process in a secure way
 */

const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

console.log('[Preload] Script starting...');

// Expose protected methods that allow the renderer process to use
// Node.js APIs in a controlled way
try {
    contextBridge.exposeInMainWorld('electronAPI', {
    // File system operations
    fs: {
        readFileSync: (filePath, encoding) => {
            try {
                return fs.readFileSync(filePath, encoding);
            } catch (error) {
                throw new Error(`Failed to read file: ${error.message}`);
            }
        },
        writeFileSync: (filePath, data, encoding) => {
            try {
                return fs.writeFileSync(filePath, data, encoding);
            } catch (error) {
                throw new Error(`Failed to write file: ${error.message}`);
            }
        },
        existsSync: (filePath) => {
            return fs.existsSync(filePath);
        },
        readdirSync: (dirPath) => {
            return fs.readdirSync(dirPath);
        },
        statSync: (filePath) => {
            return fs.statSync(filePath);
        },
        mkdirSync: (dirPath, options) => {
            return fs.mkdirSync(dirPath, options);
        },
        unlinkSync: (filePath) => {
            return fs.unlinkSync(filePath);
        }
    },
    
    // Path operations
    path: {
        join: (...args) => path.join(...args),
        dirname: (filePath) => path.dirname(filePath),
        basename: (filePath) => path.basename(filePath),
        extname: (filePath) => path.extname(filePath),
        resolve: (...args) => path.resolve(...args),
        normalize: (filePath) => path.normalize(filePath)
    },
    
    // Get application directory
    getAppPath: () => {
        return __dirname;
    },
    
    // Window control
    closeWindow: () => ipcRenderer.invoke('window:close'),
    
    // Dirty state management (for unsaved changes tracking)
    setDirty: (isDirty) => ipcRenderer.invoke('dirty:set', isDirty),
    getDirty: () => ipcRenderer.invoke('dirty:get'),
    
    // Open file dialog
    showOpenDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
    
    // Save file dialog
    showSaveDialog: (options) => ipcRenderer.invoke('dialog:saveFile', options),
    
    // Show message box
    showMessageBox: (options) => ipcRenderer.invoke('dialog:message', options)
});

console.log('[Preload] Electron API bridge initialized successfully');

} catch (error) {
    console.error('[Preload] Failed to initialize API bridge:', error);
}
