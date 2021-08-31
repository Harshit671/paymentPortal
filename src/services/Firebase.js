import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyC7UYKJMf542q914NDI4G9mRHfwkBeRCRI",
    authDomain: "paymentapp-4dde7.firebaseapp.com",
    projectId: "paymentapp-4dde7",
    storageBucket: "paymentapp-4dde7.appspot.com",
    messagingSenderId: "747485494877",
    appId: "1:747485494877:web:1b0075f52d05e26e6457b4"
};
const Firebase = firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore();
const auth = Firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider, db };



export default Firebase;

