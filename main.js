import { firebaseConfig } from './firebase-config.js';

let namaUser = '';
let isOwner = false;
let roomSaatIni = null;
let sedangRekam = false;
let recorder, chunksAudio = [];
let currentListener = null;
let peerConnection = null;
let localStream = null;

// Login
function masuk() {
  namaUser = document.getElementById('nama').value.trim();
  if (!namaUser) return alert('Nama wajib diisi!');

  isOwner = namaUser.match(/\{khusus:.*\}/i) !== null;
  if (isOwner) namaUser = namaUser.replace(/\{khusus:|\}/gi, '').trim();

  firebase.auth().signInAnonymously().then(() => {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    tampilDaftarRoom();
  }).catch(err => alert('Gagal masuk: ' + err.message));
}

// Logout
function keluar() {
  if (confirm('Yakin logout?')) firebase.auth().signOut().then(() => location.reload());
}

// ... (fungsi tampilDaftarRoom, cariRoom, buatRoom, sembunyiBuat, gabungRoom, kembali, tambahPesan, kirim teks, gambar, suara sama seperti sebelumnya, tapi dengan pengecekan isOwner untuk tombol delete & cek pw)

function tampilDaftarRoom(kata = '') {
  // ... (kode tampil room normal & VIP dari jawaban sebelumnya)
  // Tambah tombol call di header chat kalau room punya lebih dari 1 orang (opsional)
  document.getElementById('call-btn').style.display = isOwner ? 'block' : 'none';
}

// Telepon suara sederhana (WebRTC)
function mulaiCall() {
  if (!roomSaatIni) return alert('Masuk room dulu!');
  alert('Fitur telepon sedang dalam pengembangan. Saat ini hanya simulasi.');
  // Implementasi WebRTC penuh butuh signaling server (bisa pakai Firebase juga)
  // Untuk versi sederhana, cukup simulasi UI
  document.getElementById('call-ui').classList.remove('hidden');
}

function akhiriCall() {
  document.getElementById('call-ui').classList.add('hidden');
  if (peerConnection) peerConnection.close();
}
