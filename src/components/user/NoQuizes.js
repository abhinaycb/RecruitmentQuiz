import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//NO QUIZ AVAILABLE

class NoQuizes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            don: [],
            count: 0,
        }
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <center>
                        <div>
                            <h1>Quiz Not; Available For This Time!</h1>
                        </div>
                    </center>
                </MuiThemeProvider>
            </div>
        )
    }
}
export default NoQuizes;