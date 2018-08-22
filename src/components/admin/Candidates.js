import React from 'react';
import {Dialog, Table, TableBody, Subheader} from 'material-ui';
import RenderedRow from './RenderedRow.js';
import logo from '../../Assets/newloader.gif';
import {getAllUsersQuiz} from '../../NetworkCalls.js';

const textStyle = {
    color:'white',
    fontSize:22,
    backgroundColor:'rgb(120, 188, 212)',
};

export default class Candidates extends React.Component {

    constructor(props) {
        super(props);
        this.selectRow = this.selectRow.bind(this);
        this.state = {users:[],isLoading:true};
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
                alert('error');
                self.setState({isLoading:false});
            }
        }).catch( (error) => {
            alert(error);
            self.setState({isLoading:false});
        })
    }

    selectRow(index) {
        this.setState({selectedRow:index})
    }

    render() {
        const self=this;
        return (
            <div>
            {!self.state.isLoading && <div><Subheader style={textStyle}>{'Candidates'}</Subheader>
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
                <Dialog open={Boolean(self.state.selectedRow)}/></div>
            }
            {self.state.isLoading && <div style={{'width': "30%", 'margin': '160px auto'}}><img src={logo} alt={"loading"}/></div>}
            </div>
        )
    }
}