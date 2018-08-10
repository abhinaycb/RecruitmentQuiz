import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from "firebase";
import Paper from 'material-ui/Paper';
import { browserHistory } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/action/done';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const style = {
    color: "green",
    fontSize: "20px",
    fontFamily: "Comic Sans MS"
};
const style7 = {
    color: "#444",
    fontFamily: "Comic Sans MS"

};
const style2 = {
    margin: "20px 0px 0px 0px",
    background: "#444",
    padding: "30px",
    color: "#fff",
    fontSize: "20px",
    fontFamily: "Comic Sans MS"

};

const style5 = {
    height: "800%",
    width: "50%",
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
};
const stylee = {
  marginLeft: "80%",
  marginBottom: "3%",
};
const styles = {
  block: {
    maxWidth: 25,
    
},
radioButton: {
    marginBottom: 16,
    textAlign: "left",
    marginLeft: 30
},
};

export default class AttemptQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            currentQuestionNumber: 0,
            Question: "",
            op1: "",
            op2: "",
            op3: "",
            op4: "",
            Ans: "",
            timeLeft: 0,
            Title: "",
            Totalmarks: "",
            TotalQuestion: "",
            score: 0,
            TotalTime: 0,
            quizId: props.location.state.quizId,
        }
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.runTimer = this.runTimer.bind(this);
    }

    onSetState() {
        firebase.database().ref("Score/S").set(this.state.score)
        let newCurrentQuestionNumber = this.state.currentQuestionNumber + 1
        if(!this.state.questions[newCurrentQuestionNumber]){
           browserHistory.push({
                pathname: '/result',
                search: '',
                state: {score: this.state.score, totalMarks:this.state.Totalmarks}
            })
        }
        else {
            let Question = this.state.questions[newCurrentQuestionNumber].Question;
            let op1 = this.state.questions[newCurrentQuestionNumber].op1;
            let op2 = this.state.questions[newCurrentQuestionNumber].op2;
            let op3 = this.state.questions[newCurrentQuestionNumber].op3;
            let op4 = this.state.questions[newCurrentQuestionNumber].op4;
            let Ans = this.state.questions[newCurrentQuestionNumber].Answer;
            
            this.setState({
                Question: Question,
                op1: op1,
                op2: op2,
                op3: op3,
                op4: op4,
                Ans: Ans,
                currentQuestionNumber: newCurrentQuestionNumber
            })
        }
    }

    onClickNextQuestion() {
        var radios = document.getElementsByName("shipSpeed");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                if (this.state.Ans === "opt"+(i+1)) {
                    this.setState((prevState) => ({
                        score: prevState.score + this.state.Totalmarks / this.state.TotalQuestion
                    }),this.onSetState)
                }
                else {
                    this.onSetState()
                }
                break;
            }else{
                //console.log("radio is unchecked")
            }
        }
    }
  
    runTimer = () => {
        var min = this.state.TotalTime;
        console.log('total time initially',min);
        var sec = 0;

        this.setState({timer: setInterval(() => {
            var time;

            console.log('total time Step1',min);
            if (sec === 0) {
                min--;
                sec = 60;
            }
            console.log('total time Step2',min);

            if (min === 0 && sec === 1) {
               time = "Time Out";
               this.setState({
                    timeLeft: time,
               });
               clearInterval(this.state.timer);
               browserHistory.push({
                  pathname: '/result',
                  search: '',
                  state: {score: this.state.score, totalMarks:this.state.Totalmarks}
               })
            } else { 
                time = min + ":" + sec; 
                sec--;
                console.log('total time Step3',min);
                this.setState({
                    timeLeft: time,
                })
            }
        }, 1000)})
    }

    componentWillMount() {
        let don = [];
        firebase.database().ref('QuizQuestion').child(this.state.quizId).on('value', (data) => {
            let obj = data.val();
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    don.push(prop)
                }
            }
            this.setState({
                donors: don
            })
        })

        firebase.database().ref('QuizDetail').child(this.state.quizId).on('value', (data) => {
            let obj = data.val();
            this.setState({
                Title: obj.Title,
                Totalmarks: obj.Totalmarks,
                TotalQuestion: obj.TotalQuestion,
                TotalTime: obj.Totaltime,
                timeLeft: obj.Totaltime,
            },this.runTimer);
        })


        firebase.database().ref('QuizQuestion').child(this.state.quizId).on('value', (data) => {
            let ques = [];
            let obj = data.val();
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    ques.push(obj[prop]);
                }
            }

            if(ques.length !== 0) {
                let Question = ques[0].Question;
                let op1 = ques[0].op1;
                let op2 = ques[0].op2;
                let op3 = ques[0].op3;
                let op4 = ques[0].op4;
                let Ans = ques[0].Answer;

                this.setState({
                    Question: Question,
                    op1: op1,
                    op2: op2,
                    op3: op3,
                    op4: op4,
                    Ans: Ans,
                    questions: ques
                });
            } else {
                // console.log("empty array ques is and obj is",ques,obj)
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
            <div>
            <center>
             <Paper style={style5} zDepth={3}>
             <h1 style={style7}>{this.state.Title}</h1>
             <span style={style}>{this.state.timeLeft}</span>
             <h3 style={style7}>Question Number-{this.state.currentQuestionNumber + 1}</h3>
             <h4 style={style2}>{this.state.Question}</h4>
             <br />
             <br />
             

             <div ref="val">
             <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
            
                 <RadioButton
                    value={this.state.op1}
                    label={this.state.op1}
                    style={styles.radioButton}
                    
                 />

                 <RadioButton
                    value={this.state.op2}
                    label={this.state.op2}
                    style={styles.radioButton}
                    
                 />
                
                 <RadioButton
                    value={this.state.op3}
                    label={this.state.op3}
                    style={styles.radioButton}
                 />
                
                 <RadioButton
                    value={this.state.op4}
                    label={this.state.op4}
                    style={styles.radioButton}
                 />

             </RadioButtonGroup>
            </div>


            <FloatingActionButton style={stylee} onClick={this.onClickNextQuestion}>
            <ContentAdd />
            </FloatingActionButton>
            </Paper>
            </center>

            </div>
            </MuiThemeProvider>
            </div>
        )
    }
}
