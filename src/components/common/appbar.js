import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';

const navbarStyle ={
    background: "rgb(154, 80, 80)",
    box: "4px 4px 4px 4px rgb(154, 80, 80)",
    textAlign: "center",
    align:'center',
};

class Bar extends Component {

   constructor(props) {
      super(props);

      this.state = {
         value: "Signup",
      };
      this.signoutClicked = this.signoutClicked.bind(this);
      this.getTitleString = this.getTitleString.bind(this);
   }

   componentDidMount() {
      global.currentComponent = this
   }

   signoutClicked(ev) {
      ev.preventDefault();      
      this.setState({
        value: "Signup"
      });
      if(localStorage.getItem("userId") !== null) {
          localStorage.removeItem("userId");
          browserHistory.push('/');
      }else {
          if(this.state.value === "Login") {
              this.setState({
                  value: "Signup"
              });
              browserHistory.push('/');
          }else {
              this.setState({
                  value: "Login"
              });
              browserHistory.push('/Signup');
          }
      }
   }

    homeClicked(ev) {
        ev.preventDefault();
        const isAdmin = localStorage.getItem("isAdmin");
        if(isAdmin === null || isAdmin === undefined || isAdmin === "false") {
            browserHistory.push('/QuizesDisplayPage');
        }else{
            browserHistory.push('/Admin');
        }
    }

   render() {
       const titleString = this.getTitleString(this.props.children.props.location.pathname);
       const self = this;
       return (
           <div>
              <MuiThemeProvider>
                  <div>
                      <AppBar title="CoffeeBeans" style={navbarStyle} iconElementRight={titleString !== "" ? <FlatButton label={titleString}  onClick={self.signoutClicked}/> : null}  iconElementLeft={localStorage.getItem("userId") !== null ? <FlatButton label={'Home'} onClick={self.homeClicked} style={{color:"white",alignY: 'center'}}/> : null} />
                      {self.props.children}
                  </div>
              </MuiThemeProvider>
          </div>
       )
    }

    getTitleString(forPath) {
        if(forPath === undefined || forPath === null || forPath === "/" || forPath === "/Login") {
            return ""
        }else if(forPath === "/Signup") {
            return ""
        }
        return "Logout"
    }
}

export default Bar;