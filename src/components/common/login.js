import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { RaisedButton, TextField, Paper } from 'material-ui';
import { loginToFirebase } from '../../NetworkCalls.js';
import * as firebase from 'firebase';
import logo from '../../Assets/newLoader.gif';
import {backgroundImageLogo} from '../../Assets/crossLogo.png';

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
              self.setState({isLoading: true});
              firebase.database().ref('users').child(currentUser.uid).once('value').then((data) => {
                  const userDetail = data.val();
                  if (!userDetail.hasOwnProperty('admin') || userDetail['admin'] === false) {
                      const quizIdsObjectArray = userDetail['quizIds'];
                      global.currentComponent.setState({value: 'Logout'});
                      localStorage.setItem("userId", currentUser.uid);
                      localStorage.setItem("isAdmin", false)
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
                        global.currentComponent.setState({value: 'Logout'})
                        localStorage.setItem("userId", currentUser.uid)
                        localStorage.setItem("isAdmin", true)
                        self.setState({isLoading: false},(data) => (
                            browserHistory.push("/Admin")
                        ));
                  }
              }).catch(function (error) {
                  //TODO: handle error
                  // Handle Errors here.
                  self.setState({isLoading: false,error: true,errorObject:error},alert("problem getting data from user node",error));
              });
          }).catch(function (error) {
              // Handle Errors here.
              //TODO: handle error
              self.setState({isLoading: false,error: true, errorObject:error}, alert("Login Failed",error));
          });
    }

    render() {
          const self = this;
        return (
              <div>
                     <div style={{'textAlign': 'center','margin': '2% 2% 5% 2%'}}>
                            {
                            self.state.isLoading ? <img src={logo} alt={"loading"} style={loaderStyle}/>
                            :
                             <Paper>
                                <div style={{'display': 'flex', 'flexDirection': 'column','alignItems':'center','padding':'2% 2% 5% 2%', 'textAlign':'center'}}>
                                    <div>
                                        <h1 style={{'color': 'black'}}>Login</h1>
                                    </div>
                                    <div style={{'display': 'flex', 'flexDirection': 'column', 'padding': '2% 5% 2% 5%','alignItems':'center', 'textAlign':'center'}}>

                                        <TextField autoComplete={"off"}  width={'50%'} type="text"
                                            value={self.state.textValue} hintText="UserEmail" floatingLabelText="Email"
                                            ref="txte" onChange={e => this.setState({textValue: e.target.value})}/>
                                        <TextField autoComplete={"off"} width={'50%'}
                                            type="password" value={self.state.passwordValue} hintText="Password"
                                            floatingLabelText="Password" ref="pass"
                                            onChange={e => self.setState({passwordValue: e.target.value})}/>
                                    </div>
                                    <div>
                                        <RaisedButton style={{'background':'#94A1BD'}} onClick={this.onLoginClicked}>Login</RaisedButton>
                                    </div> 
                                </div>
                              </Paper>}
                     </div>
          </div>
          )
    }
}
export default Login;