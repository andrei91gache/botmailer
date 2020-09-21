const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('path');
const url = require('url');

var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join(__dirname, 'assets/database/database.sqlite')
	}
});


app.on("ready", () => {
  let win = createWindow();
  ipcMain.on("mainWindowLoaded", function () {

    let contacts = knex.select("*").from("contacts");

    contacts.then(function (rows) {
      win.webContents.send("resultSent", rows);
    });

  });


  ipcMain.on('asynchronous-message', (event, arg) => {

    let result = knex("contacts").insert({ fullname: arg.fullname, email: arg.email, university: arg.university }).then(() => {
      event.reply('asynchronous-reply', 'oki');
    }).catch((err) => {
      console.log(err);
      event.reply('asynchronous-reply', err)

    });

  })

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html');
  win.once("ready-to-show", () => { win.show() });
  return win;
}
