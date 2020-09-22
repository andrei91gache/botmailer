
const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const ContactController = require('./src/controller/ContactController');
let contactController = new ContactController();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, 'var/database/database.sqlite')
  }
});


app.on("ready", () => {
  let win = createWindow();
  contactController.getAllContacts(ipcMain, knex, win);
  contactController.createContact(ipcMain, knex);
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('public/index.html').then(() => {
    console.log('Index is loaded');
  });
  win.once(`ready-to-show`, showWindow);

  function showWindow() {
    win.show()
  }

  return win;
}
