import React, { Component } from 'react';
import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import Loading from 'react-loading-bar';
import 'react-loading-bar/dist/index.css';

import firebase from 'firebase';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loged: 'false',
      show: false,
      tk: '',
      username: 'newauth@gmail.com',
      userpassword: '123456',
    };
    this.authUser = this.authUser.bind(this);
    this.userName = this.userName.bind(this);
    this.userPassword = this.userPassword.bind(this);

    if (reactLocalStorage.get('auth') == 0)
      this.props.history.replace('/login');


  }
  componentWillReceiveProps(nextProps) {
    // Firebase.firebaseInit();

  }
  componentWillMount() {


  }
  componentDidMount() {
    // if (reactLocalStorage.get('auth') == 1)
    // this.props.history.push('/products/product/productview');
  }

  userName(event) {
    this.setState({ username: event.target.value });
  }
  userPassword(event) {
    this.setState({ userpassword: event.target.value });
  }
  authUser(event) {
    var that = this;

    console.log(this.state.username);

    firebase.auth().onAuthStateChanged(function (user) {
      that.setState({ show: true });

      if (user) {
        that.state.show = true;
        that.state.loged = true;

        console.log("signed");
        if (that.state.loged == true) {
          that.state.username = '';
          that.state.userpassword = '';
          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            // Send token to your backend via HTTPS
            // ...
            console.log(idToken);
            idToken = idToken;
            reactLocalStorage.set('token', idToken);
            reactLocalStorage.set('', idToken);
            reactLocalStorage.set('auth', 1);
            that.setState({ show: false });
            console.log(reactLocalStorage.get('token'));
            console.log(reactLocalStorage.get('auth'));
            //  that.props.history.push('/products/product/productview');
            reactLocalStorage.set('activeSideBar', "/products");
            reactLocalStorage.set('startTime', Math.round(new Date().getTime()));





            that.props.history.replace('/products');


          }).catch(function (error) {
            // Handle error
            console.log("error", error);
          });
        }

      }
      else {
        console.log("not signed")
        that.state.loged = false;

        firebase.auth().signInWithEmailAndPassword(that.state.username, that.state.userpassword)
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            that.setState({ show: false });
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              console.log('Wrong password.');
            } else {
              console.log(errorMessage);
            }
            console.log(error);
          });

      }
    });

  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Loading
          show={this.state.show}
          color="#187da0"
        />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup className="mb-0">
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input type="text" placeholder="newauth@gmail.com" onChange={this.userName} defaultValue={this.state.username} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input type="password" placeholder="123456" onChange={this.userPassword} defaultValue={this.state.userpassword} />
                    </InputGroup>
                    <Row>

                      <Col xs="6">
                        <Button color="primary" className="px-4" onClick={this.authUser}>Login</Button>

                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
