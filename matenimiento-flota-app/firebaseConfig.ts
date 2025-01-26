import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBYylNRuPkJLGZGNqewF9w93UzIUJpvLg",
  authDomain: "global-tine-447000-u6.firebaseapp.com",
  projectId: "global-tine-447000-u6",
  storageBucket: "global-tine-447000-u6.firebasestorage.app",
  messagingSenderId: "487971660871",
  appId: "1:487971660871:web:92b5173e8ab2295b82fd62",
};

// Inicializa la aplicación de Firebase y el almacenamiento
const app: FirebaseApp = initializeApp(firebaseConfig);
const storage: FirebaseStorage = getStorage(app);

export { storage };
