import React from 'react';
import {RaisedButton } from 'material-ui';
import getUserDataForEmail from '../../NetworkCalls.js'

const style2 = {
    color: "white",
    width: '150px',
};

export default class InviteQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.inviteUserToQuiz = this.inviteUserToQuiz.bind(this);
    }

    render() {

        return (
            <div style={{'textAlign':'center'}}>
                    <h1>CreateQuestionManually!</h1>
                    <RaisedButton primary={true} onClick={this.inviteUserToQuiz} style={{width:'20%'}} ><span style={style2}>Create Quiz</span>
                    </RaisedButton>

            </div>
        )
    }

    inviteUserToQuiz() {
        const email = this.refs.email.getValue();
        // const name = this.refs.name.getValue();
        // const subjectType = this.refs.dropdownTitle.getValue();
        // const totalquestion = this.refs.noOfQuestions.getValue();
        getUserDataForEmail(email).then((snapshot) => {
            let value = snapshot.val();
            if(value === null || value === undefined) {
                alert('Please SignUpUser To Add Quizes')
            }else {
                //create quiz 2 nodes containing title / name / questions node
                //then add new quiz id into the user node to enable particular quiz for specific user
            }
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
    }
}