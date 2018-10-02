import React, { Component } from 'react';
import { Dialog, FlatButton, Tabs, Tab, TableRow, TableRowColumn, Table, TableBody, TableHeader } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {getQuizDataForUnattemptedQuizes,getScoreDataForAttemptedQuizzes} from '../../../../NetworkCalls.js';

export default class RenderedRow extends Component {
    constructor(props) {
        super(props);
        this._handleOpen = this._handleOpen.bind(this);
        this.getDialogue=this.getDialogue.bind(this);
        this._handleClose = this._handleClose.bind(this)
        this.state = {
            quizes:[],
            quizAttemptedScoreData:[],
            selectedRow:-1,
            open:false,
        };
    }

    componentDidMount() {
        const self = this;
        let attemptedQuizes = [];
        let unAttemptedQuizes = [];
        if(self.props.data.quizIds!==undefined){
            for(let quizId of Object.keys(self.props.data.quizIds)) {
                if(self.props.data.quizIds[quizId]) {
                    attemptedQuizes.push(quizId);
                }else{
                    unAttemptedQuizes.push(quizId);
                }
            }
            let arrayOfPromisesForScore = getScoreDataForAttemptedQuizzes(unAttemptedQuizes)
            for(let promise of arrayOfPromisesForScore){
                promise.then((data)=>{
                    const resultValue = data.val()
                    if(resultValue!==null && resultValue!==undefined)
                    {
                        self.setState({quizAttemptedScoreData: [...self.state.quizAttemptedScoreData, resultValue]})
                    }
                }).catch((error)=>{
                    //TODO: handle error
                    alert(error);
                    console.log(error);
                })
            }

            let arrayOfPromisesForQuizDetail = getQuizDataForUnattemptedQuizes(attemptedQuizes)
            for(let promise of arrayOfPromisesForQuizDetail){
                promise.then((data)=>{
                    if(data!==undefined && data.val()!==undefined)
                    {
                        const quizes = data.val();
                        self.setState({quizes: [...self.state.quizes,quizes]});
                    }
                }).catch((error)=>{
                    //TODO: handle error
                    console.log(error);
                })
            }
        }   
    }

    _handleOpen(index) {
        this.setState({})
        this.props.callbackFunction(index)
    }

    render() {
        const self = this;
        let {
            _, ...rest
        } = this.props;
        return (
            <TableRow >
                <TableRowColumn>{rest.data["name"]}</TableRowColumn>
                <TableRowColumn>{rest.data["email"]}</TableRowColumn>
                <TableRowColumn>
                    <FlatButton icon={<ContentAdd/>} onClick={self._handleOpen}/>
                </TableRowColumn>
            </TableRow>
         )
    }

    getDialogue() {
        const self=this;
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this._handleClose}/>,
         ]
        return (
            <Dialog actions={actions} autoScrollBodyContent={true} open={self.state.open&&self.state.quizes.length!==0}
                onRequestClose={self._handleClose} modal={true} title='UserDetail'>
                <Tabs>
                    <Tab label="Existing Quizes" >
                        <div>
                            <Table>
                                <TableHeader>{'Attempted Quizes'}</TableHeader>
                                <TableBody>
                                    {self.state.quizes && self.state.quizes.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableRowColumn>{row['Title']}</TableRowColumn>
                                            <TableRowColumn>{row['Totalmarks']} </TableRowColumn>
                                            <TableRowColumn>{row['Totalmarks']}</TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab label="Invite To A Quiz" >
                        <div>
                            <h2>QuizLists</h2>
                            <p>{self.state.quizAttemptedScoreData}</p>
                        </div>
                    </Tab>
                </Tabs>
            </Dialog>
        )
    }

    _handleClose() {
        this.setState({
            open: false
        })
        this.props.callbackFunction(undefined);
    }

}