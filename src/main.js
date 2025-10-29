
const { app, BrowserWindow, shell, Menu, ipcMain } = require('electron');
const { dialog } = require('electron');
const path = require('node:path');
const logger = require('./logger.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

globalThis.Dirty = {
    is_dirty: true
};

const createWindow = () => {
    try {
        logger.info('Creating main application window');
        // Create the browser window.
        win = new BrowserWindow({
            width: 1600,
            height: 900,
            icon: 'icon/aurora.ico',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: false,  // Allow preload script to access Node.js APIs (fs, path)
                preload: path.join(__dirname, 'preload.js')
            }
        });

        // Load the index.html of the app.
        win.loadFile('index.html');

        // Create application menu
        const template = [{
            label: "Aurora IR",
            submenu: [
                {
                    label: "Quit",
                    accelerator: "Command+Q",
                    click: () => {
                        logger.info('Application quit requested from menu');
                        app.quit();
                    }
                }
            ]
        }, {
            label: "Edit",
            submenu: [
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            ]
        }];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));

        // Open DevTools for debugging
        win.webContents.openDevTools();
        logger.debug('DevTools opened for debugging');

        // Capture console messages from renderer process
        win.webContents.on('console-message', (event, level, message, line, sourceId) => {
            const levelMap = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
            const levelStr = levelMap[level] || 'LOG';
            logger.debug(`[Renderer:${levelStr}] ${message}`, { source: sourceId, line });
        });

        // Ensure external links open in system browser
        win.webContents.on('will-navigate', (event, url) => {
            try {
                const urlObject = new URL(url);
                if (["http:", "https:"].includes(urlObject.protocol)) {
                    logger.debug('Opening external URL', { url });
                    shell.openExternal(url);
                    event.preventDefault();
                }
            } catch (error) {
                logger.error('Error handling navigation', { url, error: error.message });
                event.preventDefault();
            }
        });

        // Handle window closed event
        win.on('closed', () => {
            logger.info('Main window closed');
            // Dereference the window object
            win = null;
        });

        // Handle window close event with cleanup
        win.on('close', async (e) => {
            if (globalThis.Dirty.is_dirty) {
                logger.info('Window close prevented due to unsaved changes');
                // Prevent default close behavior to allow cleanup
                e.preventDefault();
                // Execute cleanup function in renderer process
                try {
                    await win.webContents.executeJavaScript('cleanup()');
                    logger.info('Cleanup completed successfully');
                } catch (error) {
                    logger.error('Error executing cleanup', { error: error.message });
                    // Force close even if cleanup fails
                    globalThis.Dirty.is_dirty = false;
                    win.destroy();
                }
            }
        });

        logger.info('Main application window created successfully');

    } catch (error) {
        logger.error('Failed to create main window', { error: error.message });
        app.quit();
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    logger.info('Electron app ready, creating window');
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    logger.info('All windows closed, quitting application');
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit();
});

// SSL/TLS: Handle self-signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    try {
        // Allow self-signed certificates only in development or when explicitly enabled.
        const allowInsecure = (process.env.AURORA_ALLOW_INSECURE_CERTS === '1') || !app.isPackaged;

        if (allowInsecure) {
            logger.warn('Allowing insecure certificate', { url, error: error.message });
            event.preventDefault();
            callback(true);
        } else {
            logger.info('Blocking insecure certificate', { url });
            // Use default behavior (block) by not preventing default and returning false
            callback(false);
        }
    } catch (error) {
        logger.error('Error handling certificate validation', { error: error.message });
        callback(false);
    }
});

app.on('activate', () => {
    logger.info('App activated (macOS dock click)');
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    app.quit();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection', { reason, promise });
});

// IPC handlers for dialog operations
ipcMain.handle('dialog:openFile', async (event, options) => {
    logger.debug('Opening file dialog', { options });
    try {
        const result = await dialog.showOpenDialog(win, options);
        return result;
    } catch (error) {
        logger.error('Error showing open dialog', { error: error.message });
        throw error;
    }
});

ipcMain.handle('dialog:saveFile', async (event, options) => {
    logger.debug('Opening save dialog', { options });
    try {
        const result = await dialog.showSaveDialog(win, options);
        return result;
    } catch (error) {
        logger.error('Error showing save dialog', { error: error.message });
        throw error;
    }
});

ipcMain.handle('dialog:message', async (event, options) => {
    logger.debug('Showing message box', { options });
    try {
        const result = await dialog.showMessageBox(win, options);
        return result;
    } catch (error) {
        logger.error('Error showing message box', { error: error.message });
        throw error;
    }
});

// IPC handlers for window control
ipcMain.handle('window:close', async (event) => {
    logger.debug('Closing window via IPC');
    try {
        if (win) {
            win.close();
        }
    } catch (error) {
        logger.error('Error closing window', { error: error.message });
        throw error;
    }
});

// IPC handlers for dirty state management
ipcMain.handle('dirty:set', async (event, isDirty) => {
    logger.debug('Setting dirty state', { isDirty });
    try {
        globalThis.Dirty.is_dirty = isDirty;
        return true;
    } catch (error) {
        logger.error('Error setting dirty state', { error: error.message });
        throw error;
    }
});

ipcMain.handle('dirty:get', async (event) => {
    try {
        return globalThis.Dirty.is_dirty;
    } catch (error) {
        logger.error('Error getting dirty state', { error: error.message });
        throw error;
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

