import React from 'react';
import { RaisedButton, TextField, DropDownMenu, MenuItem } from 'material-ui';
import Paper from 'material-ui/Paper';
import * as firebase from 'firebase';
import * as Constants from '../../../../HardCodedConstants.js';
import "../../../.././css/site.css";
import $ from 'jquery';

const paperStyle = {
    height: 'auto',
    width: '100%',
    margin: "10px 0px",
    left:"0px",
    align:"center",
    background:'#E6E6E6'
};
const addmorebuttonstyle = {
    margin: "0px 20px 0px 0px",
    background:"#625069",
    align:'center',
    textAlign:'center',
};
const addmorebuttonspanstyle = {background: '#01A8DA',padding:'9px 18px',color:'black'};

const dropdownItemStyle={
    textColor:'rgb(168, 164, 164)',
    selectedTextColor:'rgb(168, 164, 164)',
};

const dropdownstyle = {textColor:'#b2b2b2',width:'256px',marginLeft:'-20px',textAlign:'left'};

export default class CreateQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.onClickSubmitQuiz = this.onClickSubmitQuiz.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.handleChangeInSection=this.handleChangeInSection.bind(this);
        this.state = {
            addedQuestionArrayObject:props.data.questionsUploaded,
            detail:props.data.numberOfQuestion,
            questionSections:[],
            selectedSectionIndex:0,
            selectedSectionValue:'',
            isSubmitEnable:props.data.fileUploaded,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({addedQuestionArrayObject:nextProps.data.questionsUploaded,isSubmitEnable:nextProps.data.fileUploaded})
    }


    componentDidMount() {
        const self=this;
        firebase.database().ref('QuizQuestion').once('value',(snapshot)=>{
            if(snapshot!==undefined && snapshot.val()!==undefined){
                let questionSubjectKeys=snapshot.val();
                self.setState({questionSections:Object.keys(questionSubjectKeys)});
            }else{
                alert('data polluted');
            }
        }).catch((err)=>{
            //TODO: handle error
            alert(err);
        })

        $('.column100').on('mouseover',function(){
            var table1 = $(this).parent().parent().parent();
            var table2 = $(this).parent().parent();
            var verTable = $(table1).data('vertable')+"";
            var column = $(this).data('column') + ""; 
    
            $(table2).find("."+column).addClass('hov-column-'+ verTable);
            $(table1).find(".row100.head ."+column).addClass('hov-column-head-'+ verTable);
        });
    
        $('.column100').on('mouseout',function(){
            var table1 = $(this).parent().parent().parent();
            var table2 = $(this).parent().parent();
            var verTable = $(table1).data('vertable')+"";
            var column = $(this).data('column') + ""; 
    
            $(table2).find("."+column).removeClass('hov-column-'+ verTable);
            $(table1).find(".row100.head ."+column).removeClass('hov-column-head-'+ verTable);
        });

    }

    render() {
        const self=this;

        return (
            <Paper style={paperStyle} zDepth={3} >
                <h1 style={{'color':'white',background:'#8A83AC',margin:'auto',textAlign:'center'}}>{this.state.isSubmitEnable?'Verify Uploaded Questions':'Upload Questions!'}</h1>
            {!this.state.isSubmitEnable ?
                <center><div className="table100 ver1 m-b-110" >
                <DropDownMenu 
                    value={
                        this.state.selectedSectionIndex===0?Constants.sectionDropDownDefaultValue
                        :this.state.selectedSectionValue
                    } 
                    style={dropdownstyle}   
                    onChange={this.handleChangeInSection} 
                    ref="sectionDropDown"
                >
                    <MenuItem key={0} 
                        value={Constants.sectionDropDownDefaultValue} primaryText={Constants.sectionDropDownDefaultValue} 
                        style={dropdownItemStyle}
                    />
                    {this.state.questionSections.map((item, key) => {
                        return (
                        <MenuItem key={key+1} value={item} primaryText={item} style={dropdownItemStyle}/>
                        )
                    })}
                </DropDownMenu><br />
                <TextField type="text" hintText="Question" floatingLabelText="Question" ref="Question" /> <br />
                <TextField type="text" hintText="Option 1" floatingLabelText="Option 1" ref="op1" /> <br />
                <TextField type="text" hintText="Option 2" floatingLabelText="Option 2" ref="op2" /><br />
                <TextField type="text" hintText="Option 3" floatingLabelText="Option 3" ref="op3" /><br />
                <TextField type="text" hintText="Option 4" floatingLabelText="Option 4" ref="op4" /><br /><br />
                <TextField type="text" hintText="Answer" floatingLabelText="Answer" ref="Answer" /><br /><br />
                </div></center>
                
            :  <div className="table100 ver1 m-b-110" ><table data-vertable="ver1">
                    <thead>
                        <tr className="row100 head">
                            <th className="column100 column1">Question</th>
                            <th className="column100 column2">Option 1</th>
                            <th className="column100 column3">Option 2</th>
                            <th className="column100 column4">Option 3</th>
                            <th className="column100 column5">Option 4</th>
                            <th className="column100 column6">Answer</th>
                        </tr>
                    </thead><tbody>
                    {Object.keys(self.state.addedQuestionArrayObject).map((sectionKey)=>{
                        let quiestionValues=self.state.addedQuestionArrayObject[sectionKey];
                        return  (   
                            quiestionValues.map((question)=>
                                 (
                                    <tr className="row100">
                                        <td className="column100 column1">{question.Question}</td>
                                        <td className="column100 column2">{question.op1}</td>
                                        <td className="column100 column3">{question.op2}</td>
                                        <td className="column100 column4">{question.op3}</td>
                                        <td className="column100 column5">{question.op4}</td>
                                        <td className="column100 column6">{question.Answer}</td>
                                    </tr>
                                )
                            )
                        )
                    })}
                </tbody></table></div>
            }<br />
                <RaisedButton disabled={this.state.isSubmitEnable} 
                                primary={true}  
                                onClick={this.onClickNextQuestion} 
                                style={addmorebuttonstyle} 
                >
                    <span style={addmorebuttonspanstyle}> 
                        Add More+ 
                    </span> 
                </RaisedButton>
                <RaisedButton disabled={!this.state.isSubmitEnable} 
                                primary={true}  
                                onClick={this.onClickSubmitQuiz} 
                                style={addmorebuttonstyle} 
                >
                    <span style={addmorebuttonspanstyle}> Save Quiz </span>  
                </RaisedButton>
            </Paper>
        )
    }

    handleChangeInSection(event,index,value) {
        this.setState({selectedSectionIndex:index,selectedSectionValue:value});
    }

    onClickSubmitQuiz(ev) {
       ev.preventDefault(); 
       this.saveDataInFirebase(this.state.addedQuestionArrayObject);
    }

    saveDataInFirebase(questionArrayObject) {
        for(let sectionId of Object.keys(questionArrayObject)){
            for(let question of questionArrayObject[sectionId]){
                 firebase.database().ref('QuizQuestion').child(sectionId).push(question).then(data=>{
                     if(question===questionArrayObject[sectionId][questionArrayObject[sectionId].length-1]){
                            alert('Quiz Questions SuccessFully Uploaded');
                     }
                 }).catch(err=>{alert(err)});//TODO: handle error
            }
        }
    }

    onClickNextQuestion(ev) {
        ev.preventDefault();
        const Question = this.refs.Question.getValue();
        const op1 = this.refs.op1.getValue();
        const op2 = this.refs.op2.getValue();
        const op3 = this.refs.op3.getValue();
        const op4 = this.refs.op4.getValue();
        const Answer = this.refs.Answer.getValue();
        const sectionType=this.state.selectedSectionValue;

        const QuizQuestion = {
            Question: Question,
            op1: op1,
            op2: op2,
            op3: op3,
            op4: op4,
            Answer: Answer
        };

        if(Question === "" || op1 === "" || op2 === "" || op3 ==="" || op4 === "" || Answer === "" || this.state.selectedSectionIndex === 0){
            alert("Please Fill Required Fields");
            this.refs.Question.input.focus()
        }
        else{
            let newQuestionsArrayObject = this.state.addedQuestionArrayObject;
            if(newQuestionsArrayObject[sectionType]!==undefined) {
                newQuestionsArrayObject[sectionType].push(QuizQuestion);
            }else{
                newQuestionsArrayObject[sectionType]=[QuizQuestion];
            }

            let sumOfSectionsQuestions=0;
            Object.values(newQuestionsArrayObject).forEach(element=>{sumOfSectionsQuestions+=element.length});
            let isSubmitEnable= parseInt(this.props.data.numberOfQuestion,10) === sumOfSectionsQuestions;     
            this.setState({addedQuestionArrayObject: newQuestionsArrayObject,selectedSectionIndex:0,selectedSectionValue:'',isSubmitEnable:isSubmitEnable});
            this.refs.Question.input.value = " ";
            this.refs.op1.input.value = " ";
            this.refs.op2.input.value = " ";
            this.refs.op3.input.value = " ";
            this.refs.op4.input.value = " ";
            this.refs.Answer.input.value = " ";

        }
        ev.preventDefault();
    }
}
