'use strict';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const fs = require('fs');
const request = require('request');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var favjson = fs.readFileSync('favourite.txt');
if(favjson != "") var fav = JSON.parse(favjson);


ipcMain.on('imgrequest',function(event,arg){
    if(!fs.existsSync("./image/" + arg[0])){
        request.get('http://157.7.147.219/img/anime2/sm_99_' + arg[1]).on('response',function(response){
           if(response.statusCode == 200){
                for(var i = 0;i<arg.length;i++){
                    (function(){
                        var t = i;
                        request.get('http://157.7.147.219/img/anime2/sm_99_' + arg[t])
                        .on('end',function(){
                            event.sender.send('imgupdate',{url:arg[t]});
                        })
                        .pipe(fs.createWriteStream('./image/'+arg[t]));
                    })();
                }  
           }
           else{
               event.sender.send('imgerror',{url:arg[1]});
           } 
        });
    }
    else {
        if(fs.existsSync("./image/" + arg[1])) event.sender.send('imgexist');
        else event.sender.send('imgerror',{url:arg[1]});
        
    }
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load',function(){
     if(typeof fav != 'undefined') mainWindow.webContents.send('fav',fav); 
  });
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
