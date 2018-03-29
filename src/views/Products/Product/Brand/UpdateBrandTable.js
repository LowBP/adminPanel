import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
// import Loading from 'react-loading-bar' progress bar on top of the page
// import 'react-loading-bar/dist/index.css' //load the css file of loading page
// import SpicyDatatable from 'spicy-datatable'; //not using 
// import 'spicy-datatable/src/spicy-datatable/table.css'; //not using
// import 'spicy-datatable/src/spicy-datatable/components/Pagination.css';//not using
// import 'spicy-datatable/src/spicy-datatable/components/DatatableOptions.css';// not using
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key
// material package import -------------------------------------start
import { withStyles } from 'material-ui/styles';//common styles
import Button1 from 'material-ui/RaisedButton';//rasised buttons
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button
import { NotificationContainer, NotificationManager } from 'react-notifications';//notification manager
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import Snackbar from 'material-ui/Snackbar';
// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

import Checkbox from 'material-ui/Checkbox';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// end------------------------------------------------------------end

import firebase from 'firebase'; //firebase sdk
import '../style.css';// user styles will fetched from here
import 'react-select/dist/react-select.css'
import Select from 'react-select';



class UpdateBrandTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: [],//assign the brand to table data
        }
        this.tableInputBrandField = this.tableInputBrandField.bind(this);//tableinputbrandField
        this.tableInputBrandField1 = this.tableInputBrandField1.bind(this);//table input select brand
        this.tableInputBrandField2 = this.tableInputBrandField2.bind(this);//table input select brand
        this.tableInputBrandField3 = this.tableInputBrandField3.bind(this);//table input select brand
        // selcet box onchange
        this.changeparentBrand = this.changeparentBrand.bind(this);//chagebrand 
        this.changeOrg = this.changeOrg.bind(this);//change org name
        this.tableInputAction = this.tableInputAction.bind(this);
        this.openSaveData = this.openSaveData.bind(this);//save data form dialog action yes


    }


    tableInputBrandField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} className='filter text-filter form-control  ' onChange={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputBrandField1(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                onChange={this.changeparentBrand.bind(this, rowData)}
                options={this.props.data.brand_drop}
                value={rowData.parent}
            />
        );
    }
    tableInputBrandField2(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                onChange={this.changeOrg.bind(this, rowData)}
                options={this.props.data.org_drop}
                value={rowData.organizationname}
            />
        );
    }
    tableInputBrandField3(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} className='filter text-filter form-control  ' onChange={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputAction(cellValue, rowData, nothing, cellFeild)//action button
    {
        return (
            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
        );

    }
    // select box functions will done here
    changeparentBrand(rowData, event) {

        rowData.parent = event.value;
        var parent = {};//parent object
        parent.name = event.name;//name
        parent.refId = event.refId;//refId
        parent.slug = event.slug;//slug
        this.props.data.brands.parent = parent;//updating the parenent to brands table
        console.log(rowData, event);
    }
    //org change
    changeOrg(rowData, event) {
        var org = {};
        org.contact = event.contact;
        org.name = event.value;
        this.props.data.organization = org;
        rowData.organizationname = event.value;//assign new org
    }
    openSaveData(event) {
        // console.log("brnad",this.props.data.brand[0].name);
        console.log(this.props.data.brands);
        var brands = this.props.data.brands;
        var tags = this.props.data.brand.tags;
        var tagarr = [];
        if (tags != null)
            tags.split(',').map(data => {
                tagarr.push(data);
            });
        brands.tags = tagarr;//tags added
        brands.name = this.props.data.brand[0].name;
        brands.slug = this.props.data.brand[0].name;
        brands.id = this.props.data.brand[0].name;
        brands.meta.lastModified.time = Math.round(new Date().getTime());
        // alert(Math.round(new Date().getTime()))
        //console.log("save brand",brands);
        console.log("brands",brands);
        fetch('https://mediapp-tst.firebaseio.com/brands/' + brands.refId + '.json?auth=' + reactLocalStorage.get('token') + '', {
            // mode: 'no-cors',
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(brands)
        },
        ).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    
                    //   exp="brand";


                });
            }
            else {
                that.props.history.replace('/login');
            }
        });
        console.log("qwe", this.props.data.brand);
        this.setState({ save_open: false });
        var modified_brand={};
        modified_brand.refId=brands.refId;
        modified_brand._id=brands.refId;
        modified_brand.name=brands.name;
        modified_brand.id=brands.name;
        modified_brand.tags=brands.tags;
    
          
        this.props.onChangeValue(modified_brand);


    }
    render() {
        const actions = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.state.save_open = false}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openSaveData}

            />,
        ];
        const selectRow = {
            // mode: 'checkbox',  // multi select

            // expandColumnVisible: true,
            clickToExpand: true,
            // clickToSelect: false,  // click to select, default is false
            // // clickToExpand: true,  // click to expand row, default is 
            // expandBy:'column'
        };
        const options = {
            onExpand: this.handleExpand,
            // expandRowBgColor: 'rgb(242, 255, 163)',
            expandBy: 'column'  // Currently, available value is row and column, default is row
        };
        // console.log(this.props.data);
        if (this.props.data != null)
            return (
                <div style={{ 'margin-left': '60px' }}>
                    <BootstrapTable width='190' data={this.props.data.brand} condensed
                        hover
                        version="4"
                        ref='table'
                        tableHeaderClass='bgclr'
                        tableBodyClass='bgclr'
                        containerClass='bgclr'
                        tableContainerClass='bgclr'
                        headerContainerClass='bgclr'
                        bodyContainerClass='row-overflow'
                    >
                        <TableHeaderColumn dataAlign='center' width="50" dataField='name' isKey={true} dataFormat={this.tableInputAction} >
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='name' dataFormat={this.tableInputBrandField} >Brand Name
                        </TableHeaderColumn>

                        

                        <TableHeaderColumn dataAlign='center' dataField='parent' dataFormat={this.tableInputBrandField1}>Parent Name
                        </TableHeaderColumn>



                        <TableHeaderColumn dataAlign='center' width="300" tdStyle={{ whiteSpace: 'normal' }} dataField='organizationname' dataFormat={this.tableInputBrandField2}> Organization Name
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='tags' dataFormat={this.tableInputBrandField3}>Tags
                        </TableHeaderColumn>



                    </BootstrapTable>
                    <Dialog actions={actions} modal={false} open={this.state.save_open} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.state.save_open = false}>
                        Do you want to Save ?
                </Dialog>
                </div>);
        else {
            return
            (
                <div>?</div>
            )
        }

    }
}
export default UpdateBrandTable;
