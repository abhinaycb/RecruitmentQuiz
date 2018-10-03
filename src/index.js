import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeFirebase} from './NetworkCalls.js';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {black} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#0E2A47",
        primary2Color: "#8A83AC",
        secondaryTextColor: black,
        accent1Color: '#0E2A47',
        pickerHeaderColor: 'white',
        textColor:'black',
    },
});
initializeFirebase();


ReactDOM.render(
<MuiThemeProvider muiTheme={muiTheme}>
<App />
</MuiThemeProvider>
    , document.getElementById('root')
)
