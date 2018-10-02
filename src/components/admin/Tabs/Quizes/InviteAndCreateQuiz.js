import React from 'react';
import {Dialog, DropDownMenu, MenuItem, RaisedButton, TextField } from "material-ui";
import {saveQuizDataIntoServer} from "../../../../NetworkCalls";
import * as firebase from 'firebase';
import $ from 'jquery';
import '../../../.././css/site.css';
import { white,gray } from 'material-ui/styles/colors';


const dropdownstyle = {textColor:'white',width:'256px',marginLeft:'-20px',textAlign:'left'};
const submitButtonStyle={background: '#dd7234',
    background: 'linear-gradient(-68deg,white,gray)',padding:'9px 19px'};

export default class InviteAndCreateQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.createQuestions=this.createQuestions.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleChangeInSubject=this.handleChangeInSubject.bind(this);
        this.createSections=this.createSections.bind(this);
        this.clearPopUp=this.clearPopUp.bind(this);
        this.handleChangeInSelectedUser=this.handleChangeInSelectedUser.bind(this);
        this.enterNumberOfQuestions=this.enterNumberOfQuestions.bind(this);
        this.menuButtonClicked=this.menuButtonClicked.bind(this);
        this.state={
            isActiveDialogue:false,
            selectedIndex: 0,
            selectedIndexes:[],
            selectedInvitedUser:0,
            invitedUsers:[],
            selectedSubject: '',
            questionData: {},
            options: [],
            finalQuizIdArray: [],
            quizIdArray:props.data.quizIdArray,
            menuClosed:true,
        };
    }

    componentDidMount() {
        const self=this;
        $('.menu footer button').click();
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
        }).catch((err)=>{
            alert(err)
        })
      // run animation once at beginning for demo
        // setTimeout(function(){
        //     $('.menu footer button').click();
        // }, 1000);
    }

    render() {
        const self=this;
        return (
            <nav className='menu' ref='menu'>
                <header>Create Quiz<span>×</span></header><ol>
                <li className="menu-item"><a href="#0"><TextField className='materialuiTextfield' type="text" hintText="Title" floatingLabelText="Quiz Title" ref="quiztitle" ></TextField></a></li>
                <li className="menu-item"><a href="#0"><TextField className='materialuiTextfield' type="number" hintText="Total Marks" floatingLabelText="Total Marks" ref="totmarks"></TextField></a></li>
                <li className="menu-item"><a href="#0"><TextField className='materialuiTextfield' type="number" hintText="Passing Marks" floatingLabelText="Passing Marks" ref="passmarks"></TextField></a></li>
                <li className="menu-item"><a href="#0"><TextField className='materialuiTextfield' type="number" hintText="Total Time" floatingLabelText="Total Time" ref="time" ></TextField></a></li>
                <li className="menu-item"><a href="#0"><TextField className='materialuiTextfield' type="number" hintText="Total Question" floatingLabelText="Total Question" ref="totalquestion"></TextField></a></li>
                <li className="menu-item"><a href="#0">
                <DropDownMenu value={self.state.selectedInvitedUser===0?'user email to invite':self.state.invitedUsers[self.state.selectedInvitedUser - 1].email} style={dropdownstyle} onChange={this.handleChangeInSelectedUser} ref="dropdownInvitedUser" >
                    <MenuItem key={0} value={'user email to invite'} primaryText={'user email to invite'} style={{"textColor":"rgb(168, 164, 164)","selectedTextColor":"rgb(168, 164, 164)"}}/>
                    {self.state.invitedUsers.map((item, key) => {
                        return (
                        <MenuItem key={key+1} value={item.email} primaryText={item.email} style={{"color":"rgb(168, 164, 164)"}}/>
                        )
                    })}
                </DropDownMenu>
                </a></li>
                <li className="menu-item"><a href="#0">
                    <DropDownMenu value={self.state.selectedIndex===0?'number of sections':self.state.selectedIndex} style={dropdownstyle} onChange={this.handleChange} ref="dropdownSections" >
                        <MenuItem key={0} value={'number of sections'} primaryText={'number of sections'} style={{color:"#b2b2b2"}}/>
                        {self.state.options.map((item, key) => {
                            return (
                                <MenuItem key={key+1} value={key+1} primaryText={key+1} style={{color:"#b2b2b2"}}/>
                            )
                        })
                        }
                    </DropDownMenu>
                </a></li>
                {this.state.selectedIndex!==0 && this.createSections()}
                <li><a style={{background:'transparent'}}>
                    <RaisedButton style={{width:'140px'}} primary={true} onClick={this.createQuestions} >
                        <span style={submitButtonStyle}>Submit Quiz</span>
                    </RaisedButton></a></li>
            </ol><footer><button aria-label="Toggle Menu" onClick={this.menuButtonClicked}>Create Quiz</button></footer>
            <Dialog open={this.state.isActiveDialogue} >
                    <div style={{'alignContent':'center','textAlign':'center',margin:'auto','width':'40%'}}>
                        <TextField type="number" hintText="questions" floatingLabelText="No. Of Questions" ref="questionNumber" /> <br />
                        <RaisedButton primary={true} onClick={self.enterNumberOfQuestions} style={{'width':'30%'}} >
                            <span style={{'color':'white'}}>Submit</span>
                        </RaisedButton>
                    </div>
                </Dialog></nav> )
    }

    menuButtonClicked(e) {
      const self=this;  
      e.preventDefault();
      const $els = $('.menu a');
      const count = $els.length;
      const grouplength = Math.ceil(count/3);
      let groupNumber = 0;
      let i = 1;
      $('.menu').css('--count',count+'');
      $els.each(function(j){
        if ( i > grouplength ) {
            groupNumber++;
            i=1;
        }
        $(this).attr('data-group',groupNumber);
        i++;
      });
      $els.each(function(j){
          $(this).css('--top',$(this)[0].getBoundingClientRect().top + ($(this).attr('data-group') * -15) - 20);
          $(this).css('--delay-in',j*.1+'s');
          $(this).css('--delay-out',(count-j)*.1+'s');
      });
      $('.menu').toggleClass('closed');
      if(self.refs.menu.className==='menu closed'){
        setTimeout(()=>{self.props.toggleClicked()},1000);
      }else{
        self.props.toggleClicked(self.refs.menu.className==='menu closed')
      }
      
      e.stopPropagation();
    }

    handleChange(event, index, value) {
        event.preventDefault();
        let arr = Array(index).fill(0);
        this.setState({selectedIndex:index, selectedIndexes:arr});
    }

    handleChangeInSubject(event, index, value,mainIndex) {
        let selectedIndexes=this.state.selectedIndexes;
        selectedIndexes[mainIndex]=index;
        this.setState({"isActiveDialogue":true, "selectedIndexes":selectedIndexes, "selectedSubject":value})
    }

    handleChangeInSelectedUser(event, index, value) {
        this.setState({selectedInvitedUser:index})
    }


    createSections() {
        const self=this;
        let children = []
        for(let index of [...Array(this.state.selectedIndex).keys()]) {
            children.push(<li key={index} className="menu-item"><a href="#0"><DropDownMenu value={Object.keys(self.state.questionData)[self.state.selectedIndexes[index]]} style={dropdownstyle} onChange={(event,target,value)=>{self.handleChangeInSubject(event,target,value,index)}} ref="dropdownTitle" >
                {Object.keys(self.state.questionData).map((item, key) => {
                    return (
                        <MenuItem key={key} value={item} primaryText={item} style={{"color":gray}}/>
                )
              })}</DropDownMenu></a></li>)
        }
        return children
    }

    createQuestions(ev) {
        ev.preventDefault();
        const QuizTitle = this.refs.quiztitle.getValue();
        const Totalmarks = this.refs.totmarks.getValue();
        const Passingmarks = this.refs.passmarks.getValue();
        const Time = this.refs.time.getValue();
        const totalquestion = this.refs.totalquestion.getValue();
        const questionsIdsArray=this.state.finalQuizIdArray;

        if (QuizTitle === "" || Totalmarks === "" || Passingmarks === "" || Time === "" || totalquestion === "") {
            alert("Please Fill Required Fields");
        }else if(parseInt(totalquestion,10) !== Object.values(questionsIdsArray).reduce( function(sum, value){
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
                QuestionIds: questionsIdsArray,
            };
            saveQuizDataIntoServer(quizDetail,this.state.invitedUsers[this.state.selectedInvitedUser-1]);
        }
        ev.preventDefault();
    }

    clearPopUp() {
        if(this.state.isActiveDialogue) {
            this.setState({isActiveDialogue: false})
        }
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

}
