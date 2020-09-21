const electron = require("electron");
const ipc = electron.ipcRenderer;

document.addEventListener("DOMContentLoaded", function () {
  ipc.send("mainWindowLoaded");
  ipc.on("resultSent", function (evt, result) {
    readContacts(result);
  });
});

function createContact() {
  let fullname = document.getElementById('c_fullname').value;
  let email = document.getElementById('c_email').value;
  let university = document.getElementById('c_university').value;

  if (email === '') {
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
    "university": university
  }

  ipc.send('asynchronous-message', data);

  ipc.on('asynchronous-reply', (event, arg) => {
    let tbody = document.getElementById('contacts-list');
    tbody.append(buildContactColumnTR(fullname, email, university));
    
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
    let university = contacts[i].university;

    tbody.append(buildContactColumnTR(fullname, email, university));
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
 * @param {string} university 
 */
function buildContactColumnTR(fullname = "", email, university = "") {
  let tr = document.createElement('tr');
  let tdName = document.createElement('td');
  tdName.innerText = fullname;
  let tdEmail = document.createElement('td');
  tdEmail.innerText = email
  let tdUniversity = document.createElement('td');
  tdUniversity.innerText = university;
  let tdActions = document.createElement('td');
  tr.append(tdName);
  tr.append(tdEmail);
  tr.append(tdUniversity);

  let aEdit = document.createElement('a');
  aEdit.setAttribute('data-toggle', 'modal');
  aEdit.setAttribute('data-target', '#editeaza-contact');
  aEdit.setAttribute('href', '#');
  aEdit.innerText = "Editeaza";

  let aDelete = document.createElement('a');
  aDelete.setAttribute('data-toggle', 'modal');
  aDelete.setAttribute('data-target', '#delete-contact');
  aDelete.className = "open-modal";
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