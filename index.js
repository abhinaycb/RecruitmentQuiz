import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeFirebase} from './NetworkCalls'
import {indigo500, indigo700, redA200, blue600, black, darkWhite, purple100} from 'material-ui/styles/colors';
import * as Colors from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: indigo500,
        primary2Color: purple100,
        secondaryTextColor: blue600,
        accent1Color: redA200,
        pickerHeaderColor: black,
        textColor: black,
    },
    overrides: {
        MuiButton: {
          root: {
            color: indigo700,
            '&:hover': {
              backgroundColor: darkWhite
            }
          }
        }
      }
});
initializeFirebase();

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <App />
    </MuiThemeProvider>
    , document.getElementById('root')
)
