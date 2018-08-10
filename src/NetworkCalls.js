
import * as firebase from 'firebase';


export function initializeFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDbElmtX64BMgM9QfJG48WUCtoH-S1FxrU",
    authDomain: "myquizapp-76d3e.firebaseapp.com",
    databaseURL: "https://myquizapp-76d3e.firebaseio.com",
    projectId: "myquizapp-76d3e",
    storageBucket: "myquizapp-76d3e.appspot.com",
    messagingSenderId: "262776562955"
  };
  firebase.initializeApp(config);
}

export function loginToFirebase(email,password) {
	return firebase.auth().signInWithEmailAndPassword(email, password)
}

export function signupWithFirebase(email,pass) {
	return firebase.auth().createUserWithEmailAndPassword(email, pass)
}

export function saveUserInFirebase(userName,email,userId) {
	firebase.database().ref('users').child(userId).set({'name':userName,'email':email})
}

export function saveQuizDataIntoServer(quizDetail,questionArray) {
     let keyToPush = firebase.database().ref('QuizDetail').push(quizDetail).key
     firebase.database().ref('QuizQuestion').child(keyToPush).set(questionArray)
}

export function getQuizQuestions(quizId,callBackFunction) {
	firebase.database().ref('QuizQuestion').child(quizId).on('value', (data) => callBackFunction(data))
}

export function getQuizDetail(quizId,callBackFunction) {
	firebase.database().ref('QuizDetail').child(quizId).on('value', (data) => callBackFunction(data))
}