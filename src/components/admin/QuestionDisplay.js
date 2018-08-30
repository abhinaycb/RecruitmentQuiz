import React from 'react';
import getUserDataForEmail from '../../NetworkCalls.js'
import $ from 'jquery';
import './QuestionDisplay.css';
import CreateQuestion from './CreateQuestion';
import * as firebase from 'firebase';
import addQuestionIcon from '../../Assets/addQuestionIcon.svg';
var fileReader;

const emailTextBoxStyle={background: '#dd7234',
background: '-webkit-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
background: '-o-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
background: '-moz-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
background: 'linear-gradient(-68deg,rgb(154, 80, 80),#EAC688)'};

const searchBarBoxStyle={
    background: '#dd7234',
    background: '-webkit-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
    background: '-o-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
    background: '-moz-linear-gradient(-68deg, rgb(154, 80, 80),#EAC688)',
    background: 'linear-gradient(-68deg,rgb(154, 80, 80),#EAC688)',
    margin: '20px',
    width: '30%',
    height: '40px'
}

export default class QuestionDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.inviteUserToQuiz=this.inviteUserToQuiz.bind(this);
        this.submitButtonClicked=this.submitButtonClicked.bind(this);
        this.uploadFileClicked=this.uploadFileClicked.bind(this);
        this.handleFileRead=this.handleFileRead.bind(this);
        this.formClicked=this.formClicked.bind(this);
        this.state={isFormEnable:false,isCreateQuestionEnable:false,delimeter:'',fileUploaded:false,questionArrayData:{},filterText: "",sectionNames:[],questions:[]};
    }

    componentDidMount() {
        const self=this;
        firebase.database().ref('QuizQuestion').once('value',(snapshot)=>{
            let sections = snapshot.val();
            for (var sectionName in sections) {
                if (sections.hasOwnProperty(sectionName)) {
                    self.setState({sectionNames:[...self.state.sectionNames,sectionName]});
                    for(var question in sections[sectionName]){
                        let questionToPush=sections[sectionName][question]
                        questionToPush['id']=question;
                        self.setState({questions:[...self.state.questions,questionToPush]});
                    }
                }
            }
        }).catch((err)=>{
            alert(err)
        })
    }

    submitButtonClicked() {
        if(this.refs.numberOfQuestions!==undefined && this.refs.numberOfQuestions.value!=="" && parseInt(this.refs.numberOfQuestions.value,10)>0){
            this.setState({'isCreateQuestionEnable':true,fileUploaded:false,questionArrayData:{}});
        }else{
            alert("please enter a valid number to upload the questions");
        }
        return false;
    }

    formClicked() {
        if(!this.state.isCreateQuestionEnable){
            if (!this.state.isFormEnable) {
                $(".form").slideDown(230);
                $(".cta").css('cursor', 'default');
                $(".form").toggleClass("hidden");
            }else{
                $(".form").slideUp(230);
                $(".cta").css('cursor', 'pointer');
                $(".form").toggleClass('hidden');
            }
            this.setState({isFormEnable:!this.state.isFormEnable,isCreateQuestionEnable:false});
        }else{
            $(".form").slideUp(230);
            $(".cta").css('cursor', 'pointer');
            $(".form").toggleClass('hidden');
            this.setState({isFormEnable:false,isCreateQuestionEnable:false});
        }
    }

    uploadFileClicked(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        if(extension==='csv') {
            this.setState({delimeter:','});
        }else{
            this.setState({delimeter:''});
        }
        fileReader = new FileReader();
        fileReader.onloadend = this.handleFileRead;
        fileReader.readAsText(file);
    }

    handleFileRead(e) {
        let questionsData=fileReader.result;
        let strDelimiter = this.state.delimeter;
        let jsonData;
        if(strDelimiter===''){
            jsonData=JSON.parse(questionsData);
            this.setState({fileUploaded:true,questionArrayData:jsonData,isFormEnable:false,isCreateQuestionEnable:true});
        }else{
            // Create a regular expression to parse the CSV values.
            let objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
                );
            // a default empty first row.
            let arrData = [[]];
            // matching groups.
            let arrMatches = null;
            while (arrMatches = objPattern.exec( questionsData )){
                let strMatchedDelimiter = arrMatches[ 1 ];
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                    ){
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push( [] );
                }
                let strMatchedValue;
                if (arrMatches[ 2 ]){
                    // We found a quoted value. When we capture
                    strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp( "\"\"", "g" ),
                        "\""
                        );
                } else {// We found a non-quoted value.
                    strMatchedValue = arrMatches[ 3 ];
                }
                // add it to the data array.
                if(strMatchedValue!==""){
                    arrData[ arrData.length - 1 ].push( strMatchedValue );
                }
            }
            this.parseSvgFilteredDataToSaveInFirebase(arrData);
        }
    }

    parseSvgFilteredDataToSaveInFirebase(arrData){
        let keysArray=[];
        let sectionQuestionArray=[];
        let quesArray={};
        let questionObject={};
        let currentSection='';
        for(let questionRow of arrData) {
            if(questionRow.length!==0){
                if(!(questionRow.includes('Question')&&questionRow.includes('Answer'))){
                    if(questionRow.length<keysArray.length){
                        alert('some field in question data is empty');
                        return;
                    }else if(questionRow.length>keysArray.length) {
                        if(sectionQuestionArray.length!==0&&currentSection!==''){
                            quesArray[currentSection]=sectionQuestionArray;
                            sectionQuestionArray=[];
                        }
                        currentSection=questionRow[0];
                        let index=0;
                        for(;index<keysArray.length;){
                            questionObject[keysArray[index]]=questionRow[index+1];
                            index++;
                        }
                        sectionQuestionArray.push(questionObject)
                        questionObject={};
                    }else{
                        let index=0;
                        for(;index<keysArray.length;){
                            questionObject[keysArray[index]]=questionRow[index];
                            index++;
                        }
                        sectionQuestionArray.push(questionObject)
                    }
                }else{
                    keysArray=questionRow;
                }
            }
        }
        if(sectionQuestionArray.length!==0){
            quesArray[currentSection]=sectionQuestionArray;
        }
        this.setState({fileUploaded:true,questionArrayData:quesArray,isFormEnable:false,isCreateQuestionEnable:true});
    }

    saveDataInFirebase(questionArrayObject) {
        for(let sectionId of Object.keys(questionArrayObject)){
            for(let question of questionArrayObject[sectionId]){
                 firebase.database().ref('QuizQuestion').child(sectionId).push(question).catch(err=>{alert(err)});
            }
        }
    }

    inviteUserToQuiz() {
        const email = this.refs.email.getValue();
        getUserDataForEmail(email).then((snapshot) => {
            let value = snapshot.val();
            if(value === null || value === undefined) {
                alert('Please SignUpUser To Add Quizes')
            }else {
                //create quiz 2 nodes containing title / name / questions node
                //then add new quiz id into the user node to enable particular quiz for specific user
            }
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
    }
    ////question table events
    handleUserInput(filterText) {
        this.setState({filterText: filterText});
    };
    
    handleRowDel(question) {
        var index = this.state.questions.indexOf(question);
        this.state.questions.splice(index, 1);
        this.setState(this.state.questions);
    };

    handleAddEvent(evt) {
        var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var question = {
            id: id,
            Question: "",
            op1: "",
            op2: "",
            op3: "",
            op4:"",
            Answer:""
        }
        this.state.questions.splice(0,0,question);
        this.setState(this.state.questions);
    }

    handleQuestionTable(evt) {
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
            };
        var questions = this.state.questions.slice();
        var newQuestions = questions.map(function(question) {
            for (var key in question) {
                if (key === item.name && question.id === item.id) {
                    question[key] = item.value;
                }
            }
            return question;
        });
        this.setState({quesions:newQuestions});
        //  console.log(this.state.products);
    };

    render() {
        return (
            <div>
                <div className="cta" ref="cta" onClick={this.formClicked}>{this.state.isFormEnable?"Close Uploading Manually":"Create Questions Manually"} </div>
                <form className="form hidden" ref="form">
                    <input style={emailTextBoxStyle} type="number" id="email" name="email" placeholder="enter number" ref="numberOfQuestions"/>
                    <input type="button" value="Submit" onClick={this.submitButtonClicked}/>
                </form>
                {this.state.isCreateQuestionEnable && 
                    <CreateQuestion data={{'numberOfQuestion':parseInt((this.refs.numberOfQuestions!==undefined) 
                        ? this.refs.numberOfQuestions.value : '0',10),
                        'fileUploaded':this.state.fileUploaded,
                        'questionsUploaded':this.state.questionArrayData}}
                    />
                }	  
                <div style={{width:'75%',margin:'auto',padding:'10px'}}><center>
                     <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
                    <div className="table100 ver2 m-b-110">
                     <QuestionTable onQuestionTableUpdate={this.handleQuestionTable.bind(this)} 
                        onRowAdd={this.handleAddEvent.bind(this)} 
                        onRowDel={this.handleRowDel.bind(this)} 
                        sections={this.state.sections}
                        questions={this.state.questions}
                        filterText={this.state.filterText}
                     /></div></center>
                </div>
                <div className="cta">Upload A File(txt,json,csv)<br /><br />    
                    <center><input type='file' id='file' accept='.csv,.txt,.json' 
                        onChange={e => this.uploadFileClicked(e.target.files[0])}/></center>
                </div>
            </div>
        )
    }


}

class SearchBar extends React.Component {
    handleChange() {
      this.props.onUserInput(this.refs.filterTextInput.value);
    }
    render() {
      return (
        <div>
          <input style={searchBarBoxStyle} type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" 
          onChange={this.handleChange.bind(this)}/>
        </div>
      );
    }
}
  
class QuestionTable extends React.Component {
  
    render() {
      var onQuestionTableUpdate = this.props.onQuestionTableUpdate;
      var rowDel = this.props.onRowDel;
      var filterText = this.props.filterText;
      var questions = this.props.questions.map((question) => { 
            if (question.Question.indexOf(filterText) === -1) {
                return;
            }
            return (<QuestionRow onQuestionTableUpdate={onQuestionTableUpdate} 
                question={question} onDelEvent={rowDel.bind(this)} key={question.id}/>)
      });
      return (
        <div>
        <img src={addQuestionIcon} style={{width:'5%'}} onClick={this.props.onRowAdd} />
        <table data-vertable="ver1">
            <thead>
              <tr className="row100 head">
                <th className="column100 column1">QuestionId</th>
                <th className="column100 column2">QuestionName</th>
                <th className="column100 column3">Option1</th>
                <th className="column100 column4">Option2</th>
                <th className="column100 column5">Option3</th>
                <th className="column100 column6">Option4</th>
                <th className="column100 column7">Answer</th>
              </tr>
            </thead>
  
            <tbody>
              {questions}
            </tbody>
          </table>
        </div>
      );
    }
  }
  
class QuestionRow extends React.Component {
    onDelEvent() {
      this.props.onDelEvent(this.props.question);
    }
    render() {
  
      return (
        <tr className="row100 head">
          <EditableCell className="column100 column1" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            "type": "id",
            value: this.props.question.id,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column1" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "name",
            value: this.props.question.Question,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column2" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "option1",
            value: this.props.question.op1,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column3" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "option2",
            value: this.props.question.op2,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column4" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "option3",
            value: this.props.question.op3,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column5" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "option4",
            value: this.props.question.op4,
            id: this.props.question.id
          }}/>
          <EditableCell className="column100 column6" onQuestionTableUpdate={this.props.onQuestionTableUpdate} cellData={{
            type: "answer",
            value: this.props.question.Answer,
            id: this.props.question.id
          }}/>
          <td className="column100 column7">
            <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
          </td>
        </tr>
      );
  
    }
  
  }
class EditableCell extends React.Component {
  
    render() {
      return (
        <td>
          <input type='text' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onQuestionTableUpdate}/>
        </td>
      );
  
    }
  
  }
