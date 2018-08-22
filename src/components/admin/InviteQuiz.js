import React from 'react';
import { TextField, DropDownMenu, MenuItem, RaisedButton } from 'material-ui';
import getUserDataForEmail from '../../NetworkCalls.js'

const style2 = {
    color: "white",
    width: '150px',
};

export default class InviteQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.inviteUserToQuiz = this.inviteUserToQuiz.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            selectedIndex: -1,
        };
    }

    handleChange(event, index, value) {
        event.preventDefault();
        this.setState({selectedIndex:value});
    }

    render() {
        const options = [
            { value: -1, text: 'select quiztype' },
            { value: 0, text: 'iOS' },
            { value: 1, text: 'React'},
            { value: 2, text: 'Python'},
        ];
        return (
            <div style={{'textAlign':'center'}}>
                    <h1>InviteQuiz!</h1>
                    <TextField type="text" hintText="Email" floatingLabelText="email" ref="email" /> <br />
                    <TextField type="text" hintText="Name" floatingLabelText="name" ref="name" /> <br /> <br />
                    <DropDownMenu value={this.state.selectedIndex} style={{"align":"left","textAlign":"left","fontFamily" : "sans-serif","fontSize":"16px","width":"300px","titleColor":"rgb(168, 164, 164)"}} onChange={this.handleChange} ref="dropdownTitle" >
                        {options.map((item, key) => {
                            return (
                                <MenuItem key={item.value} value={item.value} primaryText={item.text} style={{"color":"rgb(168, 164, 164)"}}/>
                            )
                        })}
                    </DropDownMenu> <br/><br/>
                    <TextField type="number" hintText="Number of questions" floatingLabelText="number of questions"
                        ref="noOfQuestions"/><br/><br/>
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