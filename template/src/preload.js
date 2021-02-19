'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// code here




// Window Things //
ipcRenderer.on('focused', (_, a) => {
    a ? document.body.classList.remove('winactive') : document.body.classList.add('winactive');
});
contextBridge.exposeInMainWorld('windowControl', {
    maximize: () => { ipcRenderer.send('windowMsg', 0); },
    minimize: () => { ipcRenderer.send('windowMsg', 1); },
    close: () => { ipcRenderer.send('windowMsg', 2); }
});
ipcRenderer.on('windowMaximize', (event, arg) => {
    if (arg) {
        document.querySelector('#app_max_unmaximize').style.display = 'block';
        document.querySelector('#app_max_maximize').style.display = 'none';
    } else {
        document.querySelector('#app_max_unmaximize').style.display = 'none';
        document.querySelector('#app_max_maximize').style.display = 'block';
    }
});
// MOS //
contextBridge.exposeInMainWorld('mos', {
    mos: () => {
        ipcRenderer.send('mos');
    }
});
ipcRenderer.on('mosUpdate', (event, arg) => {
    arg ? document.body.classList.add('mos') : document.body.classList.remove('mos');
});
// InitCompleted //
contextBridge.exposeInMainWorld('init', {
    completed: () => {
        ipcRenderer.send('init-completed');
    }
});
