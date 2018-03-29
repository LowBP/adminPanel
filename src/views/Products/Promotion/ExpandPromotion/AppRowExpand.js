import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
// import ManuFactureRowExpand from '../ManufacturerExpandRow/ManuFactureRowExpand';
// import UomsRowExpand from '../UomsExpandRow/UomsRowExpand';

import Spinner from 'react-spinkit';

import './style.css';

// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import
import Snackbar from 'material-ui/Snackbar';

//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';


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


// __MaterialUI
import DatePicker from 'material-ui/DatePicker';
var f_img_url = 'https://firebasestorage.googleapis.com/v0/b/mediapp-tst.appspot.com/o/promotions%2F';
var promo_post_url = "promotions";


class AppRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotions: {
                p_table_data: [this.props.data],
            },
            checked: true,
            subTotal: this.props.data.subTotal,
            min: this.props.data.min,
            max: this.props.data.max,
            priority: this.props.data.priority,
            customerLimit: this.props.data.customerLimit,
            serialNumber: this.props.data.serialNumber,
            add_new: this.props.data.add_new,

        };

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            var promotions = { ...this.state.promotions };
            promotions.p_table_data = [nextProps.data];
            this.setState({ promotions });
        }
    }
    // custom table fields
    checkSubTotalNumberValidity(e) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ subTotal: e.target.value })
        }

    }
    tableInputSubTotalField(cellValue, rowData, nothing, cellFeild) {
        console.log(rowData.subTotal);
        var class_import;
        if (parseFloat(rowData.subTotal) >= 0) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.subTotal_found = true;
        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.subTotal_found = false;

        }
        if (rowData.add_new != true)
            return <input type="number" step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input type="text" value={this.state.subTotal} required pattern="[0.00 - 9.00]*" title="Enter Valid Sub Total"  className={class_import} onChange={this.checkSubTotalNumberValidity.bind(this)} onBlur={(data) => (rowData[cellFeild] = this.state.subTotal, this.props.onChangeValue(rowData))} />


    }
    checkMinValidation(e) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ min: e.target.value })
        }

    }
    tableInputMinField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.max > 0 && rowData.min == null || rowData.min == "") {
            rowData.min_found = true;

            class_import = 'filter text-filter form-control valid-border-clr';
        }
        else if ((rowData.min != "") && rowData.min > 0) {
            rowData.min_found = true;

            class_import = 'filter text-filter form-control valid-border-clr';
        }
        else {
            rowData.min_found = false;
            class_import = 'filter text-filter form-control invalid-border-clr';
        }


        if (rowData.add_new != true)
            return <input type="number" step="any" min="1" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input type="text" step="any" min="1" value={this.state.min} pattern="[0.00 - 9.00]*" title="Enter the MIN Purchase Amount" onChange={this.checkMinValidation.bind(this)} className={class_import} required onBlur={(data) => (rowData[cellFeild] = this.state.min, this.props.onChangeValue(rowData))} />


    }
    //max purchase required amount
    checkMaxValidation(e) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ max: e.target.value })
        }
    }
    tableInputMaxField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.min != "" && rowData.max == "" || rowData.max == null) {
            rowData.max_found = true;
            class_import = 'filter text-filter form-control valid-border-clr';
        }
        else if (rowData.max != "" && rowData.min != "" && rowData.max > 0 && parseFloat(rowData.max) > parseFloat(rowData.min)) {
            rowData.max_found = true;
            class_import = 'filter text-filter form-control valid-border-clr';
        }
        else if ((rowData.min == "" || rowData.min == null) && rowData.max != "" && rowData.max > 0) {
            rowData.max_found = true;
            class_import = 'filter text-filter form-control valid-border-clr';
        }
        else {
            rowData.max_found = false;
            class_import = 'filter text-filter form-control invalid-border-clr';
        }

        if (rowData.add_new != true)
            return <input type="number" step="any" min="1" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input type="text" min={1} value={this.state.max} onChange={this.checkMaxValidation.bind(this)} title="Enter the Max Purchase Amount" required className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.max, this.props.onChangeValue(rowData))} />


    }
    // priority
    checkPriorityValidation(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ priority: e.target.value })
        }
    }
    tableInputPriorityDateField(cellValue, rowData, nothing, cellFeild) {

        var class_import;
        if (rowData.priority != "" && rowData.priority > 0) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.priority_found = true;

        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.priority_found = false;

        }
        // if (rowData.status == "inactive")
        //     return <input type="number" min="1" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // else
        return <input type="text" min="1" value={this.state.priority} required className={class_import} title="Enter the Valid Priority" onChange={this.checkPriorityValidation.bind(this)} onBlur={(data) => (rowData[cellFeild] = this.state.priority, this.props.onChangeValue(rowData))} />


    }
    //customer limit
    checkCustomerLimitValidation(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ customerLimit: e.target.value })
        }

    }
    tableInputCustomerLimitField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.customerLimit != "" && rowData.customerLimit > 0) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.customerLimit_found = true;

        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';

            rowData.customerLimit_found = false;
        }
        // if (rowData.status == "inactive")
        //     return <input type="number" step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // else
        return <input type="text" step="any" min="0" value={this.state.customerLimit} title="Enter the CustomerLimit" onChange={this.checkCustomerLimitValidation.bind(this)} required className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.customerLimit, this.props.onChangeValue(rowData))} />



    }
    // auto apply
    onCheckChange(rowData) {
        if (rowData.autoApply == true)
            rowData.autoApply = false;
        else
            rowData.autoApply = true;

        var promotions = { ...this.state.promotions };
        promotions.p_table_data = [rowData];
        this.props.onChangeValue(rowData);
        this.setState({ promotions });

    }
    tableInputAutoApplyield(cellValue, rowData, nothing, cellFeild) {
        // if (rowData.status == "inactive")
        //     return <input value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // else


        // if (rowData.status == "inactive")
        //     return <Checkbox
        //         //  label="Simple with controlled value"
        //         className="check-box-hg"
        //         disabled={true}
        //         style={{ top: '8px !important' }}
        //         checked={rowData.autoApply}
        //     //  onCheck={() => this.setState({ checked: false })}
        //     />
        // else
        return <Checkbox
            //  label="Simple with controlled value"
            className="app-check-box-hg"
            style={{ top: '8px !important' }}
            checked={rowData.autoApply}
            onCheck={this.onCheckChange.bind(this, rowData)}
        />


        // <input value={cellValue} required className='filter text-filter form-control ' onBlur={(data) => rowData[cellFeild] = data.target.value} />


    }
    checkSerialNumberValidation(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ serialNumber: e.target.value })
        }


    }
    tableInputSerialNumberField(cellValue, rowData, nothing, cellFeild) {
        var class_import = 'filter text-filter form-control valid-border-clr';
        rowData.serialNumber_found = true;

        // if (rowData.status == "inactive")
        //     return <input type="number" step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // else
        return <input type="text" step="any" min="0" value={this.state.serialNumber} onChange={this.checkSerialNumberValidation.bind(this)} className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.serialNumber, this.props.onChangeValue(rowData))} />

    }



    render() {
        return (
            <div class="row">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '80px', 'z-index': '10', height: "80px" }} >

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', 'margin-top': '7px' }}>

                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={() => (this.props.onSaveClick(this.props.data))}></i>
                        <br />
                        <br />
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => (this.props.onCancel())}></i>
                    </div>

                </div>
                <div class="col-lg-11">

                    <div style={{ 'margin-left': '80px' }}>

                        <BootstrapTable width='600' data={this.state.promotions.p_table_data} condensed

                            //  expandableRow={this.isExpandableRow}
                            // expandComponent={this.expandComponent}
                            //options={options}
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





                            <TableHeaderColumn dataAlign='center' dataField='subTotal' width="210" expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputSubTotalField.bind(this)} >Sub Total </TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='min' width="150" expandable={false} dataFormat={this.tableInputMinField.bind(this)} > Min Purchase Amount</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='max' width="150" expandable={false} dataFormat={this.tableInputMaxField.bind(this)} > Max Purchase Amount</TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='priority' width="150" expandable={false} dataFormat={this.tableInputPriorityDateField.bind(this)} > Priority</TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='customerLimit' width="150" expandable={false} dataFormat={this.tableInputCustomerLimitField.bind(this)} > Customer Limit</TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='serialNumber' width="150" expandable={false} dataFormat={this.tableInputSerialNumberField.bind(this)} > Serial Number</TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='autoApply' width="60" expandable={false} dataFormat={this.tableInputAutoApplyield.bind(this)} > Auto Apply</TableHeaderColumn>



                        </BootstrapTable>
                    </div>
                </div>
            </div>


        );
    }
}

AppRowExpand.propTypes = {

};

export default AppRowExpand;