import React from 'react';
import {
    Dialog,
    TableBody,
    Table,
    TableRow,
    TableRowColumn,
     Subheader
} from 'material-ui';
import * as firebase from 'firebase';
import QuizesDisplayPage from "../user/QuizesDisplayPage";
import crossLogo from '../../Assets/crossLogo.png';
import "../../css/site.css";
import InviteAndCreateQuiz from "./InviteAndCreateQuiz";
import $ from 'jquery';

export default class CreateQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.toggleClickedInCreateQuiz=this.toggleClickedInCreateQuiz.bind(this);
        this.selectRow=this.selectRow.bind(this);
        this.getUserTableData=this.getUserTableData.bind(this);
        this.clearPopUp=this.clearPopUp.bind(this);
        this.state = {
            quizIdArray:[], 
            isCardClicked: false,
            selectedCardValue: undefined,
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
                        <div>
                            <div>
                                <Subheader style={{position: 'absolute'}} onClick={self.clearPopUp} >
                                    <img src={crossLogo} alt={"loading"} style={{width:'15%',top:'-20px',left:'0px',marginLeft:'-80px',marginTop:'-90px',backgroundColor:'clear'}}/>
                                </Subheader>
                            </div>
                                {self.getUserTableData()}
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

    toggleClickedInCreateQuiz(flag){
        $('.container').toggleClass('closed');
        $('.card').toggleClass('closed');
    }


    getUserTableData() {
      return(
        <div className='table100 ver4 m-b-110'>
            <table data-vertable="ver4">
                <thead>
                    <tr className="row100 head">
                        <th className="column100 column1">QuizKey</th>
                        <th className="column100 column4">Title</th>
                        <th className="column100 column8">questionIds</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="row100">
                        <td className="column100 column1">{this.state.selectedCardValue.quizKey}</td>
                        <td className="column100 column4">{this.state.selectedCardValue.quizValue.Title}</td>
                        <td className="column100 column8">{this.state.selectedCardValue.quizValue.QuestionIds.length}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr className="row100">
                        <th className="column100 column1">TotalQuestions</th>
                        <th className="column100 column4">Totalmarks</th>
                        <th className="column100 column8">Passingmarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="row100">
                        <td className="column100 column1">{this.state.selectedCardValue.quizValue.TotalQuestion}</td>
                        <td className="column100 column4">{this.state.selectedCardValue.quizValue.Totalmarks}</td>
                        <td className="column100 column8">{this.state.selectedCardValue.quizValue.Passingmarks}</td>
                    </tr>
                </tbody> 
            </table>
            <textfield placeHolderText='enterUserToInvite'/>
        </div>)
    }


    selectRow(data) {
        this.setState({isCardClicked:true,selectedCardValue:data})
    }
}
