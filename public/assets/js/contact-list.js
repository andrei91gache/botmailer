/**
 Filename: contact-list.js
 Author  : agache
 Date    : 22/09/2020
 **/

const electron = require("electron");
const ipc = electron.ipcRenderer;

document.addEventListener("DOMContentLoaded", function () {
    ipc.send("mainWindowLoaded");
    ipc.on("resultSent", function (evt, result) {
        readContacts(result);
    });
});

/**
 * Create a contact and save on db
 */
function createContact() {

    let fullname = document.getElementById('c_fullname').value;
    let email = document.getElementById('c_email').value;
    let infos = document.getElementById('c_other_infos').value;

    if (email === '' || !validateEmail(email)) {
        $.growl.error({
            title: "Eroare",
            size: "large",
            message: "Emailul nu a fost completat"
        });
        return;
    }

    let data = {
        "fullname": fullname,
        "email": email,
        "infos": infos
    }

    ipc.send('asynchronous-message', data);

    ipc.on('asynchronous-reply', (event, arg) => {
        let tbody = document.getElementById('contacts-list');
        tbody.append(buildContactColumnTR(fullname, email, infos));

        $.growl.notice({
            title: "Succes",
            size: "large",
            message: "Contactul a fost creat"
        });
    })


}

function readContacts(contacts) {
    let tbody = document.getElementById('contacts-list');


    for (var i = 0; i < contacts.length; i++) {


        let fullname = contacts[i].fullname;
        let email = contacts[i].email;
        let infos = contacts[i].infos;

        tbody.append(buildContactColumnTR(fullname, email, infos));
    }
}

function updateContact() {

}

function deleteContact(e) {
    console.log(e);

    $.growl.notice({
        title: "Succes",
        size: "large",
        message: "Contactul a fost sters"
    });
}

/**
 *
 * @param {string} fullname
 * @param {string} email
 * @param {string} infos
 */
function buildContactColumnTR(fullname = "", email, infos = "") {
    let tr = document.createElement('tr');
    let tdName = document.createElement('td');
    tdName.innerText = fullname;
    let tdEmail = document.createElement('td');
    tdEmail.innerText = email
    let tdInfos = document.createElement('td');
    tdInfos.innerText = infos;
    let tdActions = document.createElement('td');
    tr.append(tdName);
    tr.append(tdEmail);
    tr.append(tdInfos);

    let aEdit = document.createElement('a');
    aEdit.setAttribute('data-toggle', 'modal');
    aEdit.setAttribute('data-target', '#editeaza-contact');
    aEdit.setAttribute('href', '#');
    aEdit.innerText = "Editeaza";
    aEdit.className = "open-modal-update";

    let aDelete = document.createElement('a');
    aDelete.setAttribute('data-toggle', 'modal');
    aDelete.setAttribute('data-target', '#delete-contact');
    aDelete.className = "open-modal-delete";
    aDelete.setAttribute('id-contact', email);
    aDelete.setAttribute('href', '#');
    aDelete.innerText = "Sterge";

    tdActions.append(aEdit);
    let span = document.createElement('span');
    span.innerText = " | ";
    tdActions.append(span);
    tdActions.append(aDelete);

    tr.append(tdActions);
    return tr;
}

function validateEmail(email)
{
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}