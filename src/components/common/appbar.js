import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';

const navbarStyle ={
    background: '#625069',
    background: '-webkit-linear-gradient(-68deg,rgb(154, 80, 80),#55506E)',
    background: '-o-linear-gradient(-68deg,rgb(154, 80, 80),#55506E)',
    background: '-moz-linear-gradient(-68deg,rgb(154, 80, 80),#55506E)',
    background: 'linear-gradient(-68deg,rgb(154, 80, 80),#55506E)',
    box: "4px 4px 4px 4px",
    textAlign: "center",
    align:'center'
};

const homeButtonStyle={
    color:"white",
    alignY: 'center'
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
            //not push
        }else{
            browserHistory.push('/Admin');
            //not push
        }
    }

   render() {
       const titleString = this.getTitleString(this.props.children.props.location.pathname);
       const self = this;
       return (
           <div>
              <MuiThemeProvider>
                  <div className="table100 ver1 m-b-110" style={{"minHeight": '100vh',height:'100%',borderRadius:'0px'}}>
                      <AppBar title="CoffeeBeans" style={navbarStyle} 
                              iconElementRight={titleString !== "" ? 
                                <FlatButton label={titleString}  
                                            onClick={self.signoutClicked}
                                /> : null}  
                              iconElementLeft={localStorage.getItem("userId") !== null ?
                                 <FlatButton label={'Home'} onClick={self.homeClicked} 
                                 style={homeButtonStyle}/> : null} />
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