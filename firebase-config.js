// تهيئة Firebase

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqisKc23O4jK3icohi1gJxBT8PutUOYFQ",
  authDomain: "queue7-c107b.firebaseapp.com",
  databaseURL: "https://queue7-c107b-default-rtdb.firebaseio.com",
  projectId: "queue7-c107b",
  storageBucket: "queue7-c107b.firebasestorage.app",
  messagingSenderId: "143343650250",
  appId: "1:143343650250:web:97da71efabf44309963b33",
  measurementId: "G-9TP4P04413"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// دوال Firebase المشتركة
function updateFirebase(path, data) {
    return database.ref(path).set(data);
}

function listenToFirebase(path, callback) {
    database.ref(path).on('value', (snapshot) => {
        callback(snapshot.val());
    });
}
