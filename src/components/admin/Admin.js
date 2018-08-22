import React from 'react';
import { Tabs, Tab, Typography } from 'material-ui';
import PropTypes from 'prop-types';
import CreateQuiz from './CreateQuiz.js';
import InviteQuiz from './InviteQuiz.js';
import Candidates from './Candidates.js';

function TabContainer(props) {
    return (
        < Typography component="div" >{props.children}</Typography>
    )
}

TabContainer.propTypes={
    children: PropTypes.node.isRequired,
};

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

                <Tabs value={this.state.selectedTab} onChange={this.handleSelectedTab} inkBarStyle={{background: 'red'}} >
                    <Tab label="CreateQuiz" value="0" style={{background: '#55506E'}}/>
                    <Tab label="Invite To A Quiz" value="1" style={{background: '#55506E'}}/>
                    <Tab label="Candidates" value="2" style={{background: '#55506E'}}/>
                </Tabs>
                {this.state.selectedTab === '0' && <CreateQuiz />}
                {this.state.selectedTab === '1' && <InviteQuiz />}
                {this.state.selectedTab === '2' && <Candidates />}

            </div>
        )
    }

    handleSelectedTab(value, event) {
        this.setState({selectedTab:value});
    }
}