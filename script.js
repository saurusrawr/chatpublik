let username = localStorage.getItem('chatUsername');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const imageInput = document.getElementById('image-input');
const voiceBtn = document.getElementById('voice-btn');
const voiceRecording = document.getElementById('voice-recording');
const stopVoice = document.getElementById('stop-voice');

let mediaRecorder;
let audioChunks = [];

// Cek login
if (username) {
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('chat-screen').classList.add('active');
  document.getElementById('my-name').textContent = username;
  loadMessages();
} else {
  document.getElementById('username').focus();
}

function startChat() {
  const nameInput = document.getElementById('username').value.trim();
  if (!nameInput) {
    alert('Nama harus diisi!');
    return;
  }
  
  username = nameInput;
  localStorage.setItem('chatUsername', username);
  
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('chat-screen').classList.add('active');
  document.getElementById('my-name').textContent = username;
  
  loadMessages();
}

// Load chat dari localStorage
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  chatContainer.innerHTML = '';
  messages.forEach(msg => addMessageToUI(msg));
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Tambah pesan ke UI
function addMessageToUI(msg) {
  const div = document.createElement('div');
  div.className = `message ${msg.sender === username ? 'sent' : 'received'}`;
  
  let content = `<span class="sender">${msg.sender} • ${new Date(msg.time).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>`;
  
  if (msg.type === 'text') {
    content += `<div>${msg.content}</div>`;
  } else if (msg.type === 'image') {
    content += `<img src="${msg.content}" alt="Gambar">`;
  } else if (msg.type === 'voice') {
    content += `<audio controls src="${msg.content}"></audio>`;
  }
  
  div.innerHTML = content;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Simpan pesan ke localStorage
function saveMessage(msg) {
  const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  messages.push(msg);
  // Simpan maksimal 200 pesan terakhir (biar nggak terlalu besar)
  if (messages.length > 200) messages.shift();
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Kirim teks
function sendText() {
  const text = messageInput.value.trim();
  if (!text) return;

  const msg = {
    sender: username,
    type: 'text',
    content: text,
    time: Date.now()
  };

  saveMessage(msg);
  addMessageToUI(msg);
  messageInput.value = '';
}

// Kirim gambar
imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    const msg = {
      sender: username,
      type: 'image',
      content: event.target.result,
      time: Date.now()
    };
    saveMessage(msg);
    addMessageToUI(msg);
  };
  reader.readAsDataURL(file);
});

// Voice recording
let isRecording = false;

voiceBtn.addEventListener('click', async () => {
  if (isRecording) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);

      const msg = {
        sender: username,
        type: 'voice',
        content: url,
        time: Date.now()
      };

      saveMessage(msg);
      addMessageToUI(msg);

      // Reset
      audioChunks = [];
      voiceRecording.classList.add('hidden');
      isRecording = false;
    };

    mediaRecorder.start();
    isRecording = true;
    voiceRecording.classList.remove('hidden');
  } catch (err) {
    alert('Gagal mengakses mikrofon: ' + err.message);
  }
});

stopVoice.addEventListener('click', () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
  }
});

// Event listeners
sendBtn.addEventListener('click', sendText);
messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendText();
});

// Update chat real-time (ketika tab lain mengirim pesan)
window.addEventListener('storage', e => {
  if (e.key === 'chatMessages') {
    loadMessages();
  }
});
