
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase';

import RestApi from './Fetch/RestApi';
//import css 
import 'react-select/dist/react-select.css';
import ExStore from './ExStore';
// normal import 
import './style.css';

import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, Image, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import
import Snackbar from 'material-ui/Snackbar';


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


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const users_url = "users";
const address_url = "addresses";
const phone_url = "phones";
const meta_url = "/meta/lastModified";

class ViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {
                user_t_data: [],
                start_at: '',

            },
            drop_val: '',//pagination value
        };

    }

    async  componentWillMount() {
        await RestApi.setToken();
        this.setState({ drop_val: ExStore.drop_val });
        if (ExStore.users.length == 0) {
            await fetch(RestApi.UserCountByFetch(users_url, 25), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {

                        this.setUsersDataToTable(json);

                    });
                }
                else
                    this.props.history.replace('/login');

            }).catch(function (error) { console.log(error); });//end

        }
        else {
            var users = { ...this.state.users };
            this.setState({ last_refId: ExStore.last_refId });
            users.user_t_data = ExStore.users;
            this.setState({ users });



        }
    }

    async setUsersDataToTable(json) {
        var users = { ...this.state.users };
        var id = 0, store_arr = [];
        for (var key in json) {
            var data = json[key];
            data.refId = key;

            var users_d_format = {
                id: id++,
                main_key: key,
                type: await this.checkStockistOrChemist(data.groups),
                quotations: data.quotations,


            };
            await this.setUsers(data.users, users_d_format);
            store_arr.push(users_d_format);

        }
        if (await store_arr.length != 0) {
            this.setState({ last_refId: store_arr[store_arr.length - 1].main_key });
            ExStore.last_refId = store_arr[store_arr.length - 1].main_key;
            store_arr.pop();
            users.user_t_data = await store_arr;
            ExStore.users = await store_arr;

            this.setState({ users });
        }
    }
    checkStockistOrChemist(gropus) {
        var temp_arr = [];
        for (var key in gropus) {
            temp_arr.push(gropus[key]);

        }
        if (temp_arr.length == 1 && temp_arr[0].alias == "stockist")
            return "stockist";
        else
            return "chemist";
    }

    setUsers(users, users_d_format) {
        for (var key in users) {
            var data = users[key];
            users_d_format.users_refid = key;
            users_d_format.default_user = data;
            users_d_format.address = data.contact.address[0].streetAddress;
            users_d_format.zip = data.contact.address[0].zip;
            users_d_format.email = data.contact.email;
            users_d_format.office_phone = data.contact.phone[0].id;
            users_d_format.personal_phone = data.contact.phone[1] != null ? data.contact.phone[1].id : "";
            users_d_format.name = data.fullName;
            users_d_format.status = data.status;

        }
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
                    <MenuItem primaryText="Save"
                        className="menu-style"
                        leftIcon={<IconButton

                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important' }} >
                            save
                    </IconButton>}
                        // onClick={this.newProductSave.bind(this)}
                        onClick={this.validateUser.bind(this, rowData)}
                    />


                    {rowData.status == "active" ?
                        <MenuItem primaryText="Deactivate"
                            className="menu-style"
                            leftIcon={<Checkbox
                                checkedIcon={<Visibility />}
                                uncheckedIcon={<VisibilityOff />}
                                defaultChecked


                            />} onClick={() => this.setState({ show_activeinactive: true, rowData: rowData, row_status: "Deactivate", username: rowData.name })} /> : <MenuItem primaryText="Activate"
                                className="menu-style"
                                leftIcon={<Checkbox
                                    checkedIcon={<Visibility />}
                                    uncheckedIcon={<VisibilityOff />}
                                />} onClick={() => this.setState({ show_activeinactive: true, rowData: rowData, row_status: "Activate", username: rowData.name })} />



                        /* onCheck={this.create_name_editor.bind(this,row)} */




                    }

                </IconMenu>
                {this.state.expanding == rowData.id ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.viewQuotations.bind(this)} >expand_less</i> : <i class="material-icons" style={{ 'margin-top': '8px', 'color': 'grey' }} onClick={this.viewQuotations.bind(this, rowData)} >more</i>}

            </div>



        )

    }//------------------------------------------end
    viewQuotations(rowData) {
        if (rowData.quotations != null) {
            ExStore.single_user = rowData;
            ExStore.username = rowData.name;
            ExStore.status = rowData.status == 'active' ? false : true;
            this.props.history.push('/users/user/purchaseorders');
        }
        else {
            this.setState({ open: true });
        }
    }
    // validation
    validateUser(rowData) {
        this.setState({ save_data: rowData });
        console.log(rowData);
        if (rowData.name.trim() != "" && rowData.office_phone != "" && this.NumberValidity(rowData.office_phone) && rowData.office_phone.length == 10 && rowData.personal_phone != "" && this.NumberValidity(rowData.personal_phone) && rowData.personal_phone.length == 10 && rowData.address != "" && this.NumberValidity(rowData.zip) && rowData.zip != "" && rowData.zip.length == 6) {
            this.setState({ open_save_dialog: true });
        }
        else {
            this.setState({ open_error: true, open_save_dialog: false, open_user_upload: false });


        }
    }
    NumberValidity(value) {
        const re = /^[0-9]*$/;
        if (value == '' || re.test(value))
            return true;
        else
            return false;
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

    async openDialogActiveInactive() {
        await RestApi.setToken();

        var satatus = "";
        if (this.state.rowData.status == "active") {
            this.state.rowData.status = "inactive";

        }
        else
            this.state.rowData.status = "active"
        var temp_data = {};
        temp_data.status = this.state.rowData.status;
        // console.log(this.state.rowData)
        fetch(RestApi.isFetch(users_url + "/" + this.state.rowData.main_key + "/users/" + this.state.rowData.users_refid), RestApi.getPatchMethod(temp_data)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json)
                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end
        var time = {
            time: Math.round(new Date().getTime())
        };
        fetch(RestApi.isFetch(users_url + "/" + this.state.rowData.main_key + "/users/" + this.state.rowData.users_refid + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end


        this.setState({ show_activeinactive: false });//close the dialog box

    }

    async saveUserDetails() {
        await RestApi.setToken();

        var rowData = this.state.save_data;
        var user_patch = rowData.default_user;

        user_patch.fullName = rowData.name;
        user_patch.name = rowData.name;

        user_patch.contact.address[0].streetAddress = this.commaSplit(rowData.address);
        user_patch.contact.address[0].zip = rowData.zip;

        user_patch.contact.phone[0].id = rowData.office_phone;
        user_patch.contact.phone[1].id = rowData.personal_phone;
        user_patch.meta.created.time = Math.round(new Date().getTime());
        user_patch.meta.lastModified.time = Math.round(new Date().getTime());
        //   refId
        var address_refId = user_patch.contact.address[0].id;
        var office_p_refId = user_patch.contact.phone[0].refId;
        var personal_p_refId = user_patch.contact.phone[1].refId;

        await fetch(RestApi.isFetch(users_url + "/" + rowData.main_key + "/users/" + rowData.users_refid), RestApi.getPatchMethod(user_patch)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.UpdateAddress(address_refId, rowData);
                    this.UpdatePhoneNumber(office_p_refId, rowData);
                    this.UpdatePhoneNumber(personal_p_refId, rowData);
                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end
        var time = {
            time: Math.round(new Date().getTime())
        };
        await fetch(RestApi.isFetch(users_url + "/" + rowData.main_key + "/users/" + rowData.users_refid + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.setState({ open_save_dialog: false, open_user_upload: false });

                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end

    }
    commaSplit(address) {
        var add = [];
        // alert(address)
        address.toString().split(',').map((data) => {
            add.push(data);
            //  console.log(data);
        });

        return add;
    }
    async UpdateAddress(refId, rowData) {
        await RestApi.setToken();

        var address_patch = {
            streetAddress: this.commaSplit(rowData.address),
            zip: rowData.zip,
            meta: this.setMeta()

        }
        fetch(RestApi.isFetch(address_url + "/" + refId), RestApi.getPatchMethod(address_patch)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end

    }

    setMeta() {
        var meta = {
            meta: {
                "created": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                },
                "entity": "address",
                "id": "",
                "lastModified": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                }
            }
        }
        return meta.meta;
    }
    async UpdatePhoneNumber(refId, rowData) {
        await RestApi.setToken();
        var phone_patch = {
            id: rowData.office_phone,
            meta: this.setPhoneMeta(),
        };
        fetch(RestApi.isFetch(phone_url + "/" + refId), RestApi.getPatchMethod(phone_patch)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end


    }
    setPhoneMeta() {
        var meta = {
            meta: {
                "created": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                },
                "entity": "phone",
                "id": "",
                "lastModified": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                }
            }
        }
        return meta.meta;
    }

    //table input 

    //user Id
    tableRefIdInputField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );

    }

    tableNameInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        else
            return <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }
    tableTypeInputField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );

    }
    tableEmailInputField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );

    }
    tableOfficeInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly pattern="^[0-9]*$" required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        else
            return <input defaultValue={cellValue} pattern="^\d{10}$" required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }
    tablePersonalInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly pattern="^[0-9]*$" required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        else
            return <input defaultValue={cellValue} pattern="^\d{10}$" required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }
    tableAddressInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        else
            return <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }
    tableZipInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required pattern="^[0-9]*$" className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        else
            return <input defaultValue={cellValue} required pattern="^\d{6}$" className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }

    //table pagination and other property
    renderSizePerPageDropDown(props) {

        return (
            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control input-sm' size='1' onChange={(event) => (this.setState({ drop_val: event.target.value }), ExStore.drop_val = event.target.value)}>

                {this.state.drop_val == 10 ? <option value='10' selected="selected"  >10 per page</option> : <option value='10'  >10 per page</option>}
                {this.state.drop_val == 25 ? <option value='25' selected="selected"  >25 per page</option> : <option value='25'  >25 per page</option>}
                {this.state.drop_val == 50 ? <option value='50' selected="selected"  >50 per page</option> : <option value='50'  >50 per page</option>}
                {this.state.drop_val == 100 ? <option value='100' selected="selected"  >100 per page</option> : <option value='100'  >100 per page</option>}
                {this.state.drop_val == 200 ? <option value='200' selected="selected"  >200 per page</option> : <option value='200'  >200 per page</option>}
            </select>
        );
    }
    //pagination 
    renderShowsTotal(start, to, total) {

        if (to == total) {
            this.startFetchUsers();
        }
        return (
            <div style={{ color: 'black', float: 'left', }}>
                {start}  -  {to}  of &nbsp;
            </div>
        );
    }
    async  startFetchUsers() {
        await RestApi.setToken();

        var users = { ...this.state.users };
        if (users.user_t_data[users.user_t_data.length - 1].main_key != this.state.last_refId)
            await fetch(RestApi.UserCountPaginationByFetch(users_url, this.state.last_refId, 50), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {

                        this.setUsersDataPaginationClick(json);

                    });
                }
                else
                    this.props.history.replace('/login');

            }).catch(function (error) { console.log(error); });//end

    }
    async  setUsersDataPaginationClick(json) {
        var users = { ...this.state.users };
        var id = users.user_t_data.length;
        var loop_ex = 0;
        for (var key in json) {
            loop_ex++;
            var data = json[key];
            data.refId = key;

            var users_d_format = {
                id: id++,
                main_key: key,
                type: await this.checkStockistOrChemist(data.groups),
                quotations: data.quotations,


            };
            await this.setUsers(data.users, users_d_format);
            users.user_t_data.push(users_d_format);

        }
        if (await users.user_t_data.length != 0) {

            this.setState({ last_refId: users.user_t_data[users.user_t_data.length - 1].main_key });
            ExStore.last_refId = users.user_t_data[users.user_t_data.length - 1].main_key;
            if (loop_ex == 50)
                users.user_t_data.pop();

            if (loop_ex < 50)
                this.setState({ dont_exc: true });

            ExStore.users = users.user_t_data;

            this.setState({ users });
        }

    }

    onPageChange(page, sizePerPage) {
        console.log("pageexstore", ExStore.currentPage);
        ExStore.currentPage = page;
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
            page: ExStore.currentPage,
            withFirstAndLast: false,
            onPageChange: this.onPageChange.bind(this),
        };

        const active_inactive = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ show_activeinactive: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openDialogActiveInactive.bind(this)}

            />,
        ];
        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_user_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_user_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_user_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_user_upload: true }), this.saveUserDetails())}

            />,
        ];
        return (
            <div>
                <div className="was-validated">
                    {this.state.users.user_t_data.length == 0 ?
                        //  <div class="spinner"></div>
                        <div class="sk-folding-cube">
                            <div class="sk-cube1 sk-cube"></div>
                            <div class="sk-cube2 sk-cube"></div>
                            <div class="sk-cube4 sk-cube"></div>
                            <div class="sk-cube3 sk-cube"></div>
                        </div>
                        : null}
                    {this.state.users.user_t_data.length != 0 ?
                        <Row className="user-div" >
                            <div style={{ 'overflow-x': 'scroll' }} >
                                <Col xs="12" md="12">
                                    <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                        <CardBody className="">

                                            <BootstrapTable data={this.state.users.user_t_data} className="user-table"
                                                options={options}
                                                pagination
                                                width="100"
                                                ref="table"
                                                version="4" condensed ref='table'
                                                tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-13.5px', 'margin-right': '-16px', ' margin-top': '-1.99%', cursor: 'pointer' }}

                                            //  tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-2.0%', 'margin-right': '-2.0%', ' margin-top': '-1.99%', cursor: 'pointer' }} 
                                            >

                                                <TableHeaderColumn tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='id' editable={false} expandable={false} className="pos" rowSpan='2' width='80' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                                                    <div class="float-action-fixed-left">
                                                    </div>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='users_refid' expandable={false} row="0" dataAlign="center" width="130"  > User ID
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "users_refid", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "users_refid", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='name' dataAlign="center" width="220" row="0" >Name
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "name", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "name", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>


                                                <TableHeaderColumn dataField='type' expandable={false} row="0" dataAlign="center" width="320"  >Type
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "type", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "type", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='email' expandable={false} row="0" dataAlign="center" width="150"  >E-Mail
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "email", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "email", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='office_phone' expandable={false} row="0" dataAlign="center" width="150"  >Office Phone
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "office_phone", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "office_phone", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='personal_phone' expandable={false} dataAlign="center" width="280" row="0" >Personal Phone
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "personal_phone", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "personal_phone", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='address' expandable={false} dataAlign="center" width="420" row="0"  >Address
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "address", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "address", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='zip' expandable={false} dataAlign="center" width="420" row="0"  >Pin Code
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "zip", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "zip", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>


                                                <TableHeaderColumn dataAlign="center" width="200" dataField='main_key' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Id' }} dataFormat={this.tableRefIdInputField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='name' expandable={false} dataAlign="center" width="250" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a Name' }} dataFormat={this.tableNameInputField.bind(this)}></TableHeaderColumn>

                                                <TableHeaderColumn dataField='type' width="100" expandable={false} dataAlign="center" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a type' }} dataFormat={this.tableTypeInputField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='email' dataAlign="center" width="320" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a E-mail' }} dataFormat={this.tableEmailInputField}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='office_phone' dataAlign="center" width="150" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Office phone' }} dataFormat={this.tableOfficeInputField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='personal_phone' dataAlign="center" width="150" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a personal phone' }} dataFormat={this.tablePersonalInputField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='address' expandable={false} dataAlign="center" columnClassName="" width="440" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a Address' }} dataFormat={this.tableAddressInputField.bind(this)} > </TableHeaderColumn>

                                                <TableHeaderColumn dataField='zip' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="180" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a pin' }} dataFormat={this.tableZipInputField.bind(this)} > </TableHeaderColumn>

                                                {/* <TableHeaderColumn dataField='manufacture_name' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="420" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a manufacture' }} dataFormat={this.tableInputManufactureField.bind(this)} > </TableHeaderColumn> */}

                                            </BootstrapTable>




                                        </CardBody>

                                    </Card>
                                </Col>
                            </div>
                        </Row> : null}
                    <Dialog actions={active_inactive} modal={false} open={this.state.show_activeinactive} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ show_activeinactive: false })}>
                        Do you want to {this.state.row_status} the user '{this.state.username}'
                </Dialog>


                    <Dialog actions={save_action} modal={false} open={this.state.open_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_save_dialog: false })}>

                        {this.state.open_user_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}



                    </Dialog>
                    <Snackbar
                        open={this.state.open}
                        message="Quotations not found"
                        style={{ color: 'white', 'background-color': 'red !important' }}
                        bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                        style={{ top: 0, height: 0 }}

                        autoHideDuration={6000}
                        onRequestClose={() => this.setState({ open: false })}
                    />
                    <Snackbar
                        open={this.state.open_error}
                        message="please fill required fields"
                        style={{ color: 'white', 'background-color': 'red !important' }}
                        bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                        style={{ top: 0, height: 0 }}

                        autoHideDuration={6000}
                        onRequestClose={() => this.setState({ open_error: false })}
                    />
                </div>
            </div>
        );
    }
}


export default ViewUsers;