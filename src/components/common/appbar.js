import React, { Component } from 'react';
import { AppBar } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import HomeLogo from '../../Assets/coffeebeansLogo.svg'

const navbarStyle ={
    box: '4px 4px 4px 4px',
    textAlignY: 'center',
    alignY:'center',
    background: '#94A1BD',
};

const homeButtonStyle={
    color:'white',
    alignY: 'center',
    textAlignY: 'center',
    fontSize: '28px',
    fontFamily: 'Comic Sans MS',
    background:'#01A8DA',
    borderRadius:20.0,
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
      const self=this; 
      ev.preventDefault();      
      this.setState({
        value: "Signup"
      }, (data) => {
            if(localStorage.getItem('userId') !== null) {
                localStorage.removeItem("userId");
                browserHistory.push('/');
            } else {
                if(self.state.value === "Login") {
                    this.setState({
                        value: "Signup"
                    },browserHistory.push('/'));
                } else {
                    this.setState({
                        value: "Login"
                    },browserHistory.push('/Signup'));
                }
            }
        })
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
                  <div className="table100 ver1 m-b-110" style={{"minHeight": '50px',alignY:'center', height:'100%',borderRadius:'10px'}}>
                      <AppBar title="" titleStyle={{'color':'#94A1BD'}} style={navbarStyle}    
                              iconElementRight={titleString !== "" ? 
                                <FlatButton style={homeButtonStyle} label={titleString}  
                                            onClick={self.signoutClicked}
                                            /> : null}  
                              iconElementLeft={localStorage.getItem("userId") !== null ?
                                 <FlatButton  label={'CoffeeBeans'} icon={<img style={{width:'50px',height:'50px'}} src={HomeLogo} alt={"loading"}/>}  onClick={self.homeClicked} 
                                 /> : null} />
                      {self.props.children}
                  </div>>
          </div>
       )
    }

    getTitleString(forPath) {
        if(forPath === undefined || forPath === null || forPath === "/" || forPath === "/Login") {
            return "Signup"
        }else if(forPath === "/Signup") {
            return "Login"
        }
        return "Logout"
    }
}

export default Bar;