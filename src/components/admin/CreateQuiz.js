import React from 'react';
// import { browserHistory } from 'react-router';
import {DropDownMenu, MenuItem, RaisedButton, TextField, Dialog} from 'material-ui';
import * as firebase from 'firebase';
import {saveQuizDataIntoServer} from "../../NetworkCalls";
import RenderedRow from "./RenderedRow";
import QuizesDisplayPage from "../user/QuizesDisplayPage";


const dropdownstyle = {titleColor:"rgb(168, 164, 164)",width:"100%",marginLeft:'-20px'};

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
        this.state = {
            selectedIndex: 0,
            selectedIndexes:[],
            options:[],
            questionData:{},
            isActiveDialogue: false,
            selectedSubject: '',
            finalQuizIdArray: [],
            invitedUsers:[],
            selectedInvitedUser:0,
            quizIdArray:[],
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
        const invitedUser=this.state.invitedUser;

        if (QuizTitle === "" || Totalmarks === "" || Passingmarks === "" || Time === "" || totalquestion === "") {
            alert("Please Fill Required Fields");
        }else if(parseInt(totalquestion) !== Object.values(quizIds).reduce( function( sum, value){
                return sum + parseFloat(value.selectedValue);
            }, 0 ) ) {
            alert('Total sum of questions is not equal to the sum of individual sections');
        }else {
            const QuizDetail = {
                Title: QuizTitle,
                Totalmarks: Totalmarks,
                Passingmarks: Passingmarks,
                Totaltime: Time,
                TotalQuestion: totalquestion,
                QuestionIds: quizIds,
            };
            saveQuizDataIntoServer(QuizDetail,this.state.invitedUsers[this.state.selectedInvitedUser]);
        }
        ev.preventDefault();
    }

    render() {
        const self=this;
        return (
            <Dialog open={this.state.isActiveDialogue} style={{align:'center',textAlign:'center','width':'40%'}}/>,
            <div style={{display:'flex', 'flexDirection':'row'}}>
            <div style={{'alignContent':'left','textAlign':'left','autoScrollBodyContent':'true', marginLeft:'20px',width:'30%'}}>
                <h1>Create Quiz!</h1>
                <TextField type="text" hintText="Title" floatingLabelText="Quiz Title" ref="quiztitle" /> <br />
                <TextField type="number" hintText="Total Marks" floatingLabelText="Total Marks" ref="totmarks" /> <br />
                <TextField type="number" hintText="Passing Marks" floatingLabelText="Passing Marks" ref="passmarks" /><br />
                <TextField type="number" hintText="Total Time" floatingLabelText="Total Time" ref="time" /><br />
                <TextField type="number" hintText="Total Question" floatingLabelText="Total Question" ref="totalquestion" /><br />
                 <DropDownMenu value={self.state.selectedIndex===0?'enter number of sections':self.state.selectedIndex} style={dropdownstyle} onChange={this.handleChange} ref="dropdownSections" >
                    <MenuItem key={0} value={'enter number of sections'} primaryText={'enter number of sections'} style={{"color":"rgb(168, 164, 164)"}}/>
                        {self.state.options.map((item, key) => {
                             return (
                               <MenuItem key={key+1} value={key+1} primaryText={key+1} style={{"color":"rgb(168, 164, 164)"}}/>
                              )
                        })}
                    </DropDownMenu> <br />
            {this.state.selectedIndex!==0 && this.createSections()}
                <DropDownMenu value={self.state.selectedInvitedUser===0?'select user to invite':(self.state.invitedUsers)[self.state.selectedInvitedUser].email} style={dropdownstyle} onChange={this.handleChangeInSelectedUser} ref="dropdownInvitedUser" >
                 <MenuItem key={0} value={'select user to invite'} primaryText={'select user to invite'} style={{"color":"rgb(168, 164, 164)"}}/>
                        {self.state.invitedUsers.map((item, key) => {
                           return (
                                 <MenuItem key={key+1} value={key+1} primaryText={item.email} style={{"color":"rgb(168, 164, 164)"}}/>
                            )
                        })}
                 </DropDownMenu> <br />
        <RaisedButton style={{width:'40%'}} primary={true} onClick={this.createQuestions} >
                    <span style={{'color':'white'}}>Submit Quiz</span></RaisedButton>

                <Dialog open={this.state.isActiveDialogue} style={{'alignContent':'center','textAlign':'center','width':'40%'}}>
                    <TextField type="number" hintText="questions" floatingLabelText="No. Of Questions" ref="questionNumber" /> <br />
                    <RaisedButton primary={true} onClick={self.enterNumberOfQuestions} style={{width : '20%'}} ><span style={{'color':'white'}}>Submit</span></RaisedButton>
                </Dialog>
            </div>
            <div>
                {self.state.quizIdArray.length!==0 && <QuizesDisplayPage
                key={0}
                data={{'quizIdArray':self.state.quizIdArray}}
                callbackFunction={() => self.selectRow(0)}
                />}
            </div>
            </div>

        )
    }

    selectRow(index) {

    }

    handleChangeInSelectedUser(event, index, value) {
        this.setState({selectedInvitedUser:index})
    }

    enterNumberOfQuestions(value) {
        const numberOfQuestions = this.refs.questionNumber.getValue();
        const indexOfObject=this.state.finalQuizIdArray.findIndex((element) => {return element.selectedSubject === this.state.selectedSubject})
        let filteredOutputValue=this.state.finalQuizIdArray;
        let filteredValue=this.state.finalQuizIdArray.filter((element) => {return element.selectedSubject===this.state.selectedSubject}).first
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