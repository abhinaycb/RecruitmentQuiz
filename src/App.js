import React, { Component } from 'react';
import './App.css';
import { Router, Route, IndexRoute, browserHistory, } from 'react-router'
import Login from './components/common/login'
import Signup from './components/common/signup'
import Admin from './components/admin/Admin'
import Bar from './components/common/appbar'
import CreateQuiz from './components/admin/CreateQuiz'
import AttemptQuiz from './components/user/AttemptQuiz'
import CreateQuestion from './components/admin/CreateQuestion'
import NoQuizes from './components/user/NoQuizes'
import Result from './components/common/result'
import QuizesDisplayPage from './components/user/QuizesDisplayPage'
import RenderedTableRow from './components/admin/RenderedRow'

class App extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Bar}>
                    <IndexRoute component={Login} />
                    <Route path="signup" component={Signup} />
                    <Route path="login" component={Login}/>
                    <Route path="Admin" component={Admin}/>
                    <Route path="CreateQuiz" component={CreateQuiz}/>
                    <Route path="AttemptQuiz" component={AttemptQuiz}/>
                    <Route path="CreateQuestion" component={CreateQuestion} />
                    <Route path="NoQuizes" component={NoQuizes}/>
                    <Route path="result" component={Result}/>
                    <Route path="QuizesDisplayPage" component={QuizesDisplayPage} />
                    <Route path="RenderedTableRow" component={RenderedTableRow}/>
                 </Route>
            </Router>
        )
    }
}


export default App
