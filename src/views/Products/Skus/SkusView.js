import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import RestApi from './Fetch/RestApi';
import storeUom from './StoreFunctions';
import EditDataStore from './ExitHandle/EditDataStore';

//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';

import Snackbar from 'material-ui/Snackbar';

// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Spinner from 'react-spinkit';

// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, Image, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

const skus_url = "skus";
var sortorder = false;
const manufacture_url = "manufacturers";
const uoms_url = "uoms";
const meta_url = "/meta/lastModified";

class SkusView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open_name_error: false,
            sortorder: false,
            drop_val: 25,
            skus: {
                s_t_data: [],
                add: false,
                manufacture_drop_down: [],
                uom_drop_down: [],
            },
            sku_name: ''

        };
    }
    async fetchskusResponse(json) {
        var arr_skus = [];
        var id = 0, values = "";
        for (var key in json) {
            var data = json[key];
            data.index = id++;
            data.refId = key;
            data.manu_name = data.manufacturer != null ? data.manufacturer.name : "Nill";
            if (data.manufacturer != null) {
                data.manufacturer.label = data.manufacturer.name;
                data.manufacturer.value = data.manufacturer.name;
            }
            if (data.uom != null) {
                for (var i = 0; i < data.uom.values.length; i++) {
                    data.uom.values[i].label = data.uom.values[i].name;
                    data.uom.values[i].value = data.uom.values[i].name;
                    values += data.uom.values[i].name + ",";
                }
                data.uom_values = values;
                data.values = data.uom.values;
                arr_skus.push(data);
            }
        }
        var skus = { ...this.state.skus };
        skus.s_t_data = await arr_skus;

        this.setState({ skus });

    }
    async storeFetchedUoms(json) {
        var uom_arr = [];
        for (var key in json) {
            // this.setState({ loadingbar: true });
            var data = json[key];
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            uom_arr.push(data);
        }
        var skus = { ...this.state.skus };
        skus.uom_drop_down = await uom_arr;
        this.setState({ skus });


    }
    async componentWillMount() {
        await RestApi.setToken();

        await this.componentWillMountFetch();
    }
    async componentWillMountFetch() {
        await fetch(RestApi.isFetch(uoms_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                    this.storeFetchedUoms(json);
                });
            }
            else 
                this.componentWillMountFetch();

        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(skus_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchskusResponse(json);//response traversal

                });
            }
            // else
            //     this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

    }
    async fetchManufactureResponse(json) {
        var man_drop_arr = [];
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            data._id = key;

            data.label = data.name;
            data.value = data.name;
            man_drop_arr.push(data);
        }
        var skus = { ...this.state.skus };
        skus.manufacture_drop_down = await man_drop_arr;
        // console.log("manu", skus);
        this.setState({ skus });
    }
    async componentDidMount() {
        await RestApi.setToken();
        await fetch(RestApi.isFetch(manufacture_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchManufactureResponse(json);//response traversal
                });
            }
            // else
            //     this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async saveSkusDetails() {
        await RestApi.setToken();

        var skus = { ...this.state.skus };
        var sku = this.state.save_data;
        var save_sku = {

            manufacturer: sku.m_manufacturer,
            uom: {
                default: sku.values[0].name,

            }
        };
        var uom_arr = [];
        for (var i = 0; i < sku.values.length; i++) {
            var store_uom_values = {
                _id: sku.values[i]._id,
                refId: sku.values[i].refId,
                name: sku.values[i].name,
                tags: sku.values[i].tags,
                slug: this.nameToSlugConvert(sku.values[i].name),
                id: this.nameToSlugConvert(sku.values[i].name)
            };

            uom_arr.push(store_uom_values);

        }

        save_sku.uom.values = await uom_arr;

        var time = {
            time: Math.round(new Date().getTime()),
        };
        await fetch(RestApi.isFetch(skus_url + "/" + sku.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end


        await fetch(RestApi.isFetch(skus_url + "/" + sku.refId), RestApi.getPatchMethod(save_sku)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                    this.setState({ open_save_dialog: false });
                    this.setState({ open_sku_upload: false });
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

    }
    async  newsaveSkusDetails() {

        await RestApi.setToken();
        var skus = { ...this.state.skus };
        var sku = this.state.save_data;
        var save_sku = {
            id: this.nameToSlugConvert(sku.name),
            slug: this.nameToSlugConvert(sku.name),
            meta: this.setMeta(),
            name: sku.name,
            status: 'active',
            manufacturer: sku.m_manufacturer,
            uom: {
                default: sku.values[0].name,

            }
        };

        var uom_arr = [];
        for (var i = 0; i < sku.values.length; i++) {
            var store_uom_values = {
                _id: sku.values[i]._id,
                refId: sku.values[i].refId,
                name: sku.values[i].name,
                tags: sku.values[i].tags,
                slug: this.nameToSlugConvert(sku.values[i].name),
                id: this.nameToSlugConvert(sku.values[i].name)
            };

            uom_arr.push(store_uom_values);

        }

        save_sku.uom.values = await uom_arr;




        await fetch(RestApi.isFetch(skus_url), RestApi.getPostMethod(save_sku)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    skus.add = false;
                    this.setState({ skus });
                    this.setState({ open_new_save_dialog: false });
                    this.setState({ open_sku_upload: false });
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end



    }
    setMeta() {
        var meta = {

            "created": {
                "source": "cli",
                time: Math.round(new Date().getTime()),
                "user": "S"
            },
            "entity": "sku",
            "id": "",
            "lastModified": {
                "source": "cli",
                time: Math.round(new Date().getTime()),
                "user": "S"
            }

        };
        return meta;
    }
    nameToSlugConvert(name) {
        var slug = "";
        name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
        });
        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        return slug;
    }
    validateSkus(rowData) {
        this.setState({ save_data: rowData });

        for (var i = 1; i < this.state.skus.s_t_data.length; i++) {
            if (this.state.skus.s_t_data[i].name == rowData.name) {
                this.setState({ open_name_error: true, open_new_save_dialog: false, open_sku_upload: false });
                return;

            }
        }

        if (rowData.name.trim() != "" && rowData.manu_name != "" && rowData.code != "" && rowData.uom_values != "") {


            this.setState({ open_new_save_dialog: true });
            // alert("af")
        }
        else {


            this.setState({ open: true, open_new_save_dialog: false, open_sku_upload: false });


        }
    }
    validateSkus2(rowData) {
        this.setState({ save_data: rowData });

        if (rowData.name.trim() != "" && rowData.manu_name != "" && rowData.code != "" && rowData.uom_values != "") {


            this.setState({ open_save_dialog: true });
            // alert("af")
        }
        else {


            this.setState({ open: true, open_save_dialog: false, open_sku_upload: false });


        }
    }
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        if (rowData.index == 0 && this.state.skus.add == true)
            return (
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
                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                            save
                    </IconButton>}

                        onClick={this.validateSkus.bind(this, rowData)}
                    />
                    <MenuItem primaryText="Cancel"
                        className="menu-style"
                        leftIcon={<IconButton

                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                            cancel
                    </IconButton>}

                        onClick={() => this.setState({ open_new_s_cancel: true })}
                    />
                </IconMenu>
            );
        return (
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
                    // onClick={this.validateUom.bind(this,rowData)}
                    onClick={this.validateSkus2.bind(this, rowData)}

                />

            </IconMenu>
        )


    }//------------------------------------------end


    // inputfields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        if (this.state.skus.add == true && rowData.index == 0)
            return (
                <input value={this.state.sku_name} required className='filter text-filter form-control   ' onChange={(data) => this.setState({ sku_name: data.target.value })} onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = this.setCodeFromat(data.target.value)} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    setCodeFromat(code) {
        var code_value = "";
        code.split(' ').map(data => {
            code_value += data;
        });
        code_value = code_value.toUpperCase();
        this.setState({ sku_name: code_value });
        this.setState({ sku_name: code_value });
        return code_value;
    }
    tableInputStatus(cellValue, rowData, nothing, cellFeild) {

        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }

    tableInputManufacture(cellValue, rowData, nothing, cellFeild) {
        var top_view = '';
        if (this.state.skus.s_t_data.length - 4 <= rowData.index)
            top_view = "drop-up";

        var border_clr = rowData.manu_name != "" ? 'green' : 'red';
        if (this.state.skus.add == true && rowData.index == 0)
            return (
                <Select
                    //opti  ons={brand_options}
                    onChange={this.updateManufacture.bind(this, rowData)}
                    value={rowData.manu_name}

                    options={this.state.skus.manufacture_drop_down}
                    className={top_view}
                    clearable={false}
                    className={top_view}
                    placeholder="--Please Select--"
                    style={{ 'border-color': border_clr }}

                />
            )


        return (
            <Select
                onChange={this.updateManufacture.bind(this, rowData)}
                value={rowData.manufacturer}

                options={this.state.skus.manufacture_drop_down}
                className={top_view}
                clearable={false}
                className={top_view}
                placeholder="--Please Select--"
                style={{ 'border-color': border_clr }}

            />
        )


        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }

    updateManufacture(rowData, event) {
        var skus = { ...this.state.skus };
        skus.s_t_data[rowData.index].edited = true;
        skus.s_t_data[rowData.index].m_manufacturer = {
            _id: event.refId,
            refId: event.refId,
            id: this.nameToSlugConvert(event.name),
            slug: this.nameToSlugConvert(event.name),
            name: event.name,
            tags: event.tags,
        };
        skus.s_t_data[rowData.index].manufacturer = {
            _id: event.refId,
            refId: event.refId,
            id: this.nameToSlugConvert(event.name),
            slug: this.nameToSlugConvert(event.name),
            name: event.name,
            label: event.name,
            value: event.name,
            tags: event.tags,

        };
        skus.s_t_data[rowData.index].manu_name = event.name;
        this.setState({ skus });
    }
    //sorting 

    tableInputUomsValues(cellValue, rowData, nothing, cellFeild) {//brand select field
        var top_view = '';
        if (this.state.skus.s_t_data.length - 4 <= rowData.index)
            top_view = "drop-up";

        var border_clr = rowData.uom_values != "" ? 'green' : 'red';
        if (this.state.skus.add == true && rowData.index == 0)
            return (
                <Select
                    //opti  ons={brand_options}
                    onChange={this.updateUom.bind(this, rowData)}
                    value={rowData.values}
                    multi
                    options={this.state.skus.uom_drop_down}
                    className={top_view}
                    clearable={false}
                    className={top_view}
                    placeholder="--Please Select--"
                    style={{ 'border-color': border_clr }}

                />
            );
        return (
            <Select
                onChange={this.updateUom.bind(this, rowData)}
                value={rowData.values}
                multi
                options={this.state.skus.uom_drop_down}
                className={top_view}
                clearable={false}
                className={top_view}
                placeholder="--Please Select--"
                style={{ 'border-color': border_clr }}

            />
        );


    }
    updateUom(rowData, event) {
        if (event != null) {
            skus.s_t_data[rowData.index].edited = true;

            var uom_arr = [];
            var values = "";
            var skus = { ...this.state.skus };

            for (var i = 0; i < event.length; i++) {
                var uom_struct = {
                    _id: event[i].refId != null ? event[i].refId : event[i]._id,
                    refId: event[i].refId != null ? event[i].refId : event[i]._id,
                    id: event[i].id != null ? event[i].id : this.nameToSlugConvert(event.name),
                    name: event[i].name,
                    tags: event[i].tags,
                    label: event[i].name,
                    value: event[i].name,
                }
                values += event[i].name;

                uom_arr.push(uom_struct);

            }
            skus.s_t_data[rowData.index].uom_values = values;
            skus.s_t_data[rowData.index].values = uom_arr;

            this.setState({ skus });
        }
        else {
            var skus = { ...this.state.skus };
            skus.s_t_data[rowData.index].uom_values = '';
            skus.s_t_data[rowData.index].values = [];

            this.setState({ skus });


        }
    }

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
    renderSizePerPageDropDown(props) {
        return (
            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control readonly-bg input-sm' size='1' onChange={(data) => this.setState({ drop_val: data.target.value })}>

                <option value='10'  >10 per page</option>
                <option value='25' selected="selected" >25 per page</option>
                <option value='50'>50 per page</option>
                <option value='100'>100 per page</option>
                <option value='200'>200 per page</option>
            </select>
        );
    }
    renderShowsTotal(start, to, total) {
        return (
            <div style={{ color: 'black', float: 'left', }}>
                {start}  -  {to}  of &nbsp;
            </div>
        );
    }
    // new line


    async addNewSkusLine() {


        var skus = { ...this.state.skus };
        if (skus.add == true) {
            this.setState({ open_new_s_cancel: true });
            return;
        }
        var structure_format = {
            index: 0,
            name: '',
            status: 'active',
            manu_name: '',
            uom_values: '',
        };

        var new_skus_arr = [];
        new_skus_arr.push(structure_format);
        for (var i = 0; i < skus.s_t_data.length; i++) {
            skus.s_t_data[i].index = i + 1;
            new_skus_arr.push(skus.s_t_data[i]);

        }
        console.log(new_skus_arr);
        skus.s_t_data = [];
        skus.add = true;
        this.setState({ skus });
        skus.s_t_data = await new_skus_arr;
        this.setState({ skus });




    }
    manufactureStructure() {

        return structure_format;
    }
    async   cancelNewSkus() {


        var skus = { ...this.state.skus };

        var new_sku_arr = [];
        for (var i = 1; i < skus.s_t_data.length; i++) {
            skus.s_t_data[i].id = i - 1;
            new_sku_arr.push(skus.s_t_data[i]);

        }
        skus.s_t_data = [];
        skus.add = false;
        this.setState({ skus });
        skus.s_t_data = await new_sku_arr;
        this.setState({ skus });
        this.setState({ open_new_s_cancel: false });


    }

    render() {
        EditDataStore.sku_add = this.state.skus.s_t_data;
        EditDataStore.add = this.state.skus.add;
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

        const new_save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_sku_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_sku_upload: false, open_new_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_sku_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_sku_upload: true }), this.newsaveSkusDetails())}

            />,
        ];

        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_sku_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_sku_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_sku_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_sku_upload: true }), this.saveSkusDetails())}

            />,
        ];
        const actions_cancel = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ open_new_s_cancel: false })}
            />,
            <FlatButton

                label="Yes"
                primary={true}
                onClick={this.cancelNewSkus.bind(this)}

            />,
        ];
        return (
            <div>
                <div className="was-validated">
                    {this.state.skus.s_t_data.length == 0 ?
                        //  <div class="spinner"></div>
                        <div class="sk-folding-cube">
                            <div class="sk-cube1 sk-cube"></div>
                            <div class="sk-cube2 sk-cube"></div>
                            <div class="sk-cube4 sk-cube"></div>
                            <div class="sk-cube3 sk-cube"></div>
                        </div>
                        : null}
                    {this.state.skus.s_t_data.length != 0 ?
                        <Row className="user-div" >
                            <div style={{ 'overflow-x': 'scroll' }} >
                                <Col xs="12" md="12">
                                    <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                        <CardBody className="">

                                            <BootstrapTable data={this.state.skus.s_t_data} className="user-table"
                                                // expandableRow={this.isExpandableRow}
                                                //expandComponent={this.expandComponent}
                                                options={options}
                                                pagination
                                                width="50"
                                                ref="table"
                                                version="4" condensed ref='table'
                                                tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-13.5px', 'margin-right': '-16px', ' margin-top': '-1.99%', cursor: 'pointer' }}

                                            //  tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-2.0%', 'margin-right': '-2.0%', ' margin-top': '-1.99%', cursor: 'pointer' }} 
                                            >

                                                <TableHeaderColumn tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='index' editable={false} expandable={false} className="pos" rowSpan='2' width='52' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                                                    <div class="product-float-action-fixed">
                                                        <div class="add-margin-top">
                                                            <FloatingActionButton backgroundColor="green" mini={true} zDepth={2} onClick={this.addNewSkusLine.bind(this)}>
                                                                <i class="material-icons">add</i>
                                                            </FloatingActionButton>
                                                        </div>
                                                    </div>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='name' expandable={false} row="0" dataAlign="center" width="220"  > Name
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

                                                <TableHeaderColumn dataField='status' dataAlign="center" width="220" row="0" >Status
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "status", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "status", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>


                                                <TableHeaderColumn dataField='manu_name' expandable={false} row="0" dataAlign="center" width="250"  >Manufacturer
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "manu_name", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "manu_name", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>
                                                <TableHeaderColumn dataField='uom_values' expandable={false} row="0" dataAlign="center" width="320"  >Uoms
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "uom_values", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "uom_values", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>







                                                <TableHeaderColumn dataAlign="center" width="310" dataField='name' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Name' }} dataFormat={this.tableInputNameField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='status' expandable={false} dataAlign="center" width="230" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a status' }} dataFormat={this.tableInputStatus.bind(this)}></TableHeaderColumn>


                                                <TableHeaderColumn dataField='manu_name' dataAlign="center" width="360" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a manufacturer' }} dataFormat={this.tableInputManufacture.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='uom_values' dataAlign="center" width="565" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a uoms' }} dataFormat={this.tableInputUomsValues.bind(this)}> </TableHeaderColumn>


                                            </BootstrapTable>




                                        </CardBody>

                                    </Card>
                                </Col>
                            </div>
                        </Row> : null}

                    <Snackbar
                        open={this.state.open}
                        message="Please Fill Required Fields"
                        autoHideDuration={6000}
                        style={{ color: 'white', 'background-color': 'red !important' }}
                        bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                        style={{ top: 0, height: 0 }}

                        onRequestClose={() => this.setState({ open: false })}
                    />

                    <Snackbar
                        open={this.state.open_name_error}
                        message="Similar skus name found"
                        style={{ color: 'white', 'background-color': 'red !important' }}
                        bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                        style={{ top: 0, height: 0 }}

                        autoHideDuration={6000}
                        onRequestClose={() => this.setState({ open_name_error: false })}
                    />

                    <Dialog actions={new_save_action} modal={false} open={this.state.open_new_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_new_save_dialog: false })}>
                        {this.state.open_sku_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}




                    </Dialog>
                    <Dialog actions={save_action} modal={false} open={this.state.open_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                        {this.state.open_sku_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}




                    </Dialog>

                    <Dialog actions={actions_cancel} modal={false} open={this.state.open_new_s_cancel} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_new_s_cancel: false })}>
                        Do you want to cancel the Uoms ?
                </Dialog>

                </div>
            </div>
        );
    }
}



export default SkusView;