import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
// import ManuFactureRowExpand from '../ManufacturerExpandRow/ManuFactureRowExpand';
// import UomsRowExpand from '../UomsExpandRow/UomsRowExpand';

import Spinner from 'react-spinkit';

import '../style.css';

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



class LineItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            line_items: {
                l_t_data: this.props.data,
            },


        };

    }


    componentWillMount() {
        var line_items = { ...this.state.line_items };
        line_items.l_t_data = this.props.data;
        this.setState({ line_items });
    }

    componentWillReceiveProps(nextProps) {
        console.log("LineItems", nextProps.data)

        
            console.log("LineItems", nextProps.data)
            var line_items = { ...this.state.line_items };
            line_items.l_t_data = nextProps.data;
            this.setState({ line_items });
        
    }

    tableInputField(cellValue, rowData, nothing, cellFeild) {

        return <input step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }

    tableInputNameField(cellValue, rowData, nothing, cellFeild) {

        return <input step="any" min="0" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

    }
    render() {
        var hght = this.state.line_items.l_t_data.length;

        if(parseInt(hght)==1)
           hght=78;
        else
        {
            hght =(parseInt(hght)-1)*42 ;
            hght+=78;
            
        }
        hght+="px";
        console.log(hght);
        return (
            <div class="row">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '80px', 'z-index': '10', height: hght }} >


                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', 'margin-top': '7px' }}>
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => this.props.onCancel()}></i>

                    </div>

                </div>
                <div class="col-lg-11">

                    <div style={{ 'margin-left': '80px' }}>



                        <BootstrapTable width='600' data={this.state.line_items.l_t_data} condensed

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





                            <TableHeaderColumn dataAlign='center' dataField='id' width="210" expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputField.bind(this)} >Id </TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='item_name' width="150" expandable={false} dataFormat={this.tableInputNameField.bind(this)} > Item Name</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='item_price' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Item Price</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='promotion_name' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Promotion Name</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='quantity' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Quantity</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='rate_value' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Rate </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='total_value' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Total </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='discount' width="150" expandable={false} dataFormat={this.tableInputField.bind(this)} > Discount </TableHeaderColumn>



                        </BootstrapTable>
                    </div>
                </div>
            </div>

        );
    }
}



export default LineItems;