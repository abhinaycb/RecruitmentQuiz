import React from 'react';
import * as firebase from "firebase";
import Paper from 'material-ui/Paper';
import { browserHistory } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/action/done';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const timerStyle = {
    color: "green",
    fontSize: "20px",
    fontFamily: "Comic Sans MS"
};
const headingTextStyle = {
    color: "#444",
    fontFamily: "Comic Sans MS"

};
const textStyle = {
    margin: "20px 0px 0px 0px",
    background: "#444",
    padding: "30px",
    color: "#fff",
    fontSize: "20px",
    fontFamily: "Comic Sans MS"

};

const paperStyle = {
    height: "800%",
    width: "50%",
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
};

const nextQuestionButtonStyle = {
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
        };
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.runTimer = this.runTimer.bind(this);
    }


    componentWillMount() {
        const self=this;

        firebase.database().ref('QuizDetail').child(this.state.quizId).once('value', (data) => {
            let obj = data.val();
            let questionIds=obj['QuestionIds']
            this.setState({
                Title: obj.Title,
                Totalmarks: obj.Totalmarks,
                TotalQuestion: obj.TotalQuestion,
                TotalTime: obj.Totaltime,
                timeLeft: obj.Totaltime,
            },this.runTimer);

            for(let section of questionIds) {
                for(let questionId of section["quizIds"]) {
                    firebase.database().ref('QuizQuestion').child(section.quizSection).child(questionId).once('value').then((data) => {
                        let questionJson=data.val();

                        if(self.state.questions.length === 0) {
                                    let Question = questionJson.Question;
                                    let op1 = questionJson.op1;
                                    let op2 = questionJson.op2;
                                    let op3 = questionJson.op3;
                                    let op4 = questionJson.op4;
                                    let Ans = questionJson.Answer;

                                    self.setState({
                                        Question: Question,
                                        op1: op1,
                                        op2: op2,
                                        op3: op3,
                                        op4: op4,
                                        Ans: Ans,
                                    });
                        }
                        self.setState({questions:[...self.state.questions,questionJson]})
                    }).catch((error) => {
                        //TODO: handle error
                        alert(error)
                    })
                }
            }
        })
    }

    onClickNextQuestion() {
        const radios = document.getElementsByName("shipSpeed");
        for (let i = 0; i < radios.length; i++) {
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

    onSetState() {
        firebase.database().ref("Score/S").set(this.state.score);
        let newCurrentQuestionNumber = this.state.currentQuestionNumber + 1;
        if(!this.state.questions[newCurrentQuestionNumber]){
            browserHistory.push({
                pathname: '/result',
                search: '',
                state: {score: this.state.score, totalMarks:this.state.Totalmarks}
            })
        }else {
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



    runTimer = () => {
        var min = this.state.TotalTime;
        console.log('total time initially',min)
        var sec = 0;

        this.setState({timer: setInterval(() => {
            let time;
            console.log('total time Step1',min)
            if (sec === 0) {
                min--
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

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    render() {
        return (
            <div>
                <div>
                    <center>
                        <Paper style={paperStyle} zDepth={3}>
                            <h1 style={headingTextStyle}>{this.state.Title}</h1>
                            <span style={timerStyle}>{this.state.timeLeft}</span>
                            <h3 style={headingTextStyle}>Question Number-{this.state.currentQuestionNumber + 1}</h3>
                            <h4 style={textStyle}>{this.state.Question}</h4> <br/><br/>
                            <div ref="val">
                                    <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                                            <RadioButton value={this.state.op1} label={this.state.op1}
                                               style={styles.radioButton}
                                            />
                                            <RadioButton value={this.state.op2} label={this.state.op2}
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
                            <FloatingActionButton style={nextQuestionButtonStyle} onClick={this.onClickNextQuestion}>
                                <ContentAdd />
                            </FloatingActionButton>
                        </Paper>
                    </center>
                </div>
            </div>
        )
    }
}