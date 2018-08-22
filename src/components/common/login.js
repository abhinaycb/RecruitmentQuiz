import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import Paper from 'material-ui/Paper';
import { RaisedButton, TextField } from 'material-ui';
import { loginToFirebase } from '../NetworkCalls.js'
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from '../../Assets/loader.gif'

const style = {
  height: "600px",
  width: "60%",
  margin: "20px 20px",
  textAlign: 'center',
  display: 'inline-block',
};

const styleCopy = {
    height: "650px",
    width: "60%",
    textAlign: 'center',
    display: 'inline-block',
};

const loaderStyle = {
    height: "50%",
    width: "50%",
};

const style1 = {
   color: "rgb(0, 188, 212)",
  
};
const style2 = {
   color: "white",
  
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      value: "Create",
      isLoading: false,
    }
  }

  componentDidMount() {
      if(this.refs.txte.getValue() !== "<" || this.refs.pass.getValue() !== "<") {
          this.refs.txte.text = "";
          this.refs.pass.text = "";
      }
  }

  login(ev) {
    ev.preventDefault();
    const email = this.refs.txte.getValue();
    const pass = this.refs.pass.getValue();

    this.setState({isLoading:true});

    loginToFirebase(email,pass).then((result) => {
        let userId = firebase.auth().currentUser.uid;
        global.currentComponent.setState({value: 'Logout'});
        localStorage.setItem("userId",userId);

        firebase.database().ref('users').child(userId).on('value', (data) => {
                var userDetail = data.val();
                var quizIds = Object.keys(userDetail['quizIds']);
                var quizDataArray = [];
                if(quizIds === null || quizIds.length === 0) {
                     console.log('error');
                     this.setState({isLoading:true});
                     browserHistory.push("/Quizes");
                }else if(!userDetail.hasOwnProperty('admin') || userDetail['admin'] === false) {
                    localStorage.setItem("isAdmin",false);
                    for (var quizIdValue of quizIds) {
                        firebase.database().ref('QuizDetail').child(quizIdValue).on('value', (data) => {
                            var quizIdData = data.val();
                            if (quizIdData != null) {
                                quizDataArray.push(quizIdData);
                                if (quizDataArray.length === quizIds.length) {
                                    this.setState({isLoading:true});
                                   browserHistory.push({
                                      pathname: '/QuizesDisplayPage',
                                      search: '',
                                      state: {
                                        quizIdsArray: quizIds,
                                        quizDetailsArray: quizDataArray,
                                      }
                                   });
                                }
                             } else {
                                    this.setState({isLoading:true});
                                    console.log('error');
                                    browserHistory.push("/Quizes");
                             }
                        })
                    }
                } else {
                    localStorage.setItem("isAdmin",true);
                    browserHistory.push("/Admin");
                }
        })
    }).catch((err) => {
      if (err) {
        alert(err);
        this.refs.txte.focus()
      }
    })
  }


  render() {
    return (
      <div>
        <center>
        <div>
        {this.state.isLoading && <img src={logo} alt={"loading"} style={loaderStyle}/>}
        </div>
        <MuiThemeProvider>
        {!this.state.isLoading &&
          <Paper style={this.state.isLoading ? styleCopy : style} zDepth={3} >
            <h1 style={style1}>Login</h1>
            <TextField type="email" hintText="UserEmail" floatingLabelText="Email" ref="txte" /> <br />
            <TextField type="password" hintText="Password" floatingLabelText="Password" ref="pass" /> <br />
            <br /><RaisedButton onClick={this.login} primary={true}><span style={style2}> Login </span></RaisedButton><br />
          </Paper> }
      </MuiThemeProvider>
      </center>
      </div>
    )
  }
}

export default Login;  