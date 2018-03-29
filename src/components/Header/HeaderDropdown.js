import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavDropdown
} from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';
import { browserHistory } from 'react-router';
import firebase from 'firebase';
class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.logout=this.logout.bind(this);
  }
  logout(event)
  {
    var  that=this;
    reactLocalStorage.set('token', '');
    reactLocalStorage.set('auth', 0);
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    console.log("logou12t");
     // that.props.history.replace('/login'); 
    
    }, function(error) {
      console.log("logout error");
      
      // An error happened.
    }); 

  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret={this.state.caretVisible}>
        <span className="d-md-down-none"></span>
        <i class="material-icons">account_circle</i>
         
        </DropdownToggle>
        <DropdownMenu right>
          {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
          <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
          <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
          <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
          <DropdownItem divider/>
          <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
          <DropdownItem onClick={this.logout } href="/#/login" ><i className="fa fa-lock"></i> Logout</DropdownItem>
        </DropdownMenu> 
      </NavDropdown>
    );
  }

  render() {
    const {...attributes} = this.props;
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;