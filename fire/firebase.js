import * as firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlILpRev9t5cVSexQ4tSRvLC7od_Yrpcw",
    authDomain: "dentinstallment.firebaseapp.com",
    databaseURL: "https://dentinstallment.firebaseio.com",
    projectId: "dentinstallment",
    storageBucket: "dentinstallment.appspot.com",
    messagingSenderId: "1026270735526",
    appId: "1:1026270735526:web:2650a68699846c53fdd867",
    measurementId: "G-Y4Y3JJ79FJ"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.firestore()
firebase.auth()
export  {firebase} ;


