import React from 'react';
import { Tabs, Tab, Typography } from 'material-ui';
import PropTypes from 'prop-types';
import CreateQuiz from './Tabs/Quizes/CreateQuiz.js';
import QuestionDisplay from './Tabs/Questions/QuestionDisplay.js';
import Candidates from './Tabs/Candidates/Candidates.js';
import AdminHome from './Tabs/Home/AdminHome.js';
import candidate from '../../Assets/candidate.svg';
import candidateSelected from '../../Assets/candidateSelected.svg';
import home from '../../Assets/home.svg';
import homeSelected from '../../Assets/homeSelected.svg';
import question from '../../Assets/question.svg';
import questionSelected from '../../Assets/questionSelected.svg';
import result from '../../Assets/result.svg';
import resultSelected from '../../Assets/resultSelected.svg';
import { white } from 'material-ui/styles/colors';

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
    background:'#0E2A47',
    color:'white',
    sel:'black',
    width:'25%',
    height:'50%',
    fontSize: "10px",
    fontFamily: "Comic Sans MS",
    autoResize: true,
    numberOfLines:0 ,
    margin:'10px',
}

const selectedTabStyle={
    background:'#0E2A47',
    color:'#A6A5AD',
    sel:'black',
    width:'25%',
    height:'30%',
    fontSize: "10px",
    fontFamily: "Comic Sans MS",
    autoResize: true,
    numberOfLines:0 ,
    margin:'10px',
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
                <div style={{width:'40%',padding:'5px 15px',margin:'20px 20px',background:'#8A83AC'}}>
                <Tabs value={this.state.selectedTab} onChange={this.handleSelectedTab} inkBarStyle={{background:'white',height:'4px'}}>
                    <Tab label="Home" icon={<img style={{width:'30px',height:'20px'}} src={this.state.selectedTab === '0' ? home:homeSelected} alt={"loading"}/>} value="0" style={this.state.selectedTab === '0' ? tabStyle:selectedTabStyle}/>
                    <Tab label="Quizzes" icon={<img style={{width:'20px',height:'20px'}} src={this.state.selectedTab === '1' ? candidate:candidateSelected} alt={"loading"} />} value="1" style={this.state.selectedTab === '1' ? tabStyle:selectedTabStyle} />
                    <Tab label="Questions" icon={<img style={{width:'20px',height:'20px'}} src={this.state.selectedTab === '2' ? question:questionSelected} alt={"loading"} />} value="2" style={this.state.selectedTab === '2' ? tabStyle:selectedTabStyle} />
                    <Tab label="Candidates" icon={<img style={{width:'20px',height:'20px'}} src={this.state.selectedTab === '3' ? result:resultSelected} alt={"loading"} />} value="3" style={this.state.selectedTab === '3' ? tabStyle:selectedTabStyle} />
                </Tabs>
                </div>
                <div style={{top:'40px'}}>
                {this.state.selectedTab === '0' && <AdminHome />}
                {this.state.selectedTab === '1' && <CreateQuiz />}
                {this.state.selectedTab === '2' && <QuestionDisplay />}
                {this.state.selectedTab === '3' && <Candidates />}
                </div>
            </div>
        )
    }

    handleSelectedTab(value, event) {
        this.setState({selectedTab:value});
    }
}