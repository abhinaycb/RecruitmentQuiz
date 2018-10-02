import React from 'react';
import { Tabs, Tab, Typography } from 'material-ui';
import PropTypes from 'prop-types';
import CreateQuiz from './Tabs/Quizes/CreateQuiz.js';
import QuestionDisplay from './Tabs/Questions/QuestionDisplay.js';
import Candidates from './Tabs/Candidates/Candidates.js';
import AdminHome from './Tabs/Home/AdminHome.js';
import HomeLogo from '../../Assets/coffeebeansLogo.svg'


function TabContainer(props) {
    return (
        <Typography component="div" >
          {props.children}
        </Typography>
    )
}

TabContainer.propTypes={
    children: PropTypes.node.isRequired,
};
const tabStyle={
    background: '#94A1BD',
    color:'white',
    sel:'black',
    width:'25%',
    height:'60px',
    fontSize: "10px",
    fontFamily: "Comic Sans MS",
    autoResize: true,
    numberOfLines:0 ,
}

export default class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectedTab=this.handleSelectedTab.bind(this);
        this.state = {
            selectedTab: '0',
        };
    }

    render() {
        return (
            <div>
                <Tabs style={{'top':'30px','width':'45%','height':'50px'}} value={this.state.selectedTab} onChange={this.handleSelectedTab} inkBarStyle={{background: 'black',height:'2px'}}>
                    <Tab label="Home" icon={<img style={{width:'15px',height:'15px'}} src={HomeLogo} alt={"loading"}/>} value="0" style={tabStyle}/>
                    <Tab label="Quizzes" icon={<img style={{width:'15px',height:'15px'}} src={HomeLogo} alt={"loading"}/>}  value="1" style={tabStyle}/>
                    <Tab label="Questions" icon={<img style={{width:'15px',height:'15px'}} src={HomeLogo} alt={"loading"}/>}  value="2" style={tabStyle}/>
                    <Tab label="Candidates" icon={<img style={{width:'15px',height:'15px'}} src={HomeLogo} alt={"loading"}/>}  value="3" style={tabStyle}/>
                </Tabs>
                {this.state.selectedTab === '0' && <AdminHome />}
                {this.state.selectedTab === '1' && <CreateQuiz />}
                {this.state.selectedTab === '2' && <QuestionDisplay />}
                {this.state.selectedTab === '3' && <Candidates />}

            </div>
        )
    }

    handleSelectedTab(value, event) {
        this.setState({selectedTab:value});
    }
}