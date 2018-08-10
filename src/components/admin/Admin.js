import React from 'react';
import { Dialog, Subheader, Table, TableBody } from 'material-ui';
import RenderedRow from './RenderedRow'
import * as firebase from 'firebase';

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          don: {},
            users:[],
        }
    }

    componentWillMount() {
        firebase.database().ref('users').on('value', (data) => {
            let users=data.val();
            this.setState({
                users: Object.values(users),
            });
        })
    }

    render() {
        var self = this;
        return (
            <div>
                <div>
                  <Subheader>Candidates</Subheader>
                  <Table multiSelectable={true} >
                      <TableBody
                         deselectOnClickaway={false}
                         stripedRows
                      >
                         {this.state.users.map((row, index) => (
                            <RenderedRow
                                row={Object.values(self.state.users)[index]}
                                {...self.props}
                                key={index}
                                onSelectRow={() => self.handleSelectRow(index)}
                             />
                        ))}
                     </TableBody>
                  </Table>
                </div>
             <Dialog
                    open={Boolean(this.state.selectedRow)}>
             </Dialog>
             </div>
       // <Link to="/CreateQuiz"><RaisedButton primary={true} ><span style={style}>Create Quiz</span></RaisedButton></Link>s
        )
    }

    handleSelectRow(index) {

    }
}
export default Admin;