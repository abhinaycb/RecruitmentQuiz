import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import * as firebase from "firebase";
import { RaisedButton, TextField } from 'material-ui';
import Paper from 'material-ui/Paper';
import { signupWithFirebase, saveUserInFirebase } from '../../NetworkCalls.js'

const style = {
    height: "600px",
    width: "60%",
    padding: 20,
     margin: "20px 0px 20px 0px",
};
const style1 = {
   color: "rgb(0, 188, 212)",
  
};
const style2 = {
   color: "white",
};
class Signup extends Component {

    constructor(props) {
        super(props)
        this.signup = this.signup.bind(this);
    }

    signup(ev) {
        ev.preventDefault();
        const name = this.refs.name.getValue();
        const email = this.refs.txte.getValue();
        const pass = this.refs.pass.getValue();
        console.log(name, email, pass)
       
        signupWithFirebase(email,pass).then((result) => {
            let userId = firebase.auth().currentUser.uid;
            // let userDetail = {
            //     username: name,
            //     useremail: email,
            //     userpass: pass
            // }
            alert("Congratulations "+name)
            saveUserInFirebase(name,email,userId)
            global.currentComponent.setState({value: 'Logout'})
            localStorage.setItem("userId",userId);
            browserHistory.push('/Start')
        })
        .catch(function (error) {
            // Handle Errors here.
            alert(error.message)
            alert(error.code)      
        });
    }

    render() {
        return (
            <center>
                <div>
                    <Paper style={style} zDepth={3} >
                     <h1  style={style1}>Signup</h1>
                        <TextField type="text" hintText="Name" floatingLabelText="Full Name" ref="name" /> <br />
                        <TextField type="email" hintText="Email" floatingLabelText="E-mail" ref="txte" /> <br />
                        <TextField type="password"  hintText="Password" floatingLabelText="Password" ref="pass" /><br /><br />
                        <RaisedButton primary={true} onClick={this.signup} ><span style={style2}> SIGNUP </span>  </RaisedButton>
                    </Paper>
                </div>
            </center>)
    }
}
export default Signup;