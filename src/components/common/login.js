import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { RaisedButton, TextField, Paper, MuiThemeProvider } from 'material-ui';
import { loginToFirebase } from '../../NetworkCalls.js';
import * as firebase from 'firebase';
import logo from '../../Assets/newloader.gif';
// import {CreateMuiTheme} from 'material-ui';

const loginPaperStyle = {
    display:'inline-box',
    height: "80%",
    width: "60%",
    border: 'solid black',
    backgroundColor:'#EAC688',
    alignContent: 'center',
    alignItems: 'flex-end',
    margin: '5% 20% 5% 20%',
    justifyContent: 'centre',
};

const loaderStyle = {
    width: '40%',
    margin: '200px auto',
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.state = {
          textValue: '', passwordValue: '', isLoading: false,error: false, errorObject: undefined
        }
    }

    componentDidMount() {
        if(this.refs.txte.getValue() !== "" || this.refs.pass.getValue() !== "") {
            this.refs.txte.focus();
            this.refs.pass.focus()
        }
    }

    onLoginClicked(ev) {
          ev.preventDefault();
          const self = this;
          const email = this.refs.txte.getValue();
          const pass = this.refs.pass.getValue();

          this.setState({isLoading: true});

          loginToFirebase(email, pass).then((result) => {
              const currentUser = firebase.auth().currentUser;
              if (currentUser === undefined && currentUser.uid === undefined) {
                  self.setState({isLoading: false});
                  return;
              }
              firebase.database().ref('users').child(currentUser.uid).once('value').then((data) => {
                  const userDetail = data.val();
                  if (!userDetail.hasOwnProperty('admin') || userDetail['admin'] === false) {
                      const quizIdsObjectArray = userDetail['quizIds'];
                      global.currentComponent.setState({value: 'Logout'});
                      localStorage.setItem("userId", currentUser.uid);
                      if (quizIdsObjectArray !== null && quizIdsObjectArray !== undefined && quizIdsObjectArray !== {} ) {
                          self.setState({isLoading:false},(data) => (
                              browserHistory.push({
                                  pathname: '/QuizesDisplayPage',
                                  search: '',
                                  state: {
                                      'quizIdsArray': Object.keys(quizIdsObjectArray)
                                  }
                              })
                          ));
                      }else {
                          self.setState({isLoading: false});
                          alert("No quiz Data Available for the user")
                      }
                  } else {//admin case
                        global.currentComponent.setState({value: 'Logout'});
                        localStorage.setItem("userId", currentUser.uid);
                        localStorage.setItem("isAdmin", true);
                        browserHistory.push("/Admin");
                  }
              }).catch(function (error) {
                  // Handle Errors here.
                  self.setState({isLoading: false,error: true,errorObject:error},alert("problem getting data from user node",error));
              });
          }).catch(function (error) {
              // Handle Errors here.
              self.setState({isLoading: false,error: true, errorObject:error}, alert("Login Failed",error));
          });
    }

    render() {
          const self = this;
        return (
              <div>
                <MuiThemeProvider>
                     <div style={{'textAlign': 'center', 'alignContent': 'center'}}>
                            {
                            self.state.isLoading ? <img src={logo} alt={"loading"} style={loaderStyle}/>
                            :
                             <Paper style={loginPaperStyle}  >
                                <div height={'100%'} style={{'display': 'flex', 'flexDirection': 'column', 'margin': '5% 5% 5% 5%','alignItems':'center', 'textAlign':'center'}}>
                                    <div>
                                        <h1 style={{'color': 'white'}}>Login</h1>
                                    </div>
                                    <div style={{'display': 'flex', 'flexDirection': 'column', 'padding': '10% 10% 10% 10%','alignItems':'center', 'textAlign':'center'}}>

                                        <TextField autoComplete={"off"}  width={'50%'} type="text"
                                            value={self.state.textValue} hintText="UserEmail" floatingLabelText="Email"
                                            ref="txte" onChange={e => this.setState({textValue: e.target.value})}/>
                                        <TextField autoComplete={"off"} width={'50%'}
                                            type="password" value={self.state.passwordValue} hintText="Password"
                                            floatingLabelText="Password" ref="pass"
                                            onChange={e => self.setState({passwordValue: e.target.value})}/>
                                    </div>
                                    <div>
                                        <RaisedButton onClick={this.onLoginClicked}><span style={{'background':'linear-gradient(#55506E, rgb(154, 80, 80))','padding':'20% 35%'}}>Login</span></RaisedButton>
                                    </div> 
                                </div>
                              </Paper>}
                     </div>
              </MuiThemeProvider>
          </div>
          )
    }
}
export default Login;