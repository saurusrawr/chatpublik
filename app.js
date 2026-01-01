import { db } from "./firebase.js";
import {
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const qs = new URLSearchParams(location.search);
const room = qs.get("room");

function getUsername() {
  return localStorage.getItem("username");
}

function formatName(name) {
  if (name.startsWith("{khusus:") && name.endsWith("}")) {
    const realName = name
      .replace("{khusus:", "")
      .replace("}", "");
    return `${realName} <span class="owner">👑 OWNER</span>`;
  }
  return name;
}

/* LOGIN */
window.login = () => {
  const name = document.getElementById("name").value.trim();
  if (!name) return alert("Isi nama dulu");
  localStorage.setItem("username", name);
  location.href = "dashboard.html";
};

/* CREATE ROOM */
window.createRoom = () => {
  const roomName = document.getElementById("roomName").value.trim();
  const roomPass = document.getElementById("roomPass").value.trim();

  if (!roomName) return alert("Nama room wajib");

  set(ref(db, "rooms/" + roomName), {
    password: roomPass || null,
    created: Date.now()
  });
};

/* LOAD ROOM LIST */
function loadRooms() {
  const list = document.getElementById("roomList");
  if (!list) return;

  onValue(ref(db, "rooms"), snap => {
    list.innerHTML = "";
    snap.forEach(r => {
      const div = document.createElement("div");
      div.className = "room";
      div.innerHTML = `
        <a href="chat.html?room=${r.key}" style="color:white;text-decoration:none">
          ${r.key}
        </a>
      `;
      list.appendChild(div);
    });
  });
}

/* SEND MESSAGE */
window.sendMsg = () => {
  const msgInput = document.getElementById("msg");
  if (!msgInput.value) return;

  push(ref(db, "chat/" + room), {
    name: getUsername(),
    text: msgInput.value,
    time: Date.now()
  });

  msgInput.value = "";
};

/* LOAD CHAT */
if (room) {
  const title = document.getElementById("roomTitle");
  if (title) title.innerText = room;

  onValue(ref(db, "chat/" + room), snap => {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    snap.forEach(m => {
      const d = m.val();
      chat.innerHTML += `
        <div class="message">
          <div class="name">${formatName(d.name)}</div>
          <div class="text">${d.text}</div>
        </div>
      `;
    });
    chat.scrollTop = chat.scrollHeight;
  });
}

loadRooms();
