import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin'; injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeFirebase} from './NetworkCalls.js'


initializeFirebase()

ReactDOM.render(
    <MuiThemeProvider>
        <App />
    </MuiThemeProvider>
    , document.getElementById('root')
);
