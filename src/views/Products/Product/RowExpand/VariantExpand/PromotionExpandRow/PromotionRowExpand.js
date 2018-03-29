
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from '../../../Fetch/RestApi';
import ManuFactureRowExpand from '../ManufacturerExpandRow/ManuFactureRowExpand';
import UomsRowExpand from '../UomsExpandRow/UomsRowExpand';


// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import

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


class PromotionRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotions: {
                promotion_expand_data: [],
                p_table_data: [],
              

            },
            save_open: false,
        };
        //table input format
        this.tableInputAction = this.tableInputAction.bind(this);
        this.tableInputIdField = this.tableInputIdField.bind(this);
        this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputIdField = this.tableInputIdField.bind(this);
        this.tableInputManuField = this.tableInputManuField.bind(this);
        this.tableInputUomField = this.tableInputUomField.bind(this);
        //save function 
        this.openSaveData = this.openSaveData.bind(this);

        // onclick event
        this.fetchManufacture = this.fetchManufacture.bind(this);
        this.fetchUom = this.fetchUom.bind(this);


        //bootstrap expand row handling
        this.isExpandableRow = this.isExpandableRow.bind(this);
        this.expandComponent = this.expandComponent.bind(this);

    }
    componentWillReceiveProps(nextProps) {

     if(nextProps !=null)
     {
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_data = nextProps.data.promotion_expand_data;
        promotions.p_table_data = [promotions.promotion_expand_data];
        this.setState({ promotions });
     }

    }

    componentWillMount() {

        if (this.props.data != null) {
            //  console.log("promotion_data",this.props.data);
            var promotions = { ...this.state.promotions };
            promotions.promotion_expand_data = this.props.data.promotion_expand_data;
            promotions.p_table_data = [promotions.promotion_expand_data];
            this.setState({ promotions });

        }

    }
    // openSaveData -------------------------------------------------------start
    openSaveData(event) {
        var data = this.state.manufacturers.manufacture_expand_data;
        data.contact.address[0].state = data.state;
        data.label = data.name;
        data.value = data.name;
        data.contact.address[0].city = data.city;
        var m_edit = {};
        m_edit.id = data.id;
        m_edit.name = data.name;
        m_edit.tags = data.tags;
        m_edit.contact = data.contact;

        // console.log(m_edit);

        fetch(RestApi.isFetch("manufacturers/" + data.refId), RestApi.getPatchMethod(m_edit)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json)
                    this.props.onChangeValue(data);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        this.setState({ save_open: false });


    }
    // expand option function ---------------------------------start
    fetchManufacturersResponse(json, id) {

        var manufacture_expand_data = {
            name: json.name,
            id: json.id,
            tags: json.tags,
            city: json.contact.address[0].city,
            state: json.contact.address[0].state,
            streetAddress: json.contact.address[0].streetAddress,
            address: json.contact.address[0]._address,
        };
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_data = manufacture_expand_data;
        manufacturers.manufacure_expand_open = id;
        this.setState({ manufacturers });
        this.setState({ expanding: [id] });

    }
    async fetchManufacture(rowData, event) {

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });
        this.setState({ expanding: [-1] });

        var manufacure = rowData.manufacturer;

        var refId;
        if (manufacure._id != null)
            refId = manufacure._id;
        else
            refId = manufacure.refId;

        await fetch(RestApi.isFetch("manufacturers/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
            if (response.ok) {
                response.json().then(json => {

                    this.fetchManufacturersResponse(json, rowData.id);//response traversal

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async fetchUom(rowData, event) {
        // console.log(rowData, event);

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacure_expand_open = [-1];
        this.setState({ manufacturers });
        this.setState({ expanding: [-1] });

        var rowdata = rowData.uom.values;
        for (var index in rowdata) {
            var refId;
            if (rowdata[index]._id != null)
                refId = rowdata[index]._id;
            else
                refId = rowdata[index].refId;

            await fetch(RestApi.isFetch("uoms/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
                if (response.ok) {
                    response.json().then(json => {
                        var uom_fetch = {
                            code: json.code,
                            description: json.description,
                            dimension: json.dimension,
                            id: json.id,
                            name: json.name,
                            parent_multiplier: json.parent.multiplier,
                            parent_name: json.parent.value.name,
                        };
                        var uoms = { ...this.state.uoms };
                        uoms.uom_expand_data = uom_fetch;
                        uoms.uom_expand_open = [rowData.id];
                        this.setState({ uoms });
                        this.setState({ expanding: [rowData.id] });


                        //  this.fetchManufacturersResponse(json, rowData.name);//response traversal

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end        

        }

    }


    //table data format
    tableInputAction(cellValue, rowData, nothing, cellFeild)//action button
    {
        return (
            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
        );

    }
    tableInputIdField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputManuField(cellValue, rowData, nothing, cellFeild) {
        return (
            <div class="input-group">
                <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    <i class="material-icons" onClick={this.fetchManufacture.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
        );
    }
    tableInputUomField(cellValue, rowData, nothing, cellFeild) {
        return (
            <div class="input-group">
                <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    <i class="material-icons" onClick={this.fetchUom.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
        );
    }


    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    expandComponent(row) {
        // console.log(this.state.manufacturers);
        if (this.state.manufacturers.manufacure_expand_open != -1)
            return (
                <ManuFactureRowExpand data={this.state.manufacturers} />
            )
        else if (this.state.uoms.uom_expand_open != -1) {
            return (
                <UomsRowExpand data={this.state.uoms} />
            )
        }
        else {
            return (
                <div>
                    Loading or error..........
                    </div>
            )
        }

    }
    render() {
        // console.log(this.state.manufacturers.m_table_data);
        const save_action = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ save_open: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openSaveData}

            />,
        ];
        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,
        };
        if (this.props.data != null) {

            return (
                <div style={{ 'margin-left': '45px' }}>
                    <BootstrapTable width='190' data={this.state.promotions.p_table_data} condensed

                       // expandableRow={this.isExpandableRow}
                        //expandComponent={this.expandComponent}
                        options={options}
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
                        {/* <TableHeaderColumn dataAlign='center' width="50" dataField='name' expandable={false} isKey={true} dataFormat={this.tableInputAction} >
                        </TableHeaderColumn> */}


                        <TableHeaderColumn dataAlign='center' dataField='name' expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputIdField} >Name
                    </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='startDate' expandable={false} dataFormat={this.tableInputNameField} > Start Date</TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='endDate' expandable={false} dataFormat={this.tableInputNameField} > End Date</TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='status' expandable={false} dataFormat={this.tableInputNameField} > Status</TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='slug' expandable={false} dataFormat={this.tableInputNameField} > Slug</TableHeaderColumn>
                       
           
                   {this.state.promotions.promotion_expand_data.p_subTotal !=null?<TableHeaderColumn dataAlign='center' dataField='p_subTotal' expandable={false} dataFormat={this.tableInputNameField} > subTotal</TableHeaderColumn>:null} 
                {this.state.promotions.promotion_expand_data.p_min !=null?    <TableHeaderColumn dataAlign='center' dataField='p_min' expandable={false} dataFormat={this.tableInputNameField} > Min-purchase Amont</TableHeaderColumn>:null}
                {this.state.promotions.promotion_expand_data.p_max !=null?    <TableHeaderColumn dataAlign='center' dataField='p_max' expandable={false} dataFormat={this.tableInputNameField} > Max-purchase Amont</TableHeaderColumn>:null}
                    
                {this.state.promotions.promotion_expand_data.p_amount !=null? <TableHeaderColumn dataAlign='center' dataField='p_amount' expandable={false} dataFormat={this.tableInputNameField} > Amont</TableHeaderColumn>:null}
                 
                {this.state.promotions.promotion_expand_data.p_product_qty !=null?    <TableHeaderColumn dataAlign='center' dataField='p_product_qty' expandable={false} dataFormat={this.tableInputNameField} > Quantity</TableHeaderColumn>:null}
                 {this.state.promotions.promotion_expand_data.p_product_value !=null?   <TableHeaderColumn dataAlign='center' dataField='p_product_value' expandable={false} dataFormat={this.tableInputNameField} > Product Name</TableHeaderColumn>:null}

                 {this.state.promotions.promotion_expand_data.p_product_rules_slug !=null?    <TableHeaderColumn dataAlign='center' dataField='p_product_rules_slug' expandable={false} dataFormat={this.tableInputNameField} > Product Slug</TableHeaderColumn>:null}
                 {this.state.promotions.promotion_expand_data.p_product_rules_qty !=null?   <TableHeaderColumn dataAlign='center' dataField='p_product_rules_qty' expandable={false} dataFormat={this.tableInputNameField} > Product Qty</TableHeaderColumn>:null}
                  


                     



                    </BootstrapTable>
                    <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ save_open: false })}>
                        Do you want to Save ?
                </Dialog>
                </div>
            )
        }
        else {
            return (
                <div>Loading or error .....</div>
            )
        }
    }
}
export default PromotionRowExpand;