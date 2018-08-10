import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';

const style ={
  background:"#36BBCB",
    align: 'center'
};

class Bar extends Component {

   constructor(props) {
      super(props);
        
      this.state = {
         value: "Signup",
      }
      this.signout = this.signout.bind(this);
   }

   componentDidMount() {
      global.currentComponent = this
   }
    
   signout(ev) {
      ev.preventDefault();      
      this.setState({
        value: "Signup"
      })
      if(localStorage.getItem("userId") !== null) {
          localStorage.removeItem("userId");
          browserHistory.push('/');
      }else {
          if(this.state.value === "Login") {
              this.setState({
                  value: "Signup"
              })
              browserHistory.push('/');
          }else {
              this.setState({
                  value: "Login"
              })
              browserHistory.push('/Signup');
          }
      }
   }

    menuItemClicked(ev) {
        ev.preventDefault();
        const isAdmin = localStorage.getItem("isAdmin");
        if(isAdmin === null || isAdmin === undefined || isAdmin === "false") {
            browserHistory.push('/QuizesDisplayPage');
        }else{
            browserHistory.push('/Admin');
        }
    }

   render() {
      return (
          <div>
              <MuiThemeProvider>
                  <div>
                      <center>
                      <AppBar title="CoffeeBeans" style={style} iconElementRight={<FlatButton label={this.state.value}  onClick={this.signout}/>}  iconElementLeft={localStorage.getItem("userId") !== null ? <FlatButton label={'Home'} onClick={this.menuItemClicked}/> : null} />
                  </center></div>
              </MuiThemeProvider>
              //{this.props.children}
          </div>
      )
    }
}

export default Bar;