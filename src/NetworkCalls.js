
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
	firebase.database().ref('users').child(userId).set({'name':userName,'email':email,'admin':false})
}

export function saveQuizDataIntoServer(quizDetail,userObject) {
     const questionIds=quizDetail['QuestionIds'];

     let savedQuizIds=[];
     if(questionIds !== undefined && questionIds !== null) {
        for(let quizId of questionIds) {
            let newQuestionsIds=[];
            firebase.database().ref('QuizQuestion').child(quizId.selectedSubject).once('value').then((snapshot)=>{
                const totalQuestions=quizId.selectedValue;
                let randomNumberArray=[];
                while(randomNumberArray.length !== parseInt(totalQuestions,10)) {
                    while(true) {
                        let rand = Math.floor(Math.random() * snapshot.numChildren());
                        if(!randomNumberArray.includes(rand)) {
                            randomNumberArray.push(rand)
                            let i = 0;
                            Object.keys(snapshot.val()).forEach((key) => {
                                if (i === rand ) {
                                    newQuestionsIds.push(key);
                                }
                                i++;
                            });
                            break;
                        }
                    }
                }
                if(quizId===questionIds[questionIds.length-1]) {
                    savedQuizIds.push({'quizSection':quizId.selectedSubject,'quizIds':newQuestionsIds})
                    let newQuizId = quizDetail;
                    newQuizId["QuestionIds"] = savedQuizIds;
                    if(userObject !== undefined && userObject !== null){
                        firebase.database().ref('users').orderByChild('email').equalTo(userObject.email).once('value').then(data=>{
                            const keyToPush = firebase.database().ref('QuizDetail').push(newQuizId).key;
                            data.ref.child(data.key).child('quizIds').set({keyToPush : true});
                        }).catch(error=>alert(error))//TODO: handle error
                        
                        alert('successfully quiz invite sent');
                    }else{
                        firebase.database().ref('QuizDetail').push(newQuizId);
                        alert('successfully quiz created with no user invited');
                    }
                }else {
                    savedQuizIds.push({'quizSection':quizId.selectedSubject,'quizIds':newQuestionsIds})
                }
            }).catch((error) => {
                //TODO: handle error
                alert(error)
            })
        }
     }
}

export function getAllUsersQuiz() {
    return firebase.database().ref('users').once('value')
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