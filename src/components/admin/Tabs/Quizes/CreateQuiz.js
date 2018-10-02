import React from 'react';
import {Dialog,Subheader,DropDownMenu,MenuItem,} from 'material-ui';
import * as firebase from 'firebase';
import QuizesDisplayPage from "../../../user/QuizesDisplayPage";
import crossLogo from '../../../../Assets/crossLogo.png';
import "../../../../css/site.css";
import InviteAndCreateQuiz from "./InviteAndCreateQuiz";
import $ from 'jquery';

const headerStyle={
    fontWeight: 'bold'
}
const dropdownstyle = {textColor:'white',width:'256px',marginLeft:'-20px',textAlign:'left'};

export default class CreateQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.toggleClickedInCreateQuiz=this.toggleClickedInCreateQuiz.bind(this);
        this.selectRow=this.selectRow.bind(this);
        this.getUserTableData=this.getUserTableData.bind(this);
        this.clearPopUp=this.clearPopUp.bind(this);
        this.handleChangeInSelectedUser=this.handleChangeInSelectedUser.bind(this);
        this.state = {
            quizIdArray:[], 
            isCardClicked: false,
            selectedCardValue: undefined,
            invitedUsers:[],
            selectedInvitedUser:0,
        };
    }

    componentDidMount() {
        const self=this;
        firebase.database().ref('QuizDetail').once('value').then((data) => {
            if(data!==undefined&&data!==null&&data.val()!==undefined&&data.val()!==null) {
                let quizIds = Object.keys(data.val())
                let newQuizIdsArray=self.state.quizIdArray.concat(quizIds);
                self.setState({quizIdArray: newQuizIdsArray});
            }
        }).catch((error)=>{
            alert(error)
        })

        firebase.database().ref('users').orderByChild('admin').equalTo(false).once('value').then((snapshot) => {
            let invitedUsers=snapshot.val();
            self.setState({
                invitedUsers:Object.values(invitedUsers),
            })
        }).catch((err)=>{
            alert(err)
        })

    }

    clearPopUp() {
        if(this.state.isActiveDialogue || this.state.isCardClicked) {
            this.setState({isCardClicked: false})
        }
    }

    render() {
        const self=this;
        return (
             <div id='id1'>
                {self.state.isCardClicked &&
                    <Dialog open={self.state.isCardClicked}>
                            <div className='table100 ver4 m-b-110'>
                                <Subheader style={{position: 'absolute'}} onClick={self.clearPopUp} >
                                    <img src={crossLogo} alt={"loading"} style={{width:'15%',top:'-20px',left:'0px',marginLeft:'-80px',marginTop:'-90px',backgroundColor:'clear'}}/>
                                </Subheader>
                                <div>
                                    {self.getUserTableData()}
                                </div>
                                {self.getUserDropDown()}
                            </div>
                    </Dialog>
                }
                <div className='parentDiv'>
                    {self.state.quizIdArray.length!==0 && <InviteAndCreateQuiz data={{quizIdArray:self.state.quizIdArray}} toggleClicked={(value)=>{self.toggleClickedInCreateQuiz(value)}}/>}
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

    getUserDropDown() {
        const self=this;
        return (
            <DropDownMenu value={self.state.selectedInvitedUser===0?'user email to invite':self.state.invitedUsers[self.state.selectedInvitedUser - 1].email} style={dropdownstyle} onChange={this.handleChangeInSelectedUser} ref="dropdownInvitedUser" >
                    <MenuItem key={0} value={'user email to invite'} primaryText={'user email to invite'} style={{"textColor":"rgb(168, 164, 164)","selectedTextColor":"rgb(168, 164, 164)"}}/>
                    {self.state.invitedUsers.map((item, key) => {
                        return (
                        <MenuItem key={key+1} value={item.email} primaryText={item.email} style={{"color":"rgb(168, 164, 164)"}}/>
                        )
                    })}
            </DropDownMenu>
        )
    }

    toggleClickedInCreateQuiz(flag){
        $('.container').toggleClass('closed');
        $('.card').toggleClass('closed');
    }


    getUserTableData() {
      return(
          <center>
            <table style={{'textAlign':'center'}}>
                <thead>
                    <tr>
                        <th style={headerStyle}>QuizKey</th>
                        <th style={headerStyle}>Title</th>
                        <th style={headerStyle}>questionIds</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.state.selectedCardValue.quizKey}</td>
                        <td>{this.state.selectedCardValue.quizValue.Title}</td>
                        <td>{this.state.selectedCardValue.quizValue.QuestionIds.length}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th style={headerStyle}>TotalQuestions</th>
                        <th style={headerStyle}>Totalmarks</th>
                        <th style={headerStyle}>Passingmarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td>{this.state.selectedCardValue.quizValue.TotalQuestion}</td>
                        <td>{this.state.selectedCardValue.quizValue.Totalmarks}</td>
                        <td>{this.state.selectedCardValue.quizValue.Passingmarks}</td>
                    </tr>
                </tbody> 
            </table></center>
        )
    }


    selectRow(data) {
        this.setState({isCardClicked:true,selectedCardValue:data})
    }

    handleChangeInSelectedUser(event, index, value) {
        this.setState({selectedInvitedUser:index})
    }
}
