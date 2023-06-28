
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-1d9fb-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var firebase = require('firebase/app');
var firebaseDB = require('firebase/database');
const firebaseConfig = {
    apiKey: "AIzaSyDOgDDDkydafuKDDO6mCEKVczZaloXloN4",
    authDomain: "fir-1d9fb.firebaseapp.com",
    databaseURL: "https://fir-1d9fb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-1d9fb",
    storageBucket: "fir-1d9fb.appspot.com",
    messagingSenderId: "894380538377",
    appId: "1:894380538377:web:d9be3e8f61939fec4e96d8",
    measurementId: "G-XG0796ELQZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseDB.getDatabase(firebaseApp);

const express = require('express');
const cors = require("cors");
const csv = require('csvtojson');

//Main App
const app = express();
app.use(cors({ origin: true }));

//Routes
app.get('/matches',(req, res) => {
    const dbRef = firebaseDB.ref(database, 'matches');
    
    if (dbRef == null) {
        csv().fromFile('demoapp_match.csv').then((jsonObj) => {
            console.log(jsonObj);
            res.send(jsonObj);
        });
    } else {
        firebaseDB.onValue(dbRef, (snapshot) => {
            data = snapshot.val();
            callMatches(res, data);
        }, {
            onlyOnce: true
        });
    }
});

function callMatches(res, data) {
    res.status(200).send(data);
}

//PORT : Env var
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port} ....`);
});

//Exports api to cloud function
exports.app = onRequest(app);
