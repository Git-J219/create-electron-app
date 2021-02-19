'use strict';
let mainWindow;
let loading;
let menuCommand;
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

const v = require('../package.json').version;

console.log(`Running at v${v}`);

const appleMenu = [{
    label: 'Musicman',
    submenu: [{
        label: 'Über Musicman',
        role: 'about'
    }, {
        type: 'separator'
    }, {
        label: 'Services',
        role: 'services',
        submenu: []
    }, {
        type: 'separator'
    }, {
        label: 'Musicman verstecken',
        accelerator: 'Command+H',
        role: 'hide'
    }, {
        label: 'Andere verstecken',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
    }, {
        label: 'Alle zeigen',
        role: 'unhide'
    }, {
        type: 'separator'
    }, {
        label: 'Beenden',
        accelerator: 'Command+Q',
        click: () => {
            mainWindow.destroy();
            app.quit();
        }
    }]
}
];
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
const createWindow = () => {
    // Create the browser window.
    const info = {
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            backgroundThrottling: false
        },
        icon: path.join(__dirname, 'icons', 'icon.png'),
        show: false
    };
    loading = new BrowserWindow({ transparent: true, width: 580, height: 140, frame: false, webPreferences: { backgroundThrottling: false, contextIsolation: true }, show: false });
    loading.setMinimumSize(580, 140);
    loading.setMaximumSize(580, 140);
    loading.setAlwaysOnTop(true);
    loading.on('close', (e) => {
        e.preventDefault();
    });
    loading.setMinimizable(false);
    loading.setMaximizable(false);
    loading.loadFile(path.join(__dirname, 'loading', 'loading.html'));
    loading.on('ready-to-show', loading.show);
    if (process.platform === 'darwin') {
        info.frame = true;
        info.titleBarStyle = 'hidden';
    }
    mainWindow = new BrowserWindow(info);
    mainWindow.setMinimumSize(600, 600);
    mainWindow.addListener('maximize', () => {
        mainWindow.webContents.send('windowMaximize', mainWindow.isMaximized());
    });
    mainWindow.addListener('unmaximize', () => {
        mainWindow.webContents.send('windowMaximize', mainWindow.isMaximized());
    });
    mainWindow.addListener('blur', () => {
        mainWindow.webContents.send('focused', false);
    });
    mainWindow.addListener('focus', () => {
        mainWindow.webContents.send('focused', true);
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.addListener('closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => Menu.setApplicationMenu(Menu.buildFromTemplate(appleMenu)));
app.on('ready', createWindow);
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.on('before-quit', () => {
    if (!loading.isDestroyed()) {
        loading.removeAllListeners('close');
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('mos', (event) => {
    event.sender.send('mosUpdate', process.platform === 'darwin');
});
ipcMain.on('windowMsg', (_, arg) => {
    switch (arg) {
    case 0:
        // maximize
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        break;
    case 1:
        // minimize
        mainWindow.minimize();
        break;
    case 2:
        // close
        mainWindow.close();
        break;
    }
});
ipcMain.on('init-completed', () => {
    loading.destroy();
    mainWindow.show();
    mainWindow.focus();
    if (menuCommand !== undefined) {
        // Mac-OS commands set when clicking in Menu when window closed
        menuCommand = undefined;
    }
});
