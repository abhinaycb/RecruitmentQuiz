import React from 'react';
import "../../css/QuizesDisplayPage.css";
import { browserHistory } from 'react-router';
import {defaultImageUrl} from '../../config.js';
import * as firebase from 'firebase';
import logo from '../../Assets/newloader.gif';

const newloaderStyle = {
    width: "40%",
    margin: '200px auto'
};

export default class QuizesDisplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.getQuizDataForQuizId=this.getQuizDataForQuizId.bind(this);
        this.onItemClick=this.onItemClick.bind(this);
        this.state={isLoading: true, quizCardArray: []};
    }

    componentWillMount() {
        const quizIdsArray=this.props.location.state.quizIdsArray;
        if (quizIdsArray === null || quizIdsArray === undefined || quizIdsArray.length === 0) {
            browserHistory.push('/NoQuizes');
        } else {
           // // for(const quizIdKey of quizIdsArray) {
            //     this.getQuizDataForQuizId(quizIdKey)
            // }
        }
    }

    componentDidMount() {
        const self= this;
        this.addChildHandleRef = firebase.database().ref('users').child(localStorage.getItem('userId')).child('quizIds').on('child_added', ((snapshot) => {
            self.setState({isLoading: true});
            const quizIdAttemptedFlagValue=snapshot.val();
            self.getQuizDataForQuizId(snapshot.key).then((quizData) => {
                const quizNodeValue = quizData.val();
                if (quizNodeValue!==undefined && quizNodeValue !== null) {
                    self.setState({
                        quizCardArray: [...self.state.quizCardArray, {
                            'quizKey': quizData.key,
                            'quizValue': quizNodeValue,
                            'quizActive': quizIdAttemptedFlagValue
                        }]
                    }, (() => {
                        if (self.props.location.state.quizIdsArray.length <= self.state.quizCardArray.length) {
                            if (self.props.location.state.quizIdsArray.length < self.state.quizCardArray.length) {
                                self.props.location.state.quizIdsArray = [...self.props.location.state.quizIdsArray, {
                                    'quizKey': quizData.key,
                                    'quizValue': quizNodeValue,
                                    'quizActive': quizIdAttemptedFlagValue
                                }]
                            }
                            self.setState({isLoading: false})
                        }
                    }))
                }
            })
        }))


        this.deleteChildHandleRef = firebase.database().ref('users').child(localStorage.getItem('userId')).child('quizIds').on('child_removed', ((snapshot) => {
            self.setState({isLoading: true})
            let quizCardsArray=[...self.state.quizCardArray]; // make a separate copy of the array
            self.props.location.state.quizIdsArray = self.props.location.state.quizIdsArray.filter(x => x !== snapshot.key)
            self.setState({
                isLoading: false,
                quizCardArray: quizCardsArray.filter((x) => x.quizKey !== snapshot.key)
            });
        }))


        this.changeChildHandleRef = firebase.database().ref('users').child(localStorage.getItem('userId')).child('quizIds').on('child_changed',((snapshot) => {
            // let quizCardsArray = [...self.state.quizCardArray]; // make a separate copy of the array
            let index=self.state.quizCardArray.findIndex(x => x.quizKey===snapshot.key);
            if (index===-1) {
                // handle error
            } else {
                self.setState({
                    quizCardArray: [
                        ...self.state.quizCardArray.slice(0, index),
                        Object.assign({}, self.state.quizCardArray[index], {
                            'quizKey': snapshot.key,
                            'quizActive': snapshot.val(),
                        }),
                        ...self.state.quizCardArray.slice(index + 1)
                    ]
                });
            }
        }))

        // this.addChildHandle();
        // this.changeChildHandle();
        // this.deleteChildHandle();
    }

    getQuizDataForQuizId(key)
    {
        return firebase.database().ref('QuizDetail').child(key).once('value')
    }

    render()
    {
        let filteredArray=this.state.quizCardArray.filter(cardValue => cardValue.quizActive === true);
        return (
            < div
                className="container" > {!this.state.isLoading && filteredArray.length !== 0 ?
                    filteredArray.map((item, index) => (
                        < div className="card zoom_on_hover"
                            key={index} >
                        < div
                            className="card-link" >
                        < div
                            className="card-cover" / >
                        < div
                            className="product-card" >
                        < img
                            src={((item.quizValue['hero-image-s3-key'] === null || item.quizValue['hero-image-s3-key'] === '' ||
                            item.quizValue['hero-image-s3-key'] === undefined) ? defaultImageUrl : item.quizValue['hero-image-s3-key'])
                             }
                            alt={index}
                            onClick={this.onItemClick}
                        />
                        < /div>
                        < div
                            style={{'textAlign':'center', 'align':'center', 'overflow-wrap': 'break-word', 'color':'white'}}>
                            <h1 > {item.quizValue['Title']}</h1><h1>{item.quizValue['TotalQuestion']}</h1 >
                        < /div>
                        < /div>
                        < /div>
                    ))
                    : <div style={newloaderStyle} >
                      < img src={logo} alt={"loading"}/>
                      </div >
                }
            </div>
        )
    }

    onItemClick(event)
    {
        event.preventDefault();
        browserHistory.push({
            pathname: '/AttemptQuiz',
            search: '',
            state: {quizId: this.state.quizCardArray[event.target.alt].quizKey}
        });
    }

    // addChildHandle()
    // {
    //     const self=this;
    //
    // }
    //
    // deleteChildHandle()
    // {
    //     const self=this;
    //
    // }
    //
    // changeChildHandle()
    // {
    //     const self=this;
    //
    // }

    componentWillUnMount()
    {
        this.addChildHandleRef.off();
        this.deleteChildHandleRef.off();
        this.changeChildHandleRef.off();
    }


}