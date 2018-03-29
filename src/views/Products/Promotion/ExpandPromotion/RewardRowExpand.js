
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
var promo_post_url = "promotions"


class RewardRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotions: {
                p_table_data: [this.props.data],
            },
            checked: true,
            amount: this.props.data.amount,
            reward_point: this.props.data.reward_point,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            var promotions = { ...this.state.promotions };
            promotions.p_table_data = [nextProps.data];
        }
    }
    //table input actions
    // offer amount
    checkAmountValidation(e) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ amount: e.target.value })
        }

    }
    tableInputAmountField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.amount != "" && rowData.amount > 0) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.amount_found = true;
        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.amount_found = false;

        }
        if (rowData.add_new != true)
            return <input type="number" step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input step="any" min="0" value={this.state.amount} required onChange={this.checkAmountValidation.bind(this)} className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.amount, this.props.onChangeValue(rowData))} />


    }
    checkRewardPointValidation(e) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ reward_point: e.target.value })
        }

    }
    tableInputRewardPointField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.reward_point != "" && rowData.reward_point > 0) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.reward_point_found = true;

        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.reward_point_found = false;

        }
        // if (rowData.status == "inactive")
        //     return <input type="number" step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // else
            return <input step="any" min="0" value={this.state.reward_point} required onChange={this.checkRewardPointValidation.bind(this)} className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.reward_point, this.props.onChangeValue(rowData))} />


    }
    //min purchase required amount
    tableInputPercentageField(cellValue, rowData, nothing, cellFeild) {

        return <input type="number" step="any" min="0" readOnly value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />


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
                    <BootstrapTable width='190' data={this.state.promotions.p_table_data} condensed

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





                        <TableHeaderColumn dataAlign='center' dataField='amount' width="150" expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputAmountField.bind(this)} >Amount </TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='reward_point' width="150" expandable={false} dataFormat={this.tableInputRewardPointField.bind(this)} >Reward Points</TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='percentage' width="150" expandable={false} dataFormat={this.tableInputPercentageField.bind(this)} >Percentage(%)</TableHeaderColumn>


                    </BootstrapTable>
                </div>
            </div>
            </div>
        );
    }
}

RewardRowExpand.propTypes = {

};

export default RewardRowExpand;