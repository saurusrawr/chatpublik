// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBer_DF3-zAyH2rmnMpzilUiE5BYTb4In0",
  authDomain: "saurusproject-6974b.firebaseapp.com",
  databaseURL: "https://saurusproject-6974b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saurusproject-6974b",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
