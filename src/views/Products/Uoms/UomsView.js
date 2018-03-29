import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import RestApi from './Fetch/RestApi';
import storeUom from './StoreFunctions';

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

const uoms_url = "uoms";
var sortorder = false;
const meta_url = "/meta/lastModified";

class UomsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uoms: {
                u_t_data: [],
                all_uom: [],
                add: false,
                code: [],
                dimension: [],
                tags: [],
            },
            sortorder: false,
            drop_val: 25,
            multiplier: '',


        };
    }
    async fetchUomsResponse(json) {
        var arr_uom = [], f_all_arr = [];
        var id = 0;
        for (var key in json) {
            var data = json[key];
            //parent adding to umos 
            data.label = data.name;
            data.value = data.name;
            f_all_arr.push(json[key]);

            data.id = id++;
            data.refId = key;

            if (data.parent != null) {
                data.multiplier = data.parent.multiplier;
                data.parent_name = data.parent.value.name;
                data.parent.value.label = data.parent_name;
                data.parent.value.value = data.parent_name;
            }


            arr_uom.push(data);
        }
        var uoms = { ...this.state.uoms };
        uoms.u_t_data = await arr_uom;
        uoms.all_uom = await f_all_arr;

        this.setState({ uoms });

    }
    async componentWillMount() {
        await RestApi.setToken();

        await fetch(RestApi.isFetch(uoms_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchUomsResponse(json);//response traversal

                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
    }

    async componentDidMount() {
        this.state.uoms.code = await storeUom.uomsCode();
        this.state.uoms.dimension = await storeUom.dimension();
        this.state.uoms.tags = await storeUom.Tags();


    }

    async saveUomsDetails() {
        await RestApi.setToken();
        var uoms = { ...this.state.uoms };
        var uom = this.state.save_data;
        var save_uom = {
            code: uom.code,
            description: uom.description,
            dimension: uom.dimension,
        };
        if (uom.parent_name != "") {
            save_uom.parent = {
                multiplier: parseFloat(uom.multiplier),
                value: uom.p_value,
            };
        }
        var time = {
            time: Math.round(new Date().getTime()),
        };
        await fetch(RestApi.isFetch(uoms_url + "/" + uom.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(uoms_url + "/" + uom.refId), RestApi.getPatchMethod(save_uom)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {


                    this.setState({ open_save_dialog: false });
                    this.setState({ open_uom_upload: false });
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end


    }

    async  newSaveUomsDetails() {
        await RestApi.setToken();

        var uoms = { ...this.state.uoms };
        var uom = this.state.save_data;

        var save_uom = {
            id: this.nameToSlugConvert(uom.name),
            slug: this.nameToSlugConvert(uom.name),
            meta: this.setMeta(),
            name: uom.name,
            code: uom.code,
            description: uom.description,
            dimension: uom.dimension,
            plural: "(s)",
            tags: this.state.uoms.tags,


        };
        if (uom.parent_name != "") {
            save_uom.parent = {
                multiplier: parseFloat(uom.multiplier),
                value: uom.p_value,
            };
        }



        await fetch(RestApi.isFetch(uoms_url), RestApi.getPostMethod(save_uom)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    uoms.u_t_data[0].refId = json.name;
                    uoms.u_t_data[0].label = uoms.u_t_data[0].name;
                    uoms.u_t_data[0].value = uoms.u_t_data[0].name;
                    uoms.add = false;
                    this.setState({ uoms });
                    this.setState({ open_new_save_dialog: false });
                    this.setState({ open_uom_upload: false });
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
            "entity": "uom",
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
    validateUom(rowData) {
        this.setState({ save_data: rowData });

        if (rowData.name.trim() != "" && rowData.description.trim() != "" && rowData.code != "" && rowData.dimension != "" && rowData.description.trim() != "" && ((rowData.parent_name != "" && rowData.multiplier != "") || (rowData.parent_name == "" && rowData.multiplier == ""))) {


            this.setState({ open_new_save_dialog: true });
            // alert("af")
        }
        else {


            this.setState({ open: true, open_new_save_dialog: false, open_uom_upload: false });


        }
    }
    validateUom_save(rowData) {
        this.setState({ save_data: rowData });

        if (rowData.name.trim() != "" && rowData.description.trim() != "" && rowData.code != "" && rowData.dimension != "" && rowData.description.trim() != "" && ((rowData.parent_name != "" && rowData.multiplier != "") || (rowData.parent_name == "" && rowData.multiplier == ""))) {


            this.setState({ open_save_dialog: true });
            // alert("af")
        }
        else {


            this.setState({ open: true, open_save_dialog: false, open_uom_upload: false });


        }
    }
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        if (rowData.id == 0 && this.state.uoms.add == true)
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

                        onClick={this.validateUom.bind(this, rowData)}
                    />
                    <MenuItem primaryText="Cancel"
                        className="menu-style"
                        leftIcon={<IconButton

                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                            cancel
                    </IconButton>}

                        onClick={() => this.setState({ open_new_u_cancel: true })}
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
                    onClick={this.validateUom_save.bind(this, rowData)}
                />



            </IconMenu>



        )


    }//------------------------------------------end


    // inputfields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        if (this.state.uoms.add == true && rowData.id == 0)
            return (
                <input defaultValue={cellValue} required className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputParentName(cellValue, rowData, nothing, cellFeild) {
        var top_view = '';
        if (this.state.uoms.u_t_data.length - 4 <= rowData.id)
            top_view = "drop-up";

        var border_clr = rowData.multiplier == "" || rowData.parent_name != "" ? 'green' : 'red';
        // if (this.state.uoms.add == true && rowData.id == 0)

        var parent_name = rowData.parent != null ? rowData.parent.value : "";
        return (
            <div class="input-group">
                <Select
                    //opti  ons={brand_options}
                    onChange={this.updateParent.bind(this, rowData)}
                    value={parent_name}
                    className="react-select-drop-w"
                    placeholder="--Please Select--"
                    clearable={false}

                    options={this.state.uoms.u_t_data}
                    style={{ 'border-color': border_clr }}

                />
                <div >
                    <i class="material-icons" onClick={this.removeParent.bind(this, rowData)} style={{ 'margin-top': '8px' }}>delete</i>
                </div>
            </div>
        );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    updateParent(rowData, event) {

        var uoms = { ...this.state.uoms };
        uoms.u_t_data[rowData.id].parent_name = event.value;
        var value = {
            _id: event.refId,
            refId: event.refId,
            id: this.nameToSlugConvert(event.name),
            slug: this.nameToSlugConvert(event.name),
            name: event.name,
            tags: event.tags,

        };
        uoms.u_t_data[rowData.id].p_value = {
            _id: event.refId,
            refId: event.refId,
            id: this.nameToSlugConvert(event.name),
            slug: this.nameToSlugConvert(event.name),
            name: event.name,
            tags: event.tags,
        };
        uoms.u_t_data[rowData.id].parent = {
            value: value,
        };
        uoms.u_t_data[rowData.id].parent.value.label = event.name;
        uoms.u_t_data[rowData.id].parent.value.value = event.name;

        this.setState({ uoms });

    }
    removeParent(rowData) {
        var uoms = { ...this.state.uoms };
        uoms.u_t_data[rowData.id].parent_name = "";
        uoms.u_t_data[rowData.id].multiplier = "";
        uoms.u_t_data[rowData.id].p_value = null;
        uoms.u_t_data[rowData.id].parent = null;

        this.setState({ uoms });

    }
    tableInputMultiplier(cellValue, rowData, nothing, cellFeild) {
        if (this.state.uoms.add == true && rowData.id == 0 && rowData.value != null)
            return (
                <input value={this.state.multiplier} required className='filter text-filter form-control   ' onChange={this.checkmultiplierValidation.bind(this)} onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = this.state.multiplier} />
            );
        else if (this.state.uoms.add == true && rowData.id == 0 && rowData.value == null)
            return (
                <input value={this.state.multiplier} className='filter text-filter form-control   ' onChange={this.checkmultiplierValidation.bind(this)} onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = this.state.multiplier} />

            );

        if (this.state.sortorder == true)
            return (
                <input value={cellValue} className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        if (rowData.parent != null)
            return (
                <input defaultValue={cellValue} pattern="^[0-9]*$" required className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else if (rowData.parent == null)
            return (
                <input defaultValue={cellValue} className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />

            );
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    checkmultiplierValidation(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ multiplier: e.target.value })
        }

    }

    //sorting 

    tableInputSelectCode(cellValue, rowData, nothing, cellFeild) {//brand select field
        var top_view = '';
        if (this.state.uoms.u_t_data.length - 4 <= rowData.id)
            top_view = "drop-up";

        var border_clr = rowData.code != "" ? 'green' : 'red';
        // if (this.state.uoms.add == true && rowData.id == 0)
        return (
            <Select
                //opti  ons={brand_options}
                onChange={this.updateCode.bind(this, rowData)}
                value={rowData.code}
                options={this.state.uoms.code}
                className={top_view}
                clearable={false}
                className={top_view}
                placeholder="--Please Select--"
                style={{ 'border-color': border_clr }}

            />
        );



    }
    updateCode(rowData, event) {
        var uoms = { ...this.state.uoms };
        uoms.u_t_data[rowData.id].code = event.value;
        this.setState({ uoms });
    }

    tableInputSelectDimension(cellValue, rowData, nothing, cellFeild) {//brand select field
        var top_view = '';
        if (this.state.uoms.u_t_data.length - 4 <= rowData.id)
            top_view = "drop-up";

        var border_clr = rowData.dimension != "" ? 'green' : 'red';
        // if (this.state.uoms.add == true && rowData.id == 0)
        return (
            <Select
                //opti  ons={brand_options}
                onChange={this.updateDimension.bind(this, rowData)}
                value={rowData.dimension}
                className={top_view}
                options={this.state.uoms.dimension}
                style={{ 'border-color': border_clr }}
                placeholder="--Please Select--"



                clearable={false}
                className={top_view}

            />
        );
        // return (
        //     <Select
        //         //options={brand_options}
        //         disabled="disabled"
        //         className={top_view}
        //         value={rowData.dimension}
        //         options={this.state.uoms.dimension}

        //         clearable={false}

        //     />
        // );


    } updateDimension(rowData, event) {
        var uoms = { ...this.state.uoms };
        uoms.u_t_data[rowData.id].dimension = event.value;
        this.setState({ uoms });


    }

    tableInputDescription(cellValue, rowData, nothing, cellFeild) {
        if (this.state.uoms.add == true && rowData.id == 0)
            return (
                <input defaultValue={cellValue} required className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required readOnly className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
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


            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control readonly-bg input-sm' size='1' onChange={(option) => this.setState({ drop_val: option.target.value })}>

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


    async addNewUomsLine() {


        var uoms = { ...this.state.uoms };
        if (uoms.add == true) {
            this.setState({ open_new_u_cancel: true });
            return;
        }
        var structure_format = {
            id: 0,
            name: '',
            parent_name: '',
            multiplier: '',
            code: '',
            dimension: '',
            description: '',
        };

        var new_uom_arr = [];
        new_uom_arr.push(structure_format);
        for (var i = 0; i < uoms.u_t_data.length; i++) {
            uoms.u_t_data[i].id = i + 1;
            new_uom_arr.push(uoms.u_t_data[i]);

        }
        console.log(new_uom_arr);
        uoms.u_t_data = [];
        uoms.add = true;
        this.setState({ uoms });
        uoms.u_t_data = await new_uom_arr;
        this.setState({ uoms });




    }
    manufactureStructure() {

        return structure_format;
    }
    async   cancelNewManufacture() {


        var uoms = { ...this.state.uoms };

        var new_uom_arr = [];
        for (var i = 1; i < uoms.u_t_data.length; i++) {
            uoms.u_t_data[i].id = i - 1;
            new_uom_arr.push(uoms.u_t_data[i]);

        }
        uoms.u_t_data = [];
        uoms.add = false;
        this.setState({ uoms });
        uoms.u_t_data = await new_uom_arr;
        this.setState({ uoms });
        this.setState({ open_new_u_cancel: false });


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

            withFirstAndLast: false,
        };

        const new_save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_uom_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_uom_upload: false, open_new_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_uom_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_uom_upload: true }), this.newSaveUomsDetails())}

            />,
        ];

        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_uom_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_uom_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_uom_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_uom_upload: true }), this.saveUomsDetails())}

            />,
        ];
        const actions_cancel = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ open_new_u_cancel: false })}
            />,
            <FlatButton

                label="Yes"
                primary={true}
                onClick={this.cancelNewManufacture.bind(this)}

            />,
        ];
        return (
            <div>
                <div className="was-validated">
                    {this.state.uoms.u_t_data.length == 0 ?
                        //  <div class="spinner"></div>
                        <div class="sk-folding-cube">
                            <div class="sk-cube1 sk-cube"></div>
                            <div class="sk-cube2 sk-cube"></div>
                            <div class="sk-cube4 sk-cube"></div>
                            <div class="sk-cube3 sk-cube"></div>
                        </div>
                        : null}
                    {this.state.uoms.u_t_data.length != 0 ?
                        <Row className="user-div" >
                            <div style={{ 'overflow-x': 'scroll' }} >
                                <Col xs="12" md="12">
                                    <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                        <CardBody className="">

                                            <BootstrapTable data={this.state.uoms.u_t_data} className="user-table"
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

                                                <TableHeaderColumn tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='id' editable={false} expandable={false} className="pos" rowSpan='2' width='61' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                                                    <div class="product-float-action-fixed2">
                                                        <div class="add-margin-top">
                                                            <FloatingActionButton backgroundColor="green" mini={true} zDepth={2} onClick={this.addNewUomsLine.bind(this)}>
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

                                                <TableHeaderColumn dataField='parent_name' dataAlign="center" width="220" row="0" >Parent Name
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "parent_name", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "parent_name", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>


                                                <TableHeaderColumn dataField='multiplier' expandable={false} row="0" dataAlign="center" width="320"  >Multiplier
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "multiplier", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "multiplier", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='code' expandable={false} row="0" dataAlign="center" width="320"  >Code
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "code", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "code", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='dimension' expandable={false} row="0" dataAlign="center" width="320"  >Dimension
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "dimension", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "dimension", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>

                                                <TableHeaderColumn dataField='description' expandable={false} row="0" dataAlign="center" width="320"  >Description
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "description", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "description", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>




                                                <TableHeaderColumn dataAlign="center" width="300" dataField='name' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Name' }} dataFormat={this.tableInputNameField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='parent_name' expandable={false} dataAlign="center" width="299" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a parent' }} dataFormat={this.tableInputParentName.bind(this)}></TableHeaderColumn>


                                                <TableHeaderColumn dataField='multiplier' dataAlign="center" width="150" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a multiplier' }} dataFormat={this.tableInputMultiplier.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='code' dataAlign="center" width="250" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a code' }} dataFormat={this.tableInputSelectCode.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='dimension' dataAlign="center" width="250" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a dimension' }} dataFormat={this.tableInputSelectDimension.bind(this)}> </TableHeaderColumn>
                                                <TableHeaderColumn dataField='description' dataAlign="center" width="500" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a description' }} dataFormat={this.tableInputDescription.bind(this)}> </TableHeaderColumn>

                                            </BootstrapTable>




                                        </CardBody>

                                    </Card>
                                </Col>
                            </div>
                        </Row> : null}

                    <Snackbar
                        open={this.state.open}
                        message="Please Fill Required Fields"
                        style={{ color: 'white', 'background-color': 'red !important' }}
                        bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                        style={{ top: 0, height: 0 }}
                        autoHideDuration={6000}
                        onRequestClose={() => this.setState({ open: false })}
                    />
                    <Dialog actions={new_save_action} modal={false} open={this.state.open_new_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_new_save_dialog: false })}>
                        {this.state.open_uom_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                    </Dialog>

                    <Dialog actions={save_action} modal={false} open={this.state.open_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                        {this.state.open_uom_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                    </Dialog>
                    <Dialog actions={actions_cancel} modal={false} open={this.state.open_new_u_cancel} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_new_u_cancel: false })}>
                        Do you want to cancel the Uoms ?
                </Dialog>

                </div>
            </div>
        );
    }
}



export default UomsView;