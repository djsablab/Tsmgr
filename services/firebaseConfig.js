// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'; // Authentication için getAuth kullanıyoruz
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app'; // Firebase'i başlatmak için initializeApp
import { Timestamp } from 'firebase/firestore';
// AsyncStorage için import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';  // persistence için kullanacağız

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyBh0-jhJmKAS0EO0gNlmpkTI2n_ITFnGdM",
  authDomain: "fb-databaseg.firebaseapp.com",
  projectId: "fb-databaseg",
  storageBucket: "fb-databaseg.firebasestorage.app",
  messagingSenderId: "1061518329464",
  appId: "1:1061518329464:web:4c450a1571756c7d270f8d",
  measurementId: "G-VB8N0XYV6F"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Firebase Auth yapılandırması (persistence ile)
const auth = getAuth(app); // Bu şekilde kullanmak daha yaygın
auth.setPersistence(getReactNativePersistence(AsyncStorage)) // persistence ile ilgili çözüm
  .catch((error) => console.log('Auth persistence hatası: ', error));

// Firebase Firestore
const firestore = getFirestore(app);

// Firebase Storage (Opsiyonel: Eğer resim eklemek istiyorsanız)
// const storage = getStorage(app);

// Firestore işlemleri

// Görev ekleme
// Görev ekleme fonksiyonu
export const addTask = async (taskData) => {
  try {
    // 'tasks' koleksiyonuna yeni bir görev ekleyelim
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    return docRef;  // Firebase'ten dönen referansı geri gönderiyoruz
  } catch (e) {
    console.error("Görev eklerken hata: ", e);
    throw new Error("Görev eklenemedi.");
  }
};



// Görev güncelleme
export const updateTask = async (taskId, updatedTask) => {
  try {
    const taskDoc = doc(firestore, 'tasks', taskId);
    await updateDoc(taskDoc, updatedTask);
  } catch (error) {
    throw error;
  }
};

// Görev silme
// firebaseConfig.js
export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
  } catch (error) {
    throw new Error('Görev silinirken bir hata oluştu'+ error);
  }
};


// Görevleri çekme
// Firebase'den görevleri alacak fonksiyon
const fetchTasksFromFirestore = async () => {
  try {
    const snapshot = await firestore.collection('tasks').get();
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null, // Date objesini string'e çeviriyoruz
    }));

    // Redux store'a verileri gönder
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Görevleri çekerken hata:", error);
  }
};
export const fetchTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;  // Verileri döndür
  } catch (error) {
    console.error('Görevler alınırken hata:', error);
    throw error;
  }
};

export { app, auth, firestore };
