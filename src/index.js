import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

// Containers
import Full from './containers/Full/'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase'
  var config = {
    apiKey: "AIzaSyC9iZVCyeQjDXGrayT9P0hh-m9W4T2hCrs",
    authDomain: "mediapp-tst.firebaseapp.com",
    databaseURL: "https://mediapp-tst.firebaseio.com",
    projectId: "mediapp-tst",
    storageBucket: "mediapp-tst.appspot.com",
    messagingSenderId: "220563216178"
  };
  firebase.initializeApp(config);

ReactDOM.render((
  <MuiThemeProvider>

    <HashRouter>
      <Switch>
        <Route exact path="/login" name="Login Page" component={Login} />
        <Route exact path="/register" name="Register Page" component={Register} />
        <Route exact path="/404" name="Page 404" component={Page404} />
        <Route exact path="/500" name="Page 500" component={Page500} />
        <Route path="/" name="Home" component={Full} />
      </Switch>
    </HashRouter>
  </MuiThemeProvider>

), document.getElementById('root'));
