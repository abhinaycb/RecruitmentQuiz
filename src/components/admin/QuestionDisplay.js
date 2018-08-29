import React from 'react';
import getUserDataForEmail from '../../NetworkCalls.js'
import $ from 'jquery';
import './QuestionDisplay.css';
import CreateQuestion from './CreateQuestion';
import * as firebase from 'firebase';
var fileReader;
export default class QuestionDisplay extends React.Component {
   
    constructor(props) {
        super(props);
        this.inviteUserToQuiz=this.inviteUserToQuiz.bind(this);
        this.submitButtonClicked=this.submitButtonClicked.bind(this);
        this.uploadFileClicked=this.uploadFileClicked.bind(this);
        this.handleFileRead=this.handleFileRead.bind(this);
        this.formClicked=this.formClicked.bind(this);
        this.state={isFormEnable:false,isCreateQuestionEnable:false,delimeter:'',fileUploaded:false,questionArrayData:{}};
    }

    render() {
        return (

                    <div>
                        <div className="cta" ref="cta" onClick={this.formClicked}>{this.state.isFormEnable?"Close Uploading Manually":"Create Questions Manually"} </div>
                        <form className="form hidden" ref="form">
                            <input type="number" id="email" name="email" placeholder="enter number" ref="numberOfQuestions"/>
                            <input type="button" value="Submit" onClick={this.submitButtonClicked}/>
                        </form>
                        {this.state.isCreateQuestionEnable && <CreateQuestion data={{'numberOfQuestion':parseInt((this.refs.numberOfQuestions!==undefined) ? this.refs.numberOfQuestions.value : '0',10),'fileUploaded':this.state.fileUploaded,'questionsUploaded':this.state.questionArrayData}}/>}	  
                        <div className="cta">Upload A File(txt,json,csv)<br /><br />    
                            <center><input type='file' id='file' accept='.csv,.txt,.json' 
                                onChange={e => this.uploadFileClicked(e.target.files[0])}/></center>
                        </div>
                     </div>
        )
    }

    submitButtonClicked() {
        if(this.refs.numberOfQuestions!==undefined && this.refs.numberOfQuestions.value!=="" && parseInt(this.refs.numberOfQuestions.value)>0){
            this.setState({'isCreateQuestionEnable':true,fileUploaded:false,questionArrayData:{}});
        }else{
            alert("please enter a valid number to upload the questions");
        }
        return false;
    }

    formClicked() {
        const self=this;
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
            // Create an array to hold our data. Give the array
            // a default empty first row.
            let arrData = [[]];
            // Create an array to hold our individual pattern
            // matching groups.
            let arrMatches = null;
            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec( questionsData )){
                // Get the delimiter that was found.
                let strMatchedDelimiter = arrMatches[ 1 ];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                    ){
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push( [] );
                }
                let strMatchedValue;
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[ 2 ]){
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
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
        // const name = this.refs.name.getValue();
        // const subjectType = this.refs.dropdownTitle.getValue();
        // const totalquestion = this.refs.noOfQuestions.getValue();
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
}