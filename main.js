'use strict';

const electron = require('electron');
const app = electron['app'];
const BrowserWindow = electron.BrowserWindow
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
})
app.on('ready', function() {
  let window = new BrowserWindow({width: 800, height: 600})
  window.loadURL('file://' + __dirname + '/index.html');
  console.log(window.webContents);
  window.webContents.openDevTools()
  window.on('closed', function() {});
});
