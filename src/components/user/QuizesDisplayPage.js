import React from 'react';
import { RaisedButton } from 'material-ui';
import "../../css/QuizesDisplayPage.css";
import "../../css/site.css";
import { browserHistory } from 'react-router';
import {defaultImageUrl} from '../../config.js'

const stylee2 = {
	margin: "40px 40px 130px 40px"
};

export default class QuizesDisplayPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			quizIdsArray:props.location.state.quizIdsArray,
			quizDetailsArray:props.location.state.quizDetailsArray,
		}
        this.onItemClick= this.onItemClick.bind(this);
	}

	render() {
		var self = this;
		var liTagArray=[];
        const imgUrl=defaultImageUrl;
        var count=0;
        if(this.state.quizDetailsArray!==null && this.state.quizDetailsArray!==undefined && this.state.quizDetailsArray.length!==0) {
            this.state.quizDetailsArray.forEach(function (quizNode) {
                var imageUrl=quizNode["hero-image-s3-key"];
                var quizName=quizNode["Title"];
                var quizQuestions=quizNode["TotalQuestion"];
                liTagArray.push( <RaisedButton
                style={stylee2}
                className='zoom_on_hover img-thumbnail border-0' key={self.state.quizIdsArray[count]} onClick={self.onItemClick}>
					<img src={(imageUrl===null || imageUrl==="" || imageUrl===undefined) ? imgUrl : imageUrl}
               			  alt={count}
               			  />
				<h1>{quizName}</h1>
				<h1> TotalQuestions -:{quizQuestions}</h1></RaisedButton>);
                count+=1;
            });
        }else{
            browserHistory.push('/quizes');
		}

		return (
            <div className="col-md-4">
            <div className="card-link">
            <div className="card_cover">
			</div>
			<center>
            <div className="product-card">
					{liTagArray}
			</div>
			</center>
        </div>
        </div>
		);
	}

    onItemClick(event) {
        event.preventDefault();
        browserHistory.push({
            pathname: '/AttemptQuiz',
            search: '',
            state: {quizId: this.state.quizIdsArray[event.target.alt]}
        })
    }
}