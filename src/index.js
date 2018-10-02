import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeFirebase} from './NetworkCalls.js';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {grey, amber, black} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: black,
        primary2Color: black,
        secondaryTextColor: black,
        accent1Color: amber,
        pickerHeaderColor: grey,
        textColor:black,
    },
});
initializeFirebase();


ReactDOM.render(
<MuiThemeProvider muiTheme={muiTheme}>
<App />
</MuiThemeProvider>
    , document.getElementById('root')
)
