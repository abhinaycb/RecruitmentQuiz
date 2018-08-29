import React from 'react';
import { Table, TableBody, RaisedButton} from 'material-ui';
import RenderedRow from './RenderedRow.js';
import logo from '../../Assets/newloader.gif';
import {getAllUsersQuiz} from '../../NetworkCalls.js';
import Signup from '.././common/signup';

const divStyle={
    width: "30%",
    margin: '160px auto'
};

export default class Candidates extends React.Component {

    constructor(props) {
        super(props);
        this.selectRow=this.selectRow.bind(this);
        this.onClickSignup=this.onClickSignup.bind(this);
        this.state = {users:[],isLoading:true,isSignupVisible:false};
    }

    componentDidMount() {
        const self=this;
        getAllUsersQuiz().then( (data) => {
            if(data!==undefined && data!==null && data.val()!==undefined && data.val()!==null) {
                let users=data.val();
                self.setState({
                    users: Object.values(users),
                    isLoading:false
                });
            }else{
                self.setState({isLoading:false});
            }
        }).catch( (error) => {
            self.setState({isLoading:false});
        })
    }

    onClickSignup() {
        this.setState({isSignupVisible:!this.state.isSignupVisible})

    }

    selectRow(index) {
        this.setState({selectedRow:index})
    }

    render() {
        const self=this;
        return (
            <div>
            {!self.state.isLoading &&
                <div style={{'alignItems':'center','alignContent':'center','textAlign':'center', paddingTop:'10px'}}>
                    <RaisedButton type="submit" primary={true}
                        style={{'backgroundColor':'clear', width:'200px', 'textAlign':'center',margin:'auto'}} onClick={this.onClickSignup}>
                        Sign Up A User
                    </RaisedButton>
                 
                    {self.state.isSignupVisible && <Signup />}
                    <Table multiSelectable={true} style={{'backgroundColor':'#12'}} >
                        <TableBody deselectOnClickaway={true} stripedRows>
                            {self.state.users.map((row, index) => (
                                    <RenderedRow
                                        key={index}
                                        data={Object.values(self.state.users)[index]}
                                        callbackFunction={() => self.selectRow(index)}
                                    />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }
            {self.state.isLoading && <div style={divStyle}><img src={logo} alt={"loading"}/></div>}
             </div>
        )
    }
}