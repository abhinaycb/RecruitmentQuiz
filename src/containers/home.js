import React, { Component } from 'react';
import { Link } from 'react-router';
import { RaisedButton } from 'material-ui';


class LoginSignup extends Component {


    render() {
        return (
            <div>
                    <center>
                        <div>
                            <h1>Quiz App Home</h1>
                            <Link to="/login"><RaisedButton type="submit" primary={false}>Log In</RaisedButton></Link>
                            <Link to="/signup"><RaisedButton type="submit" primary={true}>Sign Up</RaisedButton></Link>
                        </div>
                    </center>
            </div>
        )
    }
}

export default LoginSignup;