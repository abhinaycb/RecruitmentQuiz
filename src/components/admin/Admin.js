import React from 'react';
import { Tabs, Tab, Typography } from 'material-ui';
import PropTypes from 'prop-types';
import CreateQuiz from './CreateQuiz.js';
import QuestionDisplay from './QuestionDisplay.js';
import Candidates from './Candidates.js';

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
    background: '#7918f2',
    background: '-webkit-linear-gradient(-68deg, #ac32e4 , #4801ff)',
    background: '-o-linear-gradient(-68deg, #ac32e4 , #4801ff)',
    background: '-moz-linear-gradient(-68deg, #ac32e4 , #4801ff)',
    background: 'linear-gradient(-68deg, #ac32e4 , #4801ff)',
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
                <Tabs value={this.state.selectedTab} onChange={this.handleSelectedTab} inkBarStyle={{background: '#EAC688'}}>
                    <Tab label="Quizzes" value="0" style={tabStyle}/>
                    <Tab label="Questions" value="1" style={tabStyle}/>
                    <Tab label="Candidates" value="2" style={tabStyle}/>
                </Tabs>
                {this.state.selectedTab === '0' && <CreateQuiz />}
                {this.state.selectedTab === '1' && <QuestionDisplay />}
                {this.state.selectedTab === '2' && <Candidates />}

            </div>
        )
    }

    handleSelectedTab(value, event) {
        this.setState({selectedTab:value});
    }
}