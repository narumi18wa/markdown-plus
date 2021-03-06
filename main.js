const { app, Menu } = require('electron');
const WindowManager = require('./windowmanager/WindowManager.es6');

let windowManager = new WindowManager();

function installMenu() {
    // アプリケーションメニュー設定
    let template = [{
            label: 'Edit',
            submenu: [{
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        }, {
            label: 'File',
            submenu: [{
                    label: '保存',
                    accelerator: 'command+S',
                    click: () => {
                        windowManager.currentWindow.webContents.send('global-shortcut-message', 'save-as');
                    }
                },
                {
                    label: '開く',
                    accelerator: 'command+O',
                    click: () => {
                        windowManager.currentWindow.webContents.send('global-shortcut-message', 'open');
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [{
                    label: 'New',
                    accelerator: 'Command+N',
                    click: () => {
                        windowManager.createWindow();
                    }
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    click: () => {
                        windowManager.deleteCurrentWindow();
                    }
                },
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => { windowManager.currentWindow.reload(); }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => { windowManager.currentWindow.setFullScreen(!windowManager.currentWindow.isFullScreen()); }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => { windowManager.currentWindow.toggleDevTools(); }
                },
            ]
        }
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [{
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        });
    }

    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    installMenu();
    windowManager.createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windowManager.windows.length == 0) {
        windowManager.createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.