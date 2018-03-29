
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase';

import RestApi from '../Fetch/RestApi';
//import css 
import 'react-select/dist/react-select.css';
import ExStore from '../ExStore';
// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, Image, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import
import Snackbar from 'material-ui/Snackbar';

import '../style.css';

// lineItems
import LineItems from './LineItems';


//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table';
import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';
import Loading from 'react-loading-bar';//loading progress
import Spinner from 'react-spinkit';


// import './style.css'

// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const users_url = "users";
const address_url = "addresses";
const phone_url = "phones";
const meta_url = "/meta/lastModified";

const status_data = ['approved', 'declined', 'draft', 'expired', 'open', 'waiting-approval'];
var sortorder = false;
class QuotationsView extends Component {
  constructor(props) {
    super(props);
    if (ExStore.single_user == "")
      this.props.history.replace('/users');
    this.state = {
      users: {
        user_t_data: [],
        start_at: '',

      },
      quotations: {
        q_t_data: [],
        non_edit_quotations: [],
      },
      expanding: [-1],
      drop_val: '25',//pagination value
    };

  }



  async componentWillMount() {

    console.log(ExStore.single_user);
    var nextProps = ExStore.single_user;


    var arr = [];
    var index = 1;
    var quotations = { ...this.state.quotations };
    for (var key in nextProps.quotations) {
      var data = nextProps.quotations[key];
      data.refId = key;
      quotations.non_edit_quotations.push(data);
      quotations.q_t_data.push(this.setQuotations(data, index++, quotations));
    }
    if (await quotations.q_t_data.length != 0) {
      console.log(quotations.q_t_data);
      this.setState({ quotations });
    }
  }
  setQuotations(data, index, quotations) {

    var store_q_t = {};

    store_q_t.index = index;
    store_q_t.id = data.id;
    store_q_t.refId = data.refId;
    store_q_t.chemist_name = ExStore.single_user.name;
    if (data.discount != null)
      store_q_t.discount = (data.discount.value).toFixed(2);
    else
      store_q_t.discount = 0;

    if (data.discountMRP != null)
      store_q_t.discountMRP = (data.discountMRP.value).toFixed(2);
    else
      store_q_t.discountMRP = 0;

    if (data.subTotal != null)
      store_q_t.subTotal = (data.subTotal.value).toFixed(2);
    else
      store_q_t.subTotal = 0;
    if (data.total != null)
      store_q_t.total = (data.total.value).toFixed(2);
    if (data.totalMRP != null)
      store_q_t.totalMRP = (data.totalMRP.value).toFixed(2);
    else
      store_q_t.totalMRP = 0;
    if (data.shipmentStatus != null)
      store_q_t.shipmentStatus = data.shipmentStatus;
    if (data.status != null)
      store_q_t.status = data.status;
    if (data.promotion != null)
      store_q_t.promotion = data.promotion.id;
    else
      store_q_t.promotion = "-"

    if (data.date != null) {
      var date1 = data.date;
      var arr1 = [];
      arr1 = date1.split('-');

      store_q_t.date = arr1[2] + "-" + arr1[1] + "-" + arr1[0];
    }
    if (data.lineItems != null)
      store_q_t.lineItems = data.lineItems;

    return store_q_t;
  }



  isExpandableRow(row) {

    return true;
  }
  expandComponent(row) {

    if (this.state.expanding != -1 && row.index == this.state.expanding) {
      console.log("pranav", row);
      return (
        <LineItems data={this.state.lineItem_t_d} onCancel={() => this.setState({ expanding: [-1] })} />
      )

    }

    //   return (
    //     // <BSTable data={row.phone} />
    //     <div>
    //       <LineItems data={row.lineItems} />
    //     </div>

    //   );
  }
  expandColumnComponent({ isExpandableRow, isExpanded }) {
    let content = '';

    if (isExpandableRow) {
      content = (isExpanded ? <i class="material-icons">expand_less</i> : <i class="material-icons">expand_more</i>);
    } else {
      content = ' ';
    }
    return (
      <div className="expandicon-style"  > {content} </div>
    );
  }
  sorthandleBtnClick(event, order) {

    // var event="date";
    if (order === 'desc') {
      this.refs.table.handleSort('asc', event);
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', event);
      order = 'desc';
    }
  }


  formatType(cell) {
    return cell;
  }
  status_data(row) {

    return ['approved', 'declined', 'draft', 'expired', 'open', 'waiting-approval'];

  }

  // bootstrap table
  customActionMenu(cell, rowData) { //action bar 



    return (
      <div>
        <IconMenu
          className="wert"
          iconButtonElement={<IconButton iconClassName="material-icons"
            className="iconbutton-height" iconStyle={{ color: 'grey' }}>view_module</IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <MenuItem
            className="menu-style"
            primaryText="Change Status"
            rightIcon={<ArrowDropRight />}
            disabled={ExStore.status}


            menuItems={[
              <MenuItem
                className="menuitem-style"
                primaryText="approved" onClick={() => this.setState({ open_save_status: true, order_status: true, order_status_data: "approved", order_data: rowData })} />,
              <MenuItem
                className="menuitem-style"
                primaryText="declined" onClick={() => this.setState({ open_save_status: true, order_status: true, order_status_data: "declined", order_data: rowData })} />,
              <MenuItem
                className="menuitem-style"
                primaryText="draft" onClick={() => this.setState({ open_save_status: true, order_status: true, order_status_data: "draft", order_data: rowData })} />,

              <MenuItem
                className="menuitem-style"
                primaryText="expired" onClick={() => this.setState({ open_save_status: true, order_status: true, order_status_data: "expired", order_data: rowData })} />,
              <MenuItem
                className="menuitem-style"
                primaryText="waiting-approval" onClick={() => this.setState({ open_save_status: true, order_status: true, order_status_data: "waiting-approval", order_data: rowData })} />

            ]}

          />
          <MenuItem
            primaryText="Change Shipment Status"
            className="menu-style"
            rightIcon={<ArrowDropRight />}

            disabled={ExStore.status}


            menuItems={[
              <MenuItem
                className="menuitem-style"
                primaryText="delivered" onClick={() => this.setState({ open_save_shipping_status: true, order_status: false, order_shipping_status_data: "delivered", order_data: rowData })} />,
              <MenuItem
                className="menuitem-style"
                primaryText="shipped" onClick={() => this.setState({ open_save_shipping_status: true, order_status: false, order_shipping_status_data: "shipped", order_data: rowData })} />,
              <MenuItem
                className="menuitem-style"
                primaryText="not-shipped" onClick={() => this.setState({ open_save_shipping_status: true, order_status: false, order_shipping_status_data: "not-shipped", order_data: rowData })} />,


            ]}

          />

        </IconMenu>
        {this.state.expanding == rowData.index ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={() => this.setState({ expanding: [-1] })} >expand_less</i> : <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.viewLineitems.bind(this, rowData)} >expand_more</i>}

      </div>



    )

  }//------------------------------------------end

  async viewLineitems(rowData) {

    var data = rowData.lineItems;
    var l_item_arr = [];
    data.map((data, index) => {
      console.log(data);
      var temp = {};
      temp.id = index + 1;
      if (data.item != null)//item name
        temp.item_name = data.item.name;
      if (data.item.price != null)//price of the item
        temp.item_price = (data.item.price.value).toFixed(2);
      if (data.promotion != null)//promotion name will get added
        temp.promotion_name = data.promotion.name;
      else
        temp.promotion_name = "Null";

      if (data.quantity != null)//quantity
        temp.quantity = data.quantity;
      if (data.rate != null)//quantity 
        temp.rate_value = data.rate.value;
      if (data.total != null)//total value get added
        if (data.total.value != "0")
          temp.total_value = (data.total.value).toFixed(2);
        else
          temp.total_value = 0;

      else
        temp.total_value = 0;
      if (data.discount != null)
        temp.discount = parseFloat(data.discount).toFixed(2);
      else
        temp.discount = 0;
      l_item_arr.push(temp);
    });
    rowData.lineItem_t_d = await l_item_arr;
    this.setState({ lineItem_t_d: l_item_arr });

    this.setState({ expanding: [rowData.index] });
  }

  //sorting 
  //-----------------------------------sorting function 
  sorthandleBtnClick(event, order) {
    this.setState({ expanding: [-1] });

    sortorder = true;
    this.setState({ sortorder: true });
    // var event="date";

    if (order === 'desc') {
      //console.log("sort", event);
      this.refs.table.handleSort('desc', event);

    } else {
      this.refs.table.handleSort('asc', event);


    }
  }
  //------------------------------------end

  // save actions and active inactive functions----------------------------------------------start

  async  openDialogActiveInactive() {
    await RestApi.setToken();

    var satatus = "";
    if (this.state.rowData.status == "active") {
      this.state.rowData.status = "inactive";

    }
    else
      this.state.rowData.status = "active"
    var temp_data = {};
    temp_data.status = this.state.rowData.status;
    console.log(this.state.rowData)
    // console.log(this.state.rowData)
    fetch(RestApi.isFetch(users_url + "/" + this.state.rowData.main_key + "/users/" + this.state.rowData.users_refId), RestApi.getPatchMethod(temp_data)).then(response => {//products fetch
      if (response.ok) {
        response.json().then(json => {
          // console.log(json)
        });
      }
      else
        RestApi.isTokenExpried();

    }).catch(function (error) { console.log(error); });//end



    this.setState({ show_activeinactive: false });//close the dialog box

  }


  //table pagination and other property
  renderSizePerPageDropDown(props) {
    return (
      <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control input-sm' size='1' onChange={(event) => this.setState({ drop_val: event.target.value })}>

        <option value='10'  >10 per page</option>
        <option value='25' selected="selected" >25 per page</option>
        <option value='50'>50 per page</option>
        <option value='100'>100 per page</option>
        <option value='200'>200 per page</option>
      </select>
    );
  }
  //pagination 
  renderShowsTotal(start, to, total) {


    return (
      <div style={{ color: 'black', float: 'left', }}>
        {start}  -  {to}  of &nbsp;
            </div>
    );
  }
  //table 

  tablenputField(cellValue, rowData, nothing, cellFeild) {

    return (
      <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
    );

  }

  saveStatus_dialog(row) {
    if (this.state.order_status) {
      this.state.order_data.status = this.state.order_status_data;
      this.setState({ open_save_status: false });
    }
    else {
      this.state.order_data.shipmentStatus = this.state.order_shipping_status_data;
      this.setState({ open_save_shipping_status: false });
    }
    var temp = {};

    temp.status = this.state.order_data.status;
    temp.shipmentStatus = this.state.order_data.shipmentStatus;
    fetch(RestApi.isFetch(users_url + "/" + ExStore.single_user.main_key + "/quotations/" + this.state.order_data.refId), RestApi.getPatchMethod(temp)).then(response => {//products fetch
      if (response.ok) {
        response.json().then(json => {
          this.setState({ open_save_shipping_status: false });
        });
      }
      else
        RestApi.isTokenExpried();

    }).catch(function (error) { console.log(error); });//end

    var time = {
      time: Math.round(new Date().getTime())
    };
    fetch(RestApi.isFetch(users_url + "/" + ExStore.single_user.main_key + "/quotations/" + this.state.order_data.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
      if (response.ok) {
        response.json().then(json => {
          this.setState({ open_save_shipping_status: false });
        });
      }
      else
        RestApi.isTokenExpried();

    }).catch(function (error) { console.log(error); });//end
  }

  render() {
    const options = {

      expandBy: 'column',  // Currently, available value is row and column, default is row,

      expanding: this.state.expanding,

      sizePerPageDropDown: this.renderSizePerPageDropDown.bind(this),
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      alwaysShowAllBtns: true, // Always show next and previous button
      sizePerPage: this.state.drop_val,
      // toolBar: this.createCustomToolBar,
      paginationShowsTotal: this.renderShowsTotal.bind(this),
      // toolBar: this.createCustomToolBar,

      withFirstAndLast: false,
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({ open_save_shipping_status: false })}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onClick={this.saveStatus_dialog.bind(this)}

      />,
    ];

    const actions1 = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({ open_save_status: false })}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onClick={this.saveStatus_dialog.bind(this)}

      />,
    ];
    return (
      <div>
        <div className="was-validated">
          {this.state.quotations.q_t_data.length == 0 ?
            //  <div class="spinner"></div>
            <div class="sk-folding-cube">
              <div class="sk-cube1 sk-cube"></div>
              <div class="sk-cube2 sk-cube"></div>
              <div class="sk-cube4 sk-cube"></div>
              <div class="sk-cube3 sk-cube"></div>
            </div>
            : null}
          {this.state.quotations.q_t_data.length != 0 ?
            <Row className="user-div" >
              <div style={{ 'overflow-x': 'scroll' }} >
                <Col xs="12" md="12">
                  <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                    <CardBody className="">

                      <BootstrapTable data={this.state.quotations.q_t_data} className="user-table"
                        expandableRow={this.isExpandableRow.bind(this)}
                        expandComponent={this.expandComponent.bind(this)}
                        options={options}
                        pagination
                        width="100"
                        ref="table"
                        version="4" condensed ref='table'
                        tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-13.5px', 'margin-right': '-16px', ' margin-top': '-1.99%', cursor: 'pointer' }}

                      //  tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-2.0%', 'margin-right': '-2.0%', ' margin-top': '-1.99%', cursor: 'pointer' }} 
                      >

                        <TableHeaderColumn expandable={false} tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='index' editable={false} expandable={false} className="pos" rowSpan='2' width='81' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                          <div class="float-action-fixed-left">
                            <div class=" icon-style">

                              <i class="material-icons" onClick={() => this.props.history.replace('/users')}>keyboard_backspace</i>
                            </div>
                          </div>

                        </TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' width='150' editable={false} height='10' dataSort dataField='q_id' >Order No
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "id", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "id", "desc")} />
                          </IconMenu>
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' dataSort editable={false}>Date
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "date", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "date", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "date")}>sort</i>*/}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center'>Chemist Name  <IconMenu
                          className="pull-right"

                          iconStyle={{ padding: '0px !important' }}
                          iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        >
                          <MenuItem primaryText="ASC" // save menu 
                            className="menuitem-style"
                            onClick={this.sorthandleBtnClick.bind(this, "chemist_name", "asc")} />

                          <MenuItem primaryText="DESC" // save menu 
                            className="menuitem-style"
                            onClick={this.sorthandleBtnClick.bind(this, "chemist_name", "desc")} />
                        </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "stockistname")}>sort</i> */}
                        </TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center'>Status
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "status", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "status", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "status")}>sort</i>*/}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='180' row='0' dataAlign='center'>Shipment Status
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "shipmentStatus", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "shipmentStatus", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "shipmentStatus")}>sort</i> */}
                        </TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='180' row='0' dataAlign='center' editable={false}>Coupon Discount
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "discount", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "discount", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "discount")}>sort</i>*/}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' editable={false}>Discount MRP
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "discountMRP", "asc")} />

                            <MenuItem primaryText="DESC" // save menu
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "discountMRP", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "discountMRP")}>sort</i> */}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' editable={false} >Sub Total
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "subTotal", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "subTotal", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "subTotal")}>sort</i> */}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' editable={false} >Net Total
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "total", "asc")} />

                            <MenuItem primaryText="DESC" // save menu
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "total", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "total")}>sort</i> */}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' editable={false}>Net Total MRP
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "totalMRP", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "totalMRP", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "totalMRP")}>sort</i> */}
                        </TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='0' dataAlign='center' editable={false}>Promotion Name
                    <IconMenu
                            className="pull-right"

                            iconStyle={{ padding: '0px !important' }}
                            iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <MenuItem primaryText="ASC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "promotion", "asc")} />

                            <MenuItem primaryText="DESC" // save menu 
                              className="menuitem-style"
                              onClick={this.sorthandleBtnClick.bind(this, "promotion", "desc")} />
                          </IconMenu>
                          {/* <i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }} onClick={this.sorthandleBtnClick.bind(this, "promotion")}>sort</i> */}
                        </TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='id' dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='date' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='chemist_name' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' dataFormat={this.formatType} expandable={true} editable={{ type: 'select', options: { values: status_data } }} filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='status' dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='180' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} expandable={true} dataField='shipmentStatus' dataFormat={this.tablenputField.bind(this)} ></TableHeaderColumn>

                        <TableHeaderColumn expandable={false} width='180' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='discount' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='discountMRP' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='subTotal' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='total' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='150' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='totalMRP' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn expandable={false} width='200' row='1' dataAlign='center' filter={{ type: 'TextFilter', placeholder: 'Search' }} dataField='promotion' editable={false} dataFormat={this.tablenputField.bind(this)}></TableHeaderColumn>

                      </BootstrapTable>




                    </CardBody>

                  </Card>
                </Col>
              </div>
            </Row> : null}
          <Dialog actions={actions} modal={false} open={this.state.open_save_shipping_status} contentStyle={{
            width: '25%',
            maxWidth: 'none'
          }} onRequestClose={() => this.setState({ open_save_shipping_status: false })}>
            Do you want to Change Shipment Status "{this.state.order_data != null ? this.state.order_data.shipmentStatus : null}" to "{this.state.order_shipping_status_data}"?
             </Dialog>

          <Dialog actions={actions1} modal={false} open={this.state.open_save_status} contentStyle={{
            width: '25%',
            maxWidth: 'none'
          }} onRequestClose={() => this.setState({ open_save_status: false })}>
            Do you want to Change Order Status "{this.state.order_data != null ? this.state.order_data.status : null}" to "{this.state.order_status_data}"?

             </Dialog>

        </div>
      </div>
    );
  }
}


export default QuotationsView;