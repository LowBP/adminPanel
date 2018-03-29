import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge
} from 'reactstrap';
import HeaderDropdown from './HeaderDropdown';
import { reactLocalStorage } from 'reactjs-localstorage';
import { browserHistory } from 'react-router';
import firebase from 'firebase';

class Header extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }
  logout(event) {
    console.log(event);
    // this.props.history.push('/product/brand/viewbrand');
    var  that=this;
    reactLocalStorage.set('token', '');
    reactLocalStorage.set('auth', 0);
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    console.log("logou12t");
    
   
    }, function(error) {
      console.log("logout error");
      
      // An error happened.
    }); 
  }
  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarBrand href="#"></NavbarBrand>
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          {/* <NavItem className="px-3">
            <NavLink href="#">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Users</NavLink>
          </NavItem> */}
          <NavItem className="<px></px>-3">

          </NavItem>
          {/* <NavItem className="px-3">
            <NavLink  onClick={this.logout } href="/#/login" >logout</NavLink>
          </NavItem> */}
        </Nav>
        {/* <NavLink href="/#/work/tabular_view">
            Table view</NavLink> */}
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem> */}
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <HeaderDropdown />
        </Nav>
        {/* <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler> */}
      </header>
    );
  }
}

export default Header;
