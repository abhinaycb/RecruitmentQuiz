import React from 'react';
import { browserHistory } from 'react-router';
import { RaisedButton, TextField } from 'material-ui';

export default class CreateQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.createQuestions = this.createQuestions.bind(this);
    }
    createQuestions(ev) {
        ev.preventDefault();
        const QuizTitle = this.refs.quiztitle.getValue();
        const Totalmarks = this.refs.totmarks.getValue();
        const Passingmarks = this.refs.passmarks.getValue();
        const Time = this.refs.time.getValue();
        const totalquestion = this.refs.totalquestion.getValue();
        const QuizDetail = {
            Title: QuizTitle,
            Totalmarks: Totalmarks,
            Passingmarks: Passingmarks,
            Totaltime: Time,
            TotalQuestion: totalquestion
        };
        console.log(QuizDetail);
        if (QuizTitle === "" || Totalmarks === "" || Passingmarks === "" || Time === "" || totalquestion === "") {
            alert("Please Fill Required Fields")
        }
        else {
            browserHistory.push({
                pathname: '/CreateQuestion',
                search: '',
                state: {detail: QuizDetail}
            })
        }
    }

    render() {
        return (
            <div style={{'textAlign':'center'}}>
                <h1>Create Quiz!</h1>
                <TextField type="text" hintText="Title" floatingLabelText="Quiz Title" ref="quiztitle" /> <br />
                <TextField type="number" hintText="Total Marks" floatingLabelText="Total Marks" ref="totmarks" /> <br />
                <TextField type="number" hintText="Passing Marks" floatingLabelText="Passing Marks" ref="passmarks" /><br />
                <TextField type="number" hintText="Total Time" floatingLabelText="Total Time" ref="time" /><br />
                <TextField type="number" hintText="Total Question" floatingLabelText="Total Question" ref="totalquestion" /><br /><br />
                <RaisedButton primary={true} onClick={this.createQuestions} style={{'width' : '20%'}} ><span style={{'color':'white'}}>
                 Next Step </span></RaisedButton>
            </div>
        )
    }
}