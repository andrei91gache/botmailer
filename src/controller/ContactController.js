/**
 Filename: ContactController.js
 Author  : agache
 Date    : 22/09/2020
 **/
class ContactController{

    getAllContacts(ipcMain, knex, window)
    {
        ipcMain.on("mainWindowLoaded", function () {
            let contacts = knex.select("*").from("contacts");

            contacts.then(function (rows) {
                window.webContents.send("resultSent", rows);
            });

        });
    }

    createContact(ipcMain, knex)
    {
        ipcMain.on('asynchronous-message', (event, arg) => {
            knex("contacts").insert({ fullname: arg.fullname, email: arg.email, infos: arg.infos }).then(() => {
                event.reply('asynchronous-reply', 'oki');
            }).catch((err) => {
                console.log(err);
                event.reply('asynchronous-reply', err)

            });
        });
    }
}

module.exports = ContactController;


