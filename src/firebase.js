import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
var firebaseConfig = {
    apiKey: "AIzaSyDNF0FiWftSE6nJwbkndnH0ewkKgK7er00",
    authDomain: "alertifa-b858b.firebaseapp.com",
    databaseURL: "https://alertifa-b858b.firebaseio.com",
    projectId: "alertifa-b858b",
    storageBucket: "alertifa-b858b.appspot.com",
    messagingSenderId: "779540619441",
    appId: "1:779540619441:web:626748f89b82da08"
  };
    firebase.initializeApp(firebaseConfig);


  export default firebase; 