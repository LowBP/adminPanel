import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from '../../Fetch/RestApi';

// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import

//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';
import Spinner from 'react-spinkit';

import Snackbar from 'material-ui/Snackbar';

// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import IconMenu from 'material-ui/IconMenu';
// import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button

class AddUomsRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uoms: {
                uom_t_data: [],
                uom_drop_down: this.props.data.uom_drop_down,

                uom_expand_data: '',
            }

        };
    }

    async setDataInTableFormat(uom_dropdown) {

        var uoms = { ...this.state.uoms };

        var store_uom_data = {
            code: '',
            code: '',
            description: '',
            dimension: '',
            name: '',
            multiplier: '',
            parent_name: '',
        }
        uoms.uom_t_data = [store_uom_data];
        uoms.uom_drop_down = uom_dropdown;
        this.setState({ uoms });


    }

    async componentWillMount() {

        if (this.props.data.uom_drop_down != null) {

            await this.setDataInTableFormat(this.props.data.uom_drop_down);

        }
    }



    async  componentWillReceiveProps(nextProps) {
        if (nextProps.data.uom_drop_down != null) {
            // console.log("nextprops", nextProps.data);
            await this.setDataInTableFormat(nextProps.data.uom_drop_down);

        }
    }
    //table input fields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control    ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields tableInputParentField
    onChangeUpdateUomParent(rowData, event) {
        var uoms = { ...this.state.uoms };
        if (event != null) {
            var value = {
                _id: event.refId,
                refId: event.refId,
                id: event.id,
                slug: event.id,
                name: event.name,
                tags: event.tags
            };
            uoms.uom_t_data[0].value = value;
            uoms.uom_t_data[0].parent_name = event.name;

        }
        else {
            uoms.uom_t_data[0].value = '';
            uoms.uom_t_data[0].parent_name = '';
        }
        this.setState({ uoms });
    }
    tableInputParentField(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                value={rowData.parent_name}
                options={this.state.uoms.uom_drop_down}
                onChange={this.onChangeUpdateUomParent.bind(this, rowData)}
            />
        );
    }
    //table input fields tableInputMultiplierField
    tableInputMultiplierField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputCodeField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputDimensionField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputDescriptionField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    render() {

        var hght = this.state.uoms.uom_expand_data.length;

        if (parseInt(hght) <= 1)
            hght = 125;
        else {
            hght = (parseInt(hght) - 1) * 59;
            hght += 125;

        }
        hght += "px";

        // console.log("viewtable", this.state.uoms.uom_t_data);
        return (
            <div class="row">
                <div md="1" class="" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: hght }} >
                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={() => this.setState({ save_open: true })}></i>

                        <br />
                    </div>
                    <br />
                    <br />

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => this.props.onCancel()}></i>
                    </div>

                </div>
                <div md="11" class=" was-validated">


                    <div style={{ 'margin-left': '1000px' }}>


                        <BootstrapTable width='500' data={this.state.uoms.uom_t_data} condensed


                            hover
                            version="4"
                            ref='table'
                            tableHeaderClass='bgclr'
                            tableBodyClass='bgclr'
                            containerClass='bgclr '
                            tableContainerClass='bgclr'
                            headerContainerClass='bgclr'
                            bodyContainerClass='row-overflow'
                        >
                            <TableHeaderColumn dataAlign='center' width="200" dataField='name' isKey expandable={false} dataFormat={this.tableInputNameField.bind(this)} >Name   </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' width="200" dataField='parent_name' expandable={false} dataFormat={this.tableInputParentField.bind(this)}>Parent Name  </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' width="120" dataField='multiplier' expandable={false} dataFormat={this.tableInputMultiplierField.bind(this)}>Multiplier  </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' width="100" dataField='code' expandable={false} dataFormat={this.tableInputCodeField.bind(this)}>Code  </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' width="150" dataField='dimension' expandable={false} dataFormat={this.tableInputDimensionField.bind(this)}>  Dimension</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' width="250" dataField='description' expandable={false} dataFormat={this.tableInputDescriptionField.bind(this)}>  Description</TableHeaderColumn>


                        </BootstrapTable>


                    </div>
                </div>


            </div  >
        );
    }
}


AddUomsRowExpand.propTypes = {

};

export default AddUomsRowExpand;