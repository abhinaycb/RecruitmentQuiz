import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeFirebase} from './NetworkCalls.js';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {grey, amber} from 'material-ui/styles/colors';
import createMuiTheme from 'material-ui/styles';


// const theme = createMuiTheme({
//     appBar: {
//         color: grey,
//         textColor: amber
//       },
//     palette: {
//       primary: {
//         // light: will be calculated from palette.primary.main,
//         main: '#ff4400',
//         // dark: will be calculated from palette.primary.main,
//         // contrastText: will be calculated to contrast with palette.primary.main
//       },
//       secondary: {
//         light: '#0066ff',
//         main: '#0044ff',
//         // dark: will be calculated from palette.secondary.main,
//         contrastText: '#ffcc00',
//       },
//       // error: will use the default color
//     },
//   });

initializeFirebase();


ReactDOM.render(
<MuiThemeProvider >
<App />
</MuiThemeProvider>
    , document.getElementById('root')
)
