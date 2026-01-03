<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chat Galaxy - Saurus</title>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Creepster&display=swap');

    :root {
      --bg: #0f0e17;
      --purple: #6d28d9;
      --light-purple: #a78bfa;
      --star: #ffffff;
      --text: #e0e7ff;
      --gold: #ffd700;
      --bot: #ffeb3b;
    }

    * { margin:0; padding:0; box-sizing:border-box; }
    body { 
      font-family: 'Poppins', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(109,40,217,0.15) 0%, transparent 10%),
        radial-gradient(circle at 80% 70%, rgba(109,40,217,0.12) 0%, transparent 10%),
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0.5px, transparent 1px);
      background-size: 60px 60px;
      overflow: hidden;
    }

    .screen { position: absolute; inset: 0; display: flex; flex-direction: column; transition: opacity .5s; }
    .screen.hidden { opacity: 0; pointer-events: none; }

    .box { 
      background: rgba(109,40,217,0.2);
      backdrop-filter: blur(12px);
      padding: 40px 30px;
      border-radius: 20px;
      max-width: 420px;
      width: 90%;
      margin: auto;
      text-align: center;
      border: 1px solid var(--light-purple);
      box-shadow: 0 0 30px rgba(109,40,217,0.3);
    }

    h1 { font-size: 2.8rem; margin-bottom: 20px; color: var(--light-purple); text-shadow: 0 0 15px rgba(167,139,250,0.5); }

    input { width: 100%; padding: 16px; margin: 12px 0; border: 2px solid var(--light-purple); border-radius: 12px; background: rgba(255,255,255,0.05); color: white; font-size: 1.1rem; }
    button { background: linear-gradient(135deg, var(--purple), var(--light-purple)); color: white; padding: 16px; border: none; border-radius: 12px; font-size: 1.2rem; cursor: pointer; transition: all .3s; }
    button:hover { transform: scale(1.05); box-shadow: 0 0 20px var(--light-purple); }

    .header { background: rgba(0,0,0,0.4); padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--light-purple); }

    #daftar-room { padding: 20px; overflow-y: auto; flex: 1; }
    .room-item { background: rgba(109,40,217,0.15); padding: 16px; margin: 12px 0; border-radius: 15px; cursor: pointer; transition: all .3s; border: 1px solid var(--light-purple); }
    .room-item:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(109,40,217,0.4); }

    #pesan-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .pesan { max-width: 80%; padding: 12px 16px; border-radius: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); position: relative; }
    .pesan.kirim { background: var(--purple); align-self: flex-end; }
    .pesan.terima { background: rgba(255,255,255,0.15); align-self: flex-start; }
    .pesan .pengirim { font-size: 0.95rem; opacity: 0.8; display: block; margin-bottom: 4px; }
    .pesan img { max-width: 100%; border-radius: 12px; margin-top: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
    .owner-badge { 
      background: var(--gold); 
      color: black; 
      padding: 4px 12px; 
      border-radius: 12px; 
      font-size: 1rem; 
      margin-left: 8px; 
      box-shadow: 0 0 10px var(--gold); 
      font-weight: bold; 
      font-family: 'Creepster', cursive; 
      letter-spacing: 1px;
    }
    .bot-badge { 
      background: var(--bot); 
      color: black; 
      padding: 4px 12px; 
      border-radius: 12px; 
      font-size: 1rem; 
      margin-left: 8px; 
      box-shadow: 0 0 10px var(--bot); 
      font-weight: bold; 
    }

    .input-area { background: rgba(0,0,0,0.5); padding: 12px; display: flex; gap: 12px; position: sticky; bottom: 0; box-shadow: 0 -5px 15px rgba(0,0,0,0.5); }
    #input-pesan { flex: 1; border-radius: 30px; background: rgba(255,255,255,0.1); color: white; padding: 14px; border: none; font-size: 1.1rem; }
    #kirim, .attach { width: 54px; height: 54px; border-radius: 50%; border: none; background: var(--purple); color: white; font-size: 1.4rem; cursor: pointer; transition: all .3s; }
    #kirim:hover, .attach:hover { transform: scale(1.1); box-shadow: 0 0 20px var(--light-purple); }
    .attach { background: var(--light-purple); display: grid; place-items: center; }

    .pesan-tools { position: absolute; top: 8px; right: 8px; display: flex; gap: 8px; }
    .tool-btn { background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; color: white; }

    .setting-btn { background: var(--gold); color: black; padding: 8px 12px; border-radius: 12px; font-size: 0.9rem; cursor: pointer; }
  </style>
</head>

<body>

<div id="login" class="screen">
  <div class="box">
    <h1 class="glow">Saurus Galaxy Chat</h1>
    <p style="margin:15px 0; opacity:0.9; font-size:1.2rem;">By Saurus</p>
    <input type="text" id="nama" placeholder="Nama kamu... (contoh: {khusus:saurus})">
    <button onclick="masuk()">Masuk</button>
  </div>
</div>

<div id="dashboard" class="screen hidden">
  <div class="header">
    <h2>Daftar Room</h2>
    <div style="display:flex;gap:12px;">
      <button id="bot-setting-btn" class="setting-btn hidden" onclick="tampilSettingBot()">👤 Bot Setting</button>
      <button onclick="logout()">Logout</button>
    </div>
  </div>
  <input type="text" id="cari" placeholder="Cari nama room..." oninput="cariRoom()">
  <button onclick="tampilBuat()">+ Buat Room Baru</button>
  <div id="daftar-room"></div>
</div>

<div id="form-buat" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);display:none;justify-content:center;align-items:center;z-index:10;">
  <div class="box" style="max-width:400px;">
    <h3>Buat Room Baru</h3>
    <input type="text" id="nama-room" placeholder="Nama Room">
    <input type="password" id="pw-room" placeholder="Password (opsional)">
    <input type="number" id="max-anggota" placeholder="Max anggota (kosong/0 = ∞)" min="0">
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button onclick="buatRoom()">Buat</button>
      <button onclick="document.getElementById('form-buat').style.display='none'">Batal</button>
    </div>
  </div>
</div>

<div id="chat" class="screen hidden">
  <div class="header">
    <button onclick="kembali()">←</button>
    <h2 id="nama-room-saatini">Room</h2>
  </div>
  <div id="pesan-container"></div>
  <div class="input-area">
    <input type="text" id="input-pesan" placeholder="Ketik pesan...">
    <button id="kirim">➤</button>
    <label class="attach">📷 <input type="file" id="upload-gambar" accept="image/*" hidden></label>
  </div>
</div>

<div id="bot-setting-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);display:none;justify-content:center;align-items:center;z-index:10;">
  <div class="box" style="max-width:400px;">
    <h3>Setting Bot Panduan</h3>
    <input type="text" id="bot-name" placeholder="Nama Bot">
    <textarea id="bot-text" placeholder="Teks bot" rows="4"></textarea>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button onclick="kirimKeRoom()">Kirim ke Room</button>
      <button onclick="kirimKeSemuaRoom()">Kirim ke Semua Room</button>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button onclick="banUser()">Ban User</button>
      <button onclick="unbanUser()">Unban User</button>
      <button onclick="listBan()">List Banned</button>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button onclick="saveBotSetting()">Simpan</button>
      <button onclick="document.getElementById('bot-setting-modal').style.display='none'">Batal</button>
    </div>
  </div>
</div>

<script>
// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBer_DF3-zAyH2rmnMpzilUiE5BYTb4In0",
  authDomain: "saurusproject-6974b.firebaseapp.com",
  databaseURL: "https://saurusproject-6974b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saurusproject-6974b",
  storageBucket: "saurusproject-6974b.appspot.com",
  messagingSenderId: "519472343742",
  appId: "1:519472343742:web:xxxxxxxxxxxxxxxx"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

let namaUser = '';
let isOwner = false;
let roomSaatIni = null;
let currentListener = null;
let deletedPesan = new Set();

function masuk() {
  let inputNama = document.getElementById('nama').value.trim();
  if (!inputNama) return alert('Nama wajib diisi!');

  // Cek owner mode rahasia
  if (inputNama.startsWith('{khusus:') && inputNama.endsWith('}')) {
    isOwner = true;
    namaUser = inputNama.substring(9, inputNama.length - 1);
  } else {
    isOwner = false;
    namaUser = inputNama;
  }

  // Cek banned
  db.ref('bannedUsers/' + namaUser).once('value').then(snap => {
    if (snap.exists()) return alert('Nama ini telah diban, gabisa login!');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    if (isOwner) document.getElementById('bot-setting-btn').classList.remove('hidden');
    tampilDaftarRoom();
  });
}

function logout() {
  namaUser = '';
  isOwner = false;
  roomSaatIni = null;
  if (currentListener) currentListener.off();
  document.getElementById('chat').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('nama').value = '';
  document.getElementById('bot-setting-btn').classList.add('hidden');
}

function tampilDaftarRoom(kata = '') {
  db.ref('rooms').once('value').then(snapshot => {
    const list = document.getElementById('daftar-room');
    list.innerHTML = '';
    const rooms = snapshot.val() || {};

    Object.keys(rooms).forEach(id => {
      const r = rooms[id];
      if (kata && !r.nama.toLowerCase().includes(kata.toLowerCase())) return;

      const div = document.createElement('div');
      div.className = 'room-item';
      div.innerHTML = `<strong>${r.nama}</strong> (${r.current || 0}/${r.max || '∞'})`;

      div.onclick = () => gabungRoom(id, r.password, r.max);

      if (isOwner) {
        const pwBtn = document.createElement('button');
        pwBtn.className = 'owner-btn';
        pwBtn.innerText = 'Cek PW';
        pwBtn.onclick = e => { e.stopPropagation(); alert('Password: ' + (r.password || 'Tidak ada')); };
        div.appendChild(pwBtn);

        const delBtn = document.createElement('button');
        delBtn.className = 'owner-btn';
        delBtn.innerText = 'Hapus Room';
        delBtn.onclick = e => { e.stopPropagation(); if (confirm('Hapus room?')) db.ref('rooms/' + id).remove(); };
        div.appendChild(delBtn);
      }

      list.appendChild(div);
    });
  });
}

function cariRoom() {
  tampilDaftarRoom(document.getElementById('cari').value);
}

function tampilBuat() {
  document.getElementById('form-buat').style.display = 'flex';
}

function buatRoom() {
  const nama = document.getElementById('nama-room').value.trim();
  const pw = document.getElementById('pw-room').value;
  const max = parseInt(document.getElementById('max-anggota').value) || null;

  if (!nama) return alert('Nama room wajib!');

  const id = db.ref('rooms').push().key;
  db.ref('rooms/' + id).set({
    nama,
    password: pw || null,
    max: max,
    current: 0,
    dibuat: firebase.database.ServerValue.TIMESTAMP
  });

  document.getElementById('form-buat').style.display = 'none';
  tampilDaftarRoom();
}

function gabungRoom(id, pw, max) {
  if (pw) {
    const input = prompt('Masukkan password:');
    if (input !== pw) return alert('Password salah!');
  }

  db.ref('rooms/' + id).once('value').then(snap => {
    const r = snap.val();
    if (r.current >= r.max && r.max !== null) return alert('Room sudah penuh!');

    db.ref('rooms/' + id + '/current').transaction(current => (current || 0) + 1);

    document.getElementById('pesan-container').innerHTML = '';
    if (currentListener) currentListener.off();

    roomSaatIni = id;
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('chat').classList.remove('hidden');
    document.getElementById('nama-room-saatini').textContent = 'Room: ' + id;

    const ref = db.ref('rooms/' + id + '/pesan');
    currentListener = ref;

    ref.on('child_added', snapshot => {
      const msg = snapshot.val();
      const msgId = snapshot.key;
      if (deletedPesan.has(msgId)) return;
      tambahPesan(msg, msgId);
    });
  });
}

function kembali() {
  db.ref('rooms/' + roomSaatIni + '/current').transaction(current => (current || 1) - 1);
  roomSaatIni = null;
  if (currentListener) currentListener.off();
  document.getElementById('chat').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  tampilDaftarRoom();
}

function tambahPesan(msg, msgId) {
  const div = document.createElement('div');
  div.className = `pesan ${msg.pengirim === namaUser ? 'kirim' : 'terima'}`;
  div.dataset.id = msgId;

  let pengirim = msg.pengirim;
  if (msg.pengirim.startsWith('{khusus:') && msg.pengirim.endsWith('}')) {
    pengirim = msg.pengirim.substring(9, msg.pengirim.length - 1);
    pengirim += ' • <span class="owner-badge">OWNER👑</span>';
  } else if (msg.pengirim.startsWith('BOT ')) {
    pengirim = '<span class="bot-badge">' + pengirim + '</span>';
  }

  let isi = `<span class="pengirim">${pengirim} • ${new Date(msg.waktu).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</span>`;
  
  if (msg.tipe === 'teks') isi += msg.isi;
  else if (msg.tipe === 'gambar') isi += `<img src="${msg.isi}" alt="Gambar">`;

  div.innerHTML = isi + '<div class="pesan-tools"><button class="tool-btn" onclick="copyPesan(this)">Copy</button>' + (msg.pengirim === namaUser ? '<button class="tool-btn" onclick="hapusPesanDiri(this)">Hapus</button>' : '') + '</div>';

  document.getElementById('pesan-container').appendChild(div);
  document.getElementById('pesan-container').scrollTop = document.getElementById('pesan-container').scrollHeight;
}

function copyPesan(btn) {
  const pesan = btn.parentElement.previousSibling.textContent;
  navigator.clipboard.writeText(pesan).then(() => alert('Pesan dicopy!'));
}

function hapusPesanDiri(btn) {
  if (confirm('Hapus pesan ini untuk diri sendiri?')) {
    const msgId = btn.parentElement.parentElement.dataset.id;
    deletedPesan.add(msgId);
    btn.parentElement.parentElement.remove();
  }
}

// Setting bot (owner only, di luar room)
function tampilSettingBot() {
  document.getElementById('bot-setting-modal').style.display = 'flex';
}

function saveBotSetting() {
  const name = document.getElementById('bot-name').value.trim() || 'BOT PANDUAN SAURUS';
  const text = document.getElementById('bot-text').value.trim();

  if (!text) return alert('Teks bot wajib diisi!');

  db.ref('botConfig').set({ name, text });

  alert('Setting bot tersimpan!');
  document.getElementById('bot-setting-modal').style.display = 'none';
}

function kirimKeRoom() {
  const name = document.getElementById('bot-name').value.trim() || 'BOT PANDUAN SAURUS';
  const text = document.getElementById('bot-text').value.trim();
  const room = prompt('Nama room tujuan:');
  if (room && text) {
    db.ref('rooms').once('value').then(snap => {
      const rooms = snap.val() || {};
      if (rooms[room]) {
        db.ref('rooms/' + room + '/pesan').push({
          pengirim: 'BOT ' + name,
          tipe: 'teks',
          isi: text,
          waktu: firebase.database.ServerValue.TIMESTAMP
        });
        alert('Teks terkirim ke room ' + room);
      } else {
        alert('Room tidak ditemukan!');
      }
    });
  }
}

function kirimKeSemuaRoom() {
  const name = document.getElementById('bot-name').value.trim() || 'BOT PANDUAN SAURUS';
  const text = document.getElementById('bot-text').value.trim();
  if (text) {
    db.ref('rooms').once('value').then(snap => {
      const rooms = snap.val() || {};
      Object.keys(rooms).forEach(roomId => {
        db.ref('rooms/' + roomId + '/pesan').push({
          pengirim: 'BOT ' + name,
          tipe: 'teks',
          isi: text,
          waktu: firebase.database.ServerValue.TIMESTAMP
        });
      });
      alert('Teks terkirim ke semua room!');
    });
  } else {
    alert('Teks bot wajib diisi!');
  }
}

// Ban/Unban/List Ban
function banUser() {
  const banName = prompt('Nama user untuk ban:');
  if (banName) {
    db.ref('bannedUsers/' + banName).set(true);
    alert('User ' + banName + ' dibanned!');
  }
}

function unbanUser() {
  const unbanName = prompt('Nama user untuk unban:');
  if (unbanName) {
    db.ref('bannedUsers/' + unbanName).remove();
    alert('User ' + unbanName + ' diunban!');
  }
}

function listBan() {
  db.ref('bannedUsers').once('value').then(snap => {
    const banned = snap.val() || {};
    let list = 'Daftar Banned Users:\n';
    Object.keys(banned).forEach(name => {
      list += '- ' + name + '\n';
    });
    alert(list || 'Belum ada user dibanned.');
  });
}

// Kirim teks
document.getElementById('kirim').onclick = () => {
  const teks = document.getElementById('input-pesan').value.trim();
  if (!teks) return;
  db.ref('rooms/' + roomSaatIni + '/pesan').push({
    pengirim: namaUser,
    tipe: 'teks',
    isi: teks,
    waktu: firebase.database.ServerValue.TIMESTAMP
  });
  document.getElementById('input-pesan').value = '';
};

document.getElementById('input-pesan').onkeypress = e => {
  if (e.key === 'Enter') document.getElementById('kirim').click();
};

// Kirim foto
document.getElementById('upload-gambar').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const ref = storage.ref('gambar/' + Date.now() + '_' + file.name);
  ref.put(file).then(() => ref.getDownloadURL()).then(url => {
    db.ref('rooms/' + roomSaatIni + '/pesan').push({
      pengirim: namaUser,
      tipe: 'gambar',
      isi: url,
      waktu: firebase.database.ServerValue.TIMESTAMP
    });
  }).catch(err => alert('Gagal upload foto: ' + err.message));
};
</script>
</body>
</html>
