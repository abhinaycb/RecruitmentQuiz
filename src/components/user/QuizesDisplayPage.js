import React from 'react';
import { browserHistory } from 'react-router';
import {defaultImageUrl} from '../../config.js';
import * as firebase from 'firebase';
import logo from '../../Assets/newLoader.gif';
import '../../css/site.css';

const newloaderStyle = {
    width: "40%",
    margin: '200px auto'
};

const headingStyle= {
    fontFamily: "Comic Sans MS",
    fontSize: 12,
}

export default class QuizesDisplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.getQuizDataForQuizId=this.getQuizDataForQuizId.bind(this);
        this.onCardClick=this.onCardClick.bind(this);
        this.getQuizDataForAdmin=this.getQuizDataForAdmin.bind(this);
        this.updateLayout=this.updateLayout.bind(this);
        this.state={isLoading: true, quizCardArray: [], loadedFromAdmin:false};
    }

    componentDidMount() {
        const self= this;
        let quizIdsArray=[];
        if(this.props.location !== null && this.props.location !== undefined && this.props.location.state !== null && this.props.location.state !== undefined ) {
            quizIdsArray=this.props.location.state.quizIdsArray;
        }
        //admin quizes or user quizzes desision block
        if (quizIdsArray === null || quizIdsArray === undefined || quizIdsArray.length === 0) {
            quizIdsArray=this.props.data.quizIdArray;
            if(quizIdsArray === null || quizIdsArray === undefined || quizIdsArray.length === 0) {
                //loaded from user
                this.setState({loadedFromAdmin:true},browserHistory.push('/NoQuizes'))
            }else{
                //loaded from admin
                this.setState({loadedFromAdmin:true},this.getQuizDataForAdmin())
            }
        } else {
            this.addChildHandleRef = firebase.database().ref('users').child(localStorage.getItem('userId')).child('quizIds')
            this.addChildHandleRef.on('child_added', ((snapshot) => {
                self.getQuizDataForQuizId(snapshot.key).then((quizData) => {
                    const quizNodeValue = quizData.val();
                    if (quizNodeValue!==undefined && quizNodeValue !== null) {
                            self.setState({
                                    isLoading: false,
                                    quizCardArray: [...self.state.quizCardArray, {
                                        'quizKey': quizData.key,
                                        'quizValue': quizNodeValue,
                                        'quizActive': true,
                                        }
                                    ]
                                },
                                (() => {
                                        if (self.props.location.state.quizIdsArray.length <= self.state.quizCardArray.length) {
                                            if (self.props.location.state.quizIdsArray.length < self.state.quizCardArray.length) {
                                                self.props.location.state.quizIdsArray = [...self.props.location.state.quizIdsArray, snapshot.key]
                                            }
                                        }
                                })
                            )
                    } else {
                             self.setState({isLoading: false},()=>{alert('quizData not available')})
                    }
                }).catch((err)=>{
                    //TODO: handle error
                    self.setState({isLoading: false},alert(err))
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
                let index=self.state.quizCardArray.findIndex(x => x.quizKey===snapshot.key);
                if (index===-1) {
                    //TODO: handle error
                } else {
                    self.setState({
                        isLoading: false,
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
        }
    }

    updateLayout(flag){
        this.refs.container.classList.toggle('closed');
    }

    getQuizDataForAdmin() {
        const self=this;
        let quizObjects=[];
        this.addChildHandleRef = firebase.database().ref('QuizDetail')
        if(this.addChildHandleRef!==undefined&&this.addChildHandleRef!==null) {
            this.addChildHandleRef.on('child_added', ((snapshot) => {
                const quizNodeValue = snapshot.val();
                if (quizNodeValue!==undefined && quizNodeValue !== null) {
                    quizObjects=[...quizObjects, {
                        'quizKey': snapshot.key,
                        'quizValue': quizNodeValue,
                        'quizActive': true,
                    }];
                    self.setState({
                        quizCardArray: quizObjects,
                        isLoading: false
                    }, (() => {
                        if (self.props.data.quizIdArray.length <= self.state.quizCardArray.length) {
                            if (self.props.data.quizIdArray.length < self.state.quizCardArray.length) {
                                self.props.data.quizIdArray = [...self.props.data.quizIdArray, snapshot.key]
                            }
                        }
                    }))
                }
            }))
        }else{
            self.setState({isLoading: false});
        }

        this.deleteChildHandleRef = firebase.database().ref('QuizDetail')
        this.deleteChildHandleRef.on('child_removed', ((snapshot) => {
            self.setState({isLoading: true})
            let quizCardsArray=[...self.state.quizCardArray]; // make a separate copy of the array
            self.props.data.quizIdArray = self.props.data.quizIdArray.filter(x => x !== snapshot.key)
            self.setState({
                isLoading: false,
                quizCardArray: quizCardsArray.filter((x) => x.quizKey !== snapshot.key)
            });
        }))
    }

    getQuizDataForQuizId(key)
    {
        return firebase.database().ref('QuizDetail').child(key).once('value')
    }

    render()
    {
        let filteredArray=this.state.quizCardArray.filter(cardValue => cardValue.quizActive === true);
        return (

            <div className="container" ref='container'> {!this.state.isLoading && filteredArray.length !== 0 ?
                    filteredArray.map((item, index) => (
                        <div className="card zoom_on_hover" key={index}>
                        <div className="card-link">
                            <div className="card-cover"/>
                            <div className="product-card">
                                <img src={((item.quizValue['hero-image-s3-key'] === null || item.quizValue['hero-image-s3-key'] === '' ||
                                    item.quizValue['hero-image-s3-key'] === undefined) ? defaultImageUrl : item.quizValue['hero-image-s3-key'])}
                                    alt={index}
                                    onClick={() => this.onCardClick(item)}
                                />
                            </div>
                            <div style={{'textAlign':'center', 'align':'center', 'overflowWrap': 'break-word', 'color':'black',margin:'20px 20px'}}>
                                <h1 style={headingStyle}> {item.quizValue['Title']}</h1>
                            </div>
                        </div>
                        </div>
                    ))
                    : <div style={newloaderStyle}>
                         <img src={logo} alt={"loading"}/>
                      </div >
                }
            </div>
        )
    }

    onCardClick(item)
    {
        if(this.state.loadedFromAdmin) {
            this.props.callbackFunction(item)
        }else {
            browserHistory.push({
                pathname: '/AttemptQuiz',
                search: '',
                state: {quizId: item.quizKey}
            });
        }
    }

    componentWillUnMount()
    {
        if(this.addChildHandleRef!==undefined) {
            this.addChildHandleRef.off();
            this.addChildHandleRef=undefined;
        }
        if(this.deleteChildHandleRef!==undefined) {
            this.deleteChildHandleRef.off();
            this.deleteChildHandleRef=undefined;
        }
        if(this.changeChildHandleRef!==undefined) {
            this.changeChildHandleRef.off();
            this.changeChildHandleRef=undefined;
        }
    }
}