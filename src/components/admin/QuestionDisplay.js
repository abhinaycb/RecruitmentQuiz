import React from 'react';
import {RaisedButton } from 'material-ui';
import getUserDataForEmail from '../../NetworkCalls.js'
import {Link} from "react-router";
import $ from 'jquery';
import './QuestionDisplay.css';
//
// const style2 = {
//     color: "white",
//     width: '150px',
// };

export default class QuestionDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.inviteUserToQuiz = this.inviteUserToQuiz.bind(this);
    }

    componentWillMount() {
        const self=this;
        $(document).ready(function() {
            $(".cta").click(function() {
                 if (self.refs.form.className.localeCompare('form')) {
                    $(".form").slideDown(250);
                    $(".cta").css('cursor', 'default');
                    $(".form").toggleClass("hidden");
                    self.refs.email.focus();
                 }else{
                    $(".form").slideUp(250);
                    $(".cta").css('cursor', 'pointer');
                    $(".form").toggleClass('hidden');
                 }
             });
        });
    }

    render() {
        return (
                    <div className="optin-container">
                        <div className="cta" ref="cta">Create Questions Manually</div>
                        <form className="form hidden" ref="form">
                            <input type="email" id="email" name="email" placeholder="enter number" ref="email"/>
                            <input type="submit" value="Submit" />
                        </form>	  
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