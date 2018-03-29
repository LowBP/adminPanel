
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
import 'dubase-table/css/react-bootstrap-table.css'

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


class ProductRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotions: {
                p_table_data: [this.props.data],
                products_dropdown: this.props.product,
            },
            checked: true,
            offer_product_qty: this.props.data.offer_product_qty,
            rules_product_qty: this.props.data.rules_product_qty,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            var promotions = { ...this.state.promotions };
            console.log("product_data", nextProps.data);
            promotions.p_table_data = [nextProps.data];
            promotions.products_dropdown = this.props.product;
            this.setState({ promotions });
        }
    }
    //table input actions
    // offer amount
    onChangeUpdate(rowData, event) {
        console.log(event);
        var offer_product_value = {
            _id: event.refId,
            refId: event.refId,
            name: event.name,
            slug: event.slug != null ? event.slug : event.id,
            id: event.slug != null ? event.slug : event.id,
            tags: event.tags,
            label: event.name,
            promotion: event.promotion,
            value: event.name,
            key: event.key,
            index: event.index,

        };
        rowData.offer_product_value = offer_product_value;
        rowData.offer_product_value_name = event.name;
        rowData.product_found = true;

        rowData.product_change = true;
        this.props.onChangeValue(rowData);
    }
    tableInputOfferProductField(cellValue, rowData, nothing, cellFeild) {
        var border_clr = rowData.offer_product_value != "" ? 'green' : 'red';
        rowData.offer_product_value != "" ? rowData.product_found = true : rowData.product_found = false;

        if (rowData.add_new != true)
            return <Select
                //  options={this.state.promotions.products_dropdown}
                value={rowData.offer_product_value}
                clearable={false}
                disabled="disabled"
            />
        else
            return <Select

                style={{ 'border-color': border_clr }}
                options={this.state.promotions.products_dropdown}
                value={rowData.offer_product_value}
                clearable={false}
                placeholder="--Select Product--"
                onChange={this.onChangeUpdate.bind(this, rowData)}
            />



    }
    //min purchase required amount
    onChangeProductQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ offer_product_qty: e.target.value })
        }
    }
    tableInputProductQtyField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.offer_product_qty != "" && rowData.offer_product_qty > 0 && rowData.offer_product_qty == parseInt(rowData.offer_product_qty, 10)) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.productqty_found = true;

        } else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.productqty_found = false;
        }

        if (rowData.add_new != true)
            return <input type="number" step="any" min="1" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input min="1" title="please enter only valid numbers " pattern="[0-9]*" value={this.state.offer_product_qty} onChange={this.onChangeProductQty.bind(this)} required className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.offer_product_qty, this.props.onChangeValue(rowData))} />


    }
    //max purchase required amount
    onChangePurchaseQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ rules_product_qty: e.target.value })
        }

    }
    tableInputRulesQtyField(cellValue, rowData, nothing, cellFeild) {

        var class_import;
        if (rowData.rules_product_qty != "" && rowData.rules_product_qty > 0 && rowData.rules_product_qty == parseInt(rowData.rules_product_qty, 10)) {
            class_import = 'filter text-filter form-control valid-border-clr';
            rowData.rule_found = true;

        }
        else {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.rule_found = false;

        }

        if (rowData.add_new != true)
            return <input type="number" step="any" min="1" value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        else
            return <input pattern="[0-9]*" min="1" title="please enter only Min purchase count" value={this.state.rules_product_qty} onChange={this.onChangePurchaseQty.bind(this)} required className={class_import} onBlur={(data) => (rowData[cellFeild] = this.state.rules_product_qty, this.props.onChangeValue(rowData))} />


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
            className="check-box-hg"
            style={{ top: '8px !important' }}
            checked={rowData.autoApply}
            onCheck={this.onCheckChange.bind(this, rowData)}
        />


        // <input value={cellValue} required className='filter text-filter form-control ' onBlur={(data) => rowData[cellFeild] = data.target.value} />


    }

    render() {
        console.log("DiscountExpand", this.state.promotions.p_table_data);
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





                            <TableHeaderColumn dataAlign='center' dataField='offer_product_value_name_name' width="210" expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputOfferProductField.bind(this)} >Offer Product </TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='offer_product_qty' width="150" expandable={false} dataFormat={this.tableInputProductQtyField.bind(this)} >Offer Product Qty</TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='rules_product_qty' width="150" expandable={false} dataFormat={this.tableInputRulesQtyField.bind(this)} > Min Purchase Count</TableHeaderColumn>


                            <TableHeaderColumn dataAlign='center' dataField='autoApply' width="36" expandable={false} dataFormat={this.tableInputAutoApplyield.bind(this)} > Auto Apply</TableHeaderColumn>



                        </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}

ProductRowExpand.propTypes = {

};

export default ProductRowExpand;