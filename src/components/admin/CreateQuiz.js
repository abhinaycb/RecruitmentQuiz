import React from 'react';
import {
    withStyles,
    DropDownMenu,
    MenuItem,
    RaisedButton,
    TextField,
    Dialog,
    TableBody,
    Table,
    TableRow,
    TableHeader,
    TableRowColumn,
    TableHeaderColumn,
    Subheader
} from 'material-ui';
import * as firebase from 'firebase';
import {saveQuizDataIntoServer} from "../../NetworkCalls";
import QuizesDisplayPage from "../user/QuizesDisplayPage";
import {Link} from "react-router";
import crossLogo from '../../Assets/crossLogo.png';
import ../CreateQuiz.css;

const dropdownstyle = {color:'#A9A5A5',width:'115%',marginLeft:'-20px'};
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

export default class CreateQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.createQuestions=this.createQuestions.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleChangeInSubject=this.handleChangeInSubject.bind(this);
        this.createSections=this.createSections.bind(this);
        this.enterNumberOfQuestions=this.enterNumberOfQuestions.bind(this);
        this.handleChangeInSelectedUser=this.handleChangeInSelectedUser.bind(this);
        this.selectRow=this.selectRow.bind(this);
        this.clearPopUp=this.clearPopUp.bind(this);
        this.state = {
            selectedIndex: 0,
            selectedIndexes:[],
            options: [],
            questionData: {},
            isActiveDialogue: false,
            selectedSubject: '',
            finalQuizIdArray: [],
            invitedUsers: [],
            selectedInvitedUser: 0,
            quizIdArray:[],
            isCardClicked: false,
            selectedCardValue: undefined,
        };
    }

    componentWillMount() {
        const self=this;
        firebase.database().ref('QuizQuestion').once('value').then((data)=>{
            let typesOfQuiz=data.val();
            if(typesOfQuiz!==undefined && typesOfQuiz!==null) {
                let stateArray= self.state.options.concat(Object.keys(typesOfQuiz));
                self.setState({options:stateArray, questionData:typesOfQuiz})
            }
        }).catch((err)=>{
            alert(err)
        })

        firebase.database().ref('users').orderByChild('admin').equalTo(false).once('value').then((snapshot) => {
            let invitedUsers=snapshot.val();
            self.setState({
                invitedUsers:Object.values(invitedUsers),
            })
        })

        firebase.database().ref('QuizDetail').once('value').then((data) => {
            if(data!==undefined&&data!==null&&data.val()!==undefined&&data.val()!==null) {
                let quizIds = Object.keys(data.val())
                self.setState({quizIdArray:[...self.state.quizIdArray,quizIds]});
            }
        }).catch((error)=>{
            alert(error)
        })
    }

    handleChange(event, index, value) {
        event.preventDefault();
        let arr = Array(index).fill(0);
        this.setState({selectedIndex:index, selectedIndexes:arr});
    }

    createQuestions(ev) {
        ev.preventDefault();
        const QuizTitle = this.refs.quiztitle.getValue();
        const Totalmarks = this.refs.totmarks.getValue();
        const Passingmarks = this.refs.passmarks.getValue();
        const Time = this.refs.time.getValue();
        const totalquestion = this.refs.totalquestion.getValue();
        const quizIds=this.state.finalQuizIdArray;

        if (QuizTitle === "" || Totalmarks === "" || Passingmarks === "" || Time === "" || totalquestion === "") {
            alert("Please Fill Required Fields");
        }else if(parseInt(totalquestion,10) !== Object.values(quizIds).reduce( function(sum, value){
                return sum + parseFloat(value.selectedValue);
            }, 0 ) ) {
            alert('Total sum of questions is not equal to the sum of individual sections');
        }else {
            const quizDetail = {
                Title: QuizTitle,
                Totalmarks: Totalmarks,
                Passingmarks: Passingmarks,
                Totaltime: Time,
                TotalQuestion: totalquestion,
                QuestionIds: quizIds,
            };
            saveQuizDataIntoServer(quizDetail,this.state.invitedUsers[this.state.selectedInvitedUser]);
        }
        ev.preventDefault();
    }

    clearPopUp() {
        if(this.state.isActiveDialogue || this.state.isCardClicked) {
            this.setState({isActiveDialogue: false, isCardClicked: false})
        }
    }

    render() {
        const self=this;
        return (
             <div id='id1'>
                {self.state.isCardClicked &&
                <Dialog open={self.state.isCardClicked} classes={{ root: 'classes-state-root',
            disabled: 'disabled' }}>
                <div id='id2' onClick={self.clearPopUp}>
                       <img src={crossLogo} alt={"loading"} style={{'marginLeft': '-60px','marginTop': '-80px','width':'10%'}}/>
                        <Table style={{'margin':'auto','textAlign':'center','width':'100%'}}>
                            <TableBody>
                                 <TableRow key={0}>
                                     <TableRowColumn>{this.state.selectedCardValue.quizKey}</TableRowColumn>
                                     <TableRowColumn >{this.state.selectedCardValue.quizValue.Title}</TableRowColumn>
                                    <TableRowColumn>{this.state.selectedCardValue.quizValue.QuestionIds.length}</TableRowColumn>
                                 </TableRow>
                                <TableRow key={1}>
                                    <TableRowColumn>{this.state.selectedCardValue.quizValue.TotalQuestion}</TableRowColumn>
                                    <TableRowColumn>{this.state.selectedCardValue.quizValue.Totalmarks}</TableRowColumn>
                                    <TableRowColumn>{this.state.selectedCardValue.quizValue.Passingmarks}</TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                </div>
                </Dialog>}
             <div style={{display:'flex', flexDirection:'row',overflowY:'visible'}}>
                <div style={{'alignContent':'left','textAlign':'left','autoScrollBodyContent':'true', marginLeft:'80px'}}>
                    <h1>Create Quiz!</h1>
                    <TextField type="text" hintText="Title" floatingLabelText="Quiz Title" ref="quiztitle" /> <br />
                    <TextField type="number" hintText="Total Marks" floatingLabelText="Total Marks" ref="totmarks" /> <br />
                    <TextField type="number" hintText="Passing Marks" floatingLabelText="Passing Marks" ref="passmarks" /><br />
                    <TextField type="number" hintText="Total Time" floatingLabelText="Total Time" ref="time" /><br />
                    <TextField type="number" hintText="Total Question" floatingLabelText="Total Question" ref="totalquestion" /><br />
                    <DropDownMenu value={self.state.selectedIndex===0?'number of sections':self.state.selectedIndex} style={dropdownstyle} onChange={this.handleChange} ref="dropdownSections" >
                        <MenuItem key={0} value={'number of sections'} primaryText={'number of sections'} style={{"color":"rgb(168, 164, 164)"}}/>
                        {self.state.options.map((item, key) => {
                             return (
                               <MenuItem key={key+1} value={key+1} primaryText={key+1} style={{"color":"rgb(168, 164, 164)"}}/>
                              )
                        })}
                        <Dialog open={this.state.isActiveDialogue} >
                            <div style={{'alignContent':'center','textAlign':'center','width':'40%'}} onClick={self.clearPopUp}>
                                <TextField type="number" hintText="questions" floatingLabelText="No. Of Questions" ref="questionNumber" /> <br />
                                        <RaisedButton primary={true} onClick={self.enterNumberOfQuestions} style={{'width' : '30%'}} >
                                <span style={{'color':'white'}}>Submit</span>
                                    </RaisedButton>
                            </div>
                        </Dialog>
                    </DropDownMenu> <br />

                    {this.state.selectedIndex!==0 && this.createSections()}

                    <DropDownMenu value={self.state.selectedInvitedUser===0?'user email to invite':self.state.invitedUsers[self.state.selectedInvitedUser - 1].email} style={dropdownstyle} onChange={this.handleChangeInSelectedUser} ref="dropdownInvitedUser" >
                         <MenuItem key={0} value={'user email to invite'} primaryText={'user email to invite'} style={{"color":"rgb(168, 164, 164)"}}/>
                         {self.state.invitedUsers.map((item, key) => {
                           return (
                                 <MenuItem key={key+1} value={item.email} primaryText={item.email} style={{"color":"rgb(168, 164, 164)"}}/>
                            )
                         })}
                     </DropDownMenu> <br /><br />

                     <RaisedButton style={{width:'40%'}} primary={true} onClick={this.createQuestions} >
                        <span style={{'color':'white'}}>Submit Quiz</span>
                     </RaisedButton>
                </div>
                    {self.state.quizIdArray.length!==0 &&
                        <QuizesDisplayPage key={0}
                        data={{'quizIdArray':self.state.quizIdArray}}
                        callbackFunction={(data) => self.selectRow(data)}
                        />
                    }
    </div>
        </div>
        )
    }

    selectRow(data) {
        this.setState({isCardClicked:true,selectedCardValue:data})
    }

    handleChangeInSelectedUser(event, index, value) {
        this.setState({selectedInvitedUser:index})
    }

    enterNumberOfQuestions(value) {
        const numberOfQuestions = this.refs.questionNumber.getValue();
        const indexOfObject=this.state.finalQuizIdArray.findIndex((element) => {return element.selectedSubject === this.state.selectedSubject})
        let filteredOutputValue=this.state.finalQuizIdArray;
        if(indexOfObject===-1) {
            this.setState({isActiveDialogue:false,finalQuizIdArray:[...this.state.finalQuizIdArray,{'selectedSubject':this.state.selectedSubject,'selectedValue':numberOfQuestions}]})
        }else{
            filteredOutputValue[indexOfObject]={'selectedSubject':this.state.selectedSubject,'selectedValue':numberOfQuestions}
            this.setState({isActiveDialogue:false,finalQuizIdArray:filteredOutputValue})
        }
    }

    createSections() {
        const self=this;
        let children = []
        for(let index of [...Array(this.state.selectedIndex).keys()]) {
            children.push(<DropDownMenu key={index} value={Object.keys(self.state.questionData)[self.state.selectedIndexes[index]]} style={dropdownstyle} onChange={(event,target,value)=>{self.handleChangeInSubject(event,target,value,index)}} ref="dropdownTitle" >
                {Object.keys(self.state.questionData).map((item, key) => {
                    return (
                        <MenuItem key={key} value={item} primaryText={item} style={{"color":"rgb(168, 164, 164)"}}/>
                     )
                })}</DropDownMenu>,<br />)
        }
        return children
    }

    handleChangeInSubject(event, index, value,mainIndex) {
         let selectedIndexes=this.state.selectedIndexes;
         selectedIndexes[mainIndex]=index;
         this.setState({"isActiveDialogue":true, "selectedIndexes":selectedIndexes, "selectedSubject":value})
    }
}
