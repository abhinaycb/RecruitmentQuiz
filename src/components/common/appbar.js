import React, { Component } from 'react';
import { AppBar } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import HomeLogo from '../../Assets/coffeebeansLogo.svg'

const navbarStyle ={
    box: '2px 2px 2px 2px',
    textAlignY: 'center',
    alignItems:'center',
    background: '#0E2A47',
    height: '100%',
    width: '100%',
};

const homeButtonStyle={
    backgroundColor:'#8A83AC',
    color:'white',
    fontSize: '22px',
    fontFamily: 'Comic Sans MS',
    textAlignY:'center',
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
        value: this.state.value === "Signup" ? "Login" : (this.state.value === "Login" ? "Signup" : "NeverShoutHappenLogout")
      }, (data) => {
            if(localStorage.getItem('userId') !== null) {
                localStorage.removeItem("userId");
                browserHistory.push('/');
            } else {
                if(self.state.value === "Login") {
                   browserHistory.push('/');
                } else {
                    browserHistory.push('/Signup');
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
                  <div className="table100 ver1 m-b-110" style={{height: '100%',width:'100%',borderRadius:'0px'}}>
                      <AppBar style={navbarStyle}    
                              iconElementRight={titleString !== "" ? 
                                <FlatButton style={homeButtonStyle} label={titleString}  
                                            onClick={self.signoutClicked}
                                            /> : null}  
                              iconElementLeft={localStorage.getItem("userId") !== null ?
                                 <FlatButton style={{fontSize: '32px',
                                    fontFamily: 'Comic Sans MS',
                                    color:'white',height:'100px',textAlign:"center"}}
                                    label={'CoffeeBeans'} 
                                    icon={
                                        <img 
                                            style={{width:'90px',height:'90px'}} 
                                            src={HomeLogo} alt={"loading"} />
                                    }  onClick={self.homeClicked
                                    } 
                                    /> : null} 
                                />
                      {self.props.children}
                  </div>
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