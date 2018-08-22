import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory } from 'react-router'
import { RaisedButton, TextField } from 'material-ui';
import Paper from 'material-ui/Paper';
import { saveQuizDataIntoServer } from '../../NetworkCalls.js'

const style = {
    height: 550,
    width: 320,
    padding: 20,
    margin: "20px 0px 20px 0px",
};
const style1 = {
    margin: "0px 20px 0px 0px"

};
const style2 = {
    color: "white",
};

export default class CreateQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.onClickSubmitQuiz = this.onClickSubmitQuiz.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.state = {addedQuestionArray:[],detail:props.location.state.detail};
    }

    onClickSubmitQuiz(ev) {
        ev.preventDefault();
        const Question = this.refs.Question.getValue();
        const op1 = this.refs.op1.getValue();
        const op2 = this.refs.op2.getValue();
        const op3 = this.refs.op3.getValue();
        const op4 = this.refs.op4.getValue();
        const Answer = this.refs.Answer.getValue();

        let QuizQuestion = {
            Question: Question,
            op1: op1,
            op2: op2,
            op3: op3,
            op4: op4,
            Answer: Answer
        };

        if (String(Question) === "" || String(op1) === "" || String(op2) === "" || String(op3) === "" || String(op4) === "" || String(Answer) === "") {
            alert("Please Fill Required Fields")
        }
        else{
            let newQuestionsArray = this.state.addedQuestionArray;
            newQuestionsArray.push(QuizQuestion);
            this.setState({addedQuestionArray: newQuestionsArray});
            saveQuizDataIntoServer(this.state.detail,newQuestionsArray);
            browserHistory.push('/Admin')
        }
        ev.preventDefault();
    }

    onClickNextQuestion(ev) {
        ev.preventDefault();
        const Question = this.refs.Question.getValue();
        const op1 = this.refs.op1.getValue();
        const op2 = this.refs.op2.getValue();
        const op3 = this.refs.op3.getValue();
        const op4 = this.refs.op4.getValue();
        const Answer = this.refs.Answer.getValue();

        const QuizQuestion = {
            Question: Question,
            op1: op1,
            op2: op2,
            op3: op3,
            op4: op4,
            Answer: Answer
        };

        if(Question === "" || op1 === "" || op2 === "" || op3 ==="" || op4 === "" || Answer === ""){
            alert("Please Fill Required Fields");
            this.refs.Question.input.focus()
        }
        else{
            this.setState({addedQuestionArray: [...this.state.addedQuestionArray,QuizQuestion]});
            this.refs.Question.input.value = " ";
            this.refs.op1.input.value = " ";
            this.refs.op2.input.value = " ";
            this.refs.op3.input.value = " ";
            this.refs.op4.input.value = " ";
            this.refs.Answer.input.value = " ";
        }
        ev.preventDefault();
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <center>
                            <Paper style={style} zDepth={3} >
                                <h1>Create Questions!</h1>
                                <TextField type="text" hintText="Question" floatingLabelText="Question" ref="Question" /> <br />
                                <TextField type="text" hintText="Option 1" floatingLabelText="Option 1" ref="op1" /> <br />
                                <TextField type="text" hintText="Option 2" floatingLabelText="Option 2" ref="op2" /><br />
                                <TextField type="text" hintText="Option 3" floatingLabelText="Option 3" ref="op3" /><br />
                                <TextField type="text" hintText="Option 4" floatingLabelText="Option 4" ref="op4" /><br /><br />
                                <TextField type="text" hintText="Answer" floatingLabelText="Answer" ref="Answer" /><br /><br />
                                <RaisedButton disabled={parseInt(this.state.detail.TotalQuestion,10) - 1 === this.state.addedQuestionArray.length} primary={true}  onClick={this.onClickNextQuestion} style={style1} ><span style={style2}> Add More+ </span>  </RaisedButton>
                                <RaisedButton disabled={parseInt(this.state.detail.TotalQuestion,10) - 1 !== this.state.addedQuestionArray.length} primary={true}  onClick={this.onClickSubmitQuiz} style={style1} ><span style={style2}> Save Quiz </span>  </RaisedButton>
                            </Paper>
                        </center>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}