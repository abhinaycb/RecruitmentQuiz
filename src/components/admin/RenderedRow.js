import React, { Component } from 'react';
import { Dialog, FlatButton, Tabs, Tab,  TableRow, TableRowColumn } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import * as firebase from 'firebase';

export default class RenderedRow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            quizes:[],
            quizAttemptedScoreData:[],
        }

        this._handleOpen = this._handleOpen.bind(this)
        this._handleClose = this._handleClose.bind(this)
    }

    componentDidMount() {
        var self = this;
        var attemptedQuizes = [];
        var unAttemptedQuizes = [];
        for(var quizId of Object.keys(self.props.row.quizIds)) {
            if(self.props.row.quizIds[quizId]) {
                attemptedQuizes.push(quizId);
            }else{
                unAttemptedQuizes.push(quizId);
            }
        }

        for(var attemptedQuizId of attemptedQuizes) {
            firebase.database().ref('Score').child(attemptedQuizId).on('value',(data)=>{
                var resultValue = data.val()
                self.setState({quizAttemptedScoreData: [...self.state.quizAttemptedScoreData,resultValue]})
            })
        }

        firebase.database().ref('QuizDetail').on('value',(data) => {
            var quizes = Object.values(data.val());
            self.setState({quizes:quizes});
        })
    }

    _handleOpen() {
        this.setState({
            open: true
        })
    }

    _handleClose() {
        this.setState({
            open: false
        })
    }

    render() {
        var self = this
        const {
            children,
            ...rest
        } = this.props

        const actions = [
            <FlatButton
             label="Cancel"
             primary={true}
             onClick={this._handleClose}
            />,
        ]

        return (
            <TableRow {...rest}>
                {children[0]}
                 <TableRowColumn>{rest.row["name"]}</TableRowColumn>
                 <TableRowColumn>{rest.row["email"]}</TableRowColumn>
                 <TableRowColumn>
                    <FlatButton
                    icon={<ContentAdd/>}
                    onClick={this._handleOpen}
                 />
                </TableRowColumn>

        <Dialog
        actions={actions}
        autoScrollBodyContent={true}
        open={this.state.open}
        onRequestClose={this._handleClose}
        modal={false}
        title='UserDetail'
            >
            <Tabs>
                <Tab label="Existing Quizes" >
                        <div>
                        <h2>Attempted Quizes</h2>
                        <tr>
                         {self.state.quizes.map((row, index) => ( <div><td>{row['Title']}</td> <td>{row['Totalmarks']} </td> <td>{row['Totalmarks']}</td></div> ))}
                        </tr>
                        </div>
                </Tab>

                <Tab label="Invite To A Quiz" >
                    <div>
                        <h2>QuizLists</h2>
                        <p>
                            {self.state.quizAttemptedScoreData}
                       </p>
                    </div>
                 </Tab>

          </Tabs>
        </Dialog>
        </TableRow>
        )
    }
}