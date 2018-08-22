
import * as firebase from 'firebase/app';


export function initializeFirebase() {
  // Initialize Firebase
  const config = {
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
     let keyToPush = firebase.database().ref('QuizDetail').push(quizDetail).key;
     firebase.database().ref('QuizQuestion').child(keyToPush).set(questionArray)
}

export function getAllUsersQuiz() {
    return firebase.database().ref('users').once('value')
}

export function getUserDataForUser(currentUser) {
    return firebase.database().ref('users').child(currentUser.uid).once('value')
}

export default function getUserDataForEmail(email) {
    return firebase.database.ref('Users').orderByChild('email').equalTo(email).once('value')
}

export function getScoreDataForAttemptedQuizzes(attemptedQuizes) {
    let arrayOfPromises = [];
    for(let attemptedQuizId of attemptedQuizes) {
         arrayOfPromises.push(firebase.database().ref('Score').child(attemptedQuizId).once('value'))
    }
    return arrayOfPromises;
}

export function getQuizDataForUnattemptedQuizes(unAttemptedQuizIds) {
    let arrayOfPromises = [];
    for(let attemptedQuizId of unAttemptedQuizIds) {
        arrayOfPromises.push(firebase.database().ref('QuizDetail').child(attemptedQuizId).once('value'))
    }
    return arrayOfPromises;
}

export function getQuizQuestionsForQuizId(quizId) {
}

export function getQuizDetailsForQuizId(quizId) {
}

export function setupChildDeleteListner() {
}

export function setupChildChangeListner() {
}

export function setupChildAddListner() {
}