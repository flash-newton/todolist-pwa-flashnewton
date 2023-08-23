const firebaseConfig = {
       apiKey: "AIzaSyDcROvivkvYrMLuJ4Faw4cfLrgXKEMvQrs",
  authDomain: "my-todo-app-a2032.firebaseapp.com",
  databaseURL: "https://my-todo-app-a2032-default-rtdb.firebaseio.com",
  projectId: "my-todo-app-a2032",
  storageBucket: "my-todo-app-a2032.appspot.com",
  messagingSenderId: "274894826091",
  appId: "1:274894826091:web:c2b7eadda2764f06fd9f2e",
  measurementId: "G-K1FKSTDGZM"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(user => {
    if (user) {
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("displayName", user.displayName.split(/(\s+)/)?.[0]);
    } else {
        localStorage.removeItem("userId");
        localStorage.removeItem("displayName");
    }
});
