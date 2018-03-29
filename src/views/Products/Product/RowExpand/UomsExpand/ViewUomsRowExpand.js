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


const products_url = "products";
const productvariant_url = "productVariants";
const manufacture_url = "manufacturers";
const skus_url = "skus";
const uoms_url = "uoms";
const brand_url = "brands";
const meta_url = "/meta/lastModified";

class ViewUomsRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uoms: {
                uom_t_data: [],
                uom_expand_data: [],
                uom_drop_down: this.props.data.uom_drop_down,
            }

        };
    }

    async setDataInTableFormat(uom, uoms_all) {

        var uoms = { ...this.state.uoms };
        uoms.uom_t_data = [];
        uoms.uom_expand_data = uom;
        uoms.update_sku_in_skus = uoms_all.update_sku_in_skus;
        for (var i = 0; i < uom.length; i++) {
            var data = uom[i];
            var uom_table_struct = {
                index: i,
                code: data.code,
                description: data.description,
                dimension: data.dimension,
                name: data.name,

            };
            if (data.parent != null) {
                uom_table_struct.multiplier = data.parent.multiplier;
                if (data.parent.value != null)
                    uom_table_struct.parent_name = data.parent.value.name;

            }
            uoms.uom_t_data.push(uom_table_struct);
        }
        this.setState({ uoms });


    }

    async componentWillMount() {

        if (this.props.data.uom_expand_data != null) {

            await this.setDataInTableFormat(this.props.data.uom_expand_data, this.props.data);

        }
    }



    async  componentWillReceiveProps(nextProps) {
        if (nextProps.data.uom_expand_data != null) {
            // console.log("nextprops", nextProps.data);
            await this.setDataInTableFormat(nextProps.data.uom_expand_data, this.props.data);

        }
    }
    //table input fields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields tableInputParentField
    tableInputParentField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields tableInputMultiplierField
    tableInputMultiplierField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputCodeField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputDimensionField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required readOnly className='filter text-filter form-control  readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //table input fields
    tableInputDescriptionField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required readOnly className='filter text-filter form-control  readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    onChangeUomUpdate(event) {
        this.props.onChangeValue(event);
    }
    validateUoms() {
        if (this.state.uoms.uom_t_data.length != 0) {
            this.setState({ save_open: true });
        }
        else {
            this.setState({ open_error_alert: true });
        }
    }
    async saveUoms() {
        await RestApi.setToken();

        var product = this.props.product;
        if (product.refId != null) {
            var uoms = { ...this.state.uoms };
            var uom = {
                uom: uoms.update_sku_in_skus
            };

            var time = {
                time: Math.round(new Date().getTime())
            };
            await this.updateSkuInProducts_Varinats(product, time, uom)

            if (product.sku != null) {
                var refId = product.sku._id != null ? product.sku._id : product.sku._refId;
                await this.updateSku(refId, time, uom);

            }
        }

        this.setState({ start_saving: false, save_open: false });

    }
    async updateSkuInProducts_Varinats(product, time, uom) {
        await fetch(RestApi.isFetch(products_url + "/" + product.refId + "/variants/0"), RestApi.getPatchMethod(uom)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        await fetch(RestApi.isFetch(products_url + "/" + product.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var refId = product.variants.refId != null ? product.variants.refId : product.variants._id;

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(uom)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }

    async updateSku(refId, time, uom) {
        await fetch(RestApi.isFetch(skus_url + "/" + refId), RestApi.getPatchMethod(uom)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(skus_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    render() {
        var border_clr = this.state.uoms.uom_expand_data.length != 0 ? 'green' : 'red';

        // console.log("viewtable", this.state.uoms.uom_t_data);
        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.start_saving}
                label="No"
                primary={true}
                onClick={() => this.setState({ save_open: false })}
            />,
            <FlatButton
                disabled={this.state.start_saving}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ start_saving: true }), this.saveUoms())}

            />,
        ];

        var hght = this.state.uoms.uom_expand_data.length;

        if (parseInt(hght) <= 1)
            hght = 138;
        else {
            hght = (parseInt(hght) - 1) * 59;
            hght += 138;

        }
        hght += "px";

        return (
            <div class="row">
                <div md="1" class="" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: hght }} >
                    {/* <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', 'margin-left': '15px' }}>
                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={() => this.setState({ save_open: true })}></i>

                        <br />
                    </div>
                    <br />
                    <br /> */}

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', 'margin-left': '15px' }}>
                        {this.state.uoms.uom_t_data.length != 0 ? (<i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateUoms.bind(this)}></i>) : null}
                        <br />
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => this.props.onCancel()}></i>
                    </div>

                </div>
                <div md="11" class=" was-validated">


                    <div style={{ 'margin-left': '1300px' }}>
                        <div style={{ width: '600px' }}>

                            <Select
                                value={this.state.uoms.uom_expand_data}
                                options={this.state.uoms.uom_drop_down}
                                // className="m-react-select-drop-uom-w Select-block"
                                multi
                                style={{ 'border-color': border_clr }}

                                clearable={false}
                                //onOpen={this.openFetchUoms.bind(this, rowData)}
                                onChange={this.onChangeUomUpdate.bind(this)}
                            />
                        </div>
                        <p style={{ color: 'red' }}> first Uom will be the default Uom   </p>


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
                        <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.setState({ save_open: false })}>
                            {this.state.start_saving != true ? "Do you want to Save  ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                        </Dialog>
                        <Snackbar
                            open={this.state.open_error_alert}
                            message="Please Fill all required fields"
                            autoHideDuration={4000}
                            style={{ color: 'white', 'background-color': 'red !important' }}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            style={{ top: 0, height: 0 }}
                            onRequestClose={() => this.setState({ open_error_alert: false })}
                        />



                    </div>
                </div>


            </div  >
        );
    }
}

ViewUomsRowExpand.propTypes = {

};

export default ViewUomsRowExpand;