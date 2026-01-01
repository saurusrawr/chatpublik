import { db } from "./firebase.js";
import {
  ref, push, set, onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const qs = new URLSearchParams(location.search);
const room = qs.get("room");

window.login = () => {
  const name = document.getElementById("username").value;
  if (!name) return alert("Isi nama");
  localStorage.setItem("username", name);
  loadRooms();
};

window.createRoom = () => {
  const roomName = document.getElementById("roomName").value;
  const roomPass = document.getElementById("roomPass").value;
  if (!roomName) return alert("Isi nama room");

  set(ref(db, "rooms/" + roomName), {
    password: roomPass || null
  });
};

function loadRooms() {
  onValue(ref(db, "rooms"), snap => {
    const list = document.getElementById("roomList");
    list.innerHTML = "";
    snap.forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="chat.html?room=${r.key}">${r.key}</a>`;
      list.appendChild(li);
    });
  });
}

window.sendMsg = () => {
  const msg = document.getElementById("msg").value;
  if (!msg) return;

  push(ref(db, "chat/" + room), {
    name: localStorage.getItem("username"),
    text: msg,
    time: Date.now()
  });

  document.getElementById("msg").value = "";
};

if (room) {
  document.getElementById("roomTitle").innerText = room;
  onValue(ref(db, "chat/" + room), snap => {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    snap.forEach(m => {
      const d = m.val();
      chat.innerHTML += `<p><b>${d.name}</b>: ${d.text}</p>`;
    });
  });
}
