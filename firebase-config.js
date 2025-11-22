// تهيئة Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
