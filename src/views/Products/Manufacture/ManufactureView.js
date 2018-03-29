import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import RestApi from './Fetch/RestApi';

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

const manufacture_url = "manufacturers";
var sortorder = false;

class ManufactureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manufacturers: {
                m_t_data: [],
                all_manu: [],
                add: false
            },
            sortorder: false,
            drop_val: 25,


        };
    }
    async fetchManufactureResponse(json) {
        var arr_manu = [], f_all_arr = [];
        var id = 0;
        for (var key in json) {
            var data = json[key];
            f_all_arr.push(json[key]);
            data.id = id++;
            data.name = data.name;
            data.refId = key;
            data.city = data.contact.address[0].city;
            data.state = data.contact.address[0].state;
            arr_manu.push(data);
        }
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.m_t_data = await arr_manu;
        manufacturers.all_manu = await arr_manu;

        this.setState({ manufacturers });

    }
    async componentWillMount() {
        await RestApi.setToken();
        await fetch(RestApi.isFetch(manufacture_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchManufactureResponse(json);//response traversal

                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
    }
    async  saveManufactureDetails() {
        await RestApi.setToken();

        var manufacturers = { ...this.state.manufacturers };
        var manufacture = this.state.save_data;
        var save_manufacture = {
            id: this.nameToSlugConvert(manufacture.name),
            slug: this.nameToSlugConvert(manufacture.name),
            meta: this.setMeta(),
            name: manufacture.name,
            tags: ["Healthcare", "Medical", "Pharmaceutical"],
            contact: {
                address: [
                    {
                        city: manufacture.city,
                        state: manufacture.state,
                    }
                ]
            }

        };
        await fetch(RestApi.isFetch(manufacture_url), RestApi.getPostMethod(save_manufacture)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    manufacturers.m_t_data[0].refId = json.name;
                    manufacturers.add = false;
                    this.setState({ manufacturers });
                    this.setState({ open_save_dialog: false });
                    this.setState({ open_manu_upload: false });
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
            "entity": "manufacturer",
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
    validateManufacture(rowData) {
        this.setState({ save_data: rowData });

        if (rowData.name.trim() != "" && rowData.city.trim() != "" && rowData.state.trim() != "") {
            this.setState({ open_save_dialog: true });
            // alert("af")
        }
        else {


            this.setState({ open: true, open_save_dialog: false, open_manu_upload: false });


        }
    }
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        if (rowData.id == 0 && this.state.manufacturers.add == true)
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

                        onClick={this.validateManufacture.bind(this, rowData)}
                    />
                    <MenuItem primaryText="Cancel"
                        className="menu-style"
                        leftIcon={<IconButton

                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                            cancel
                    </IconButton>}

                        onClick={() => this.setState({ open_new_m_cancel: true })}
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
                // onClick={this.validateManufacture.bind(this,rowData)}
                />



            </IconMenu>



        )


    }//------------------------------------------end


    // inputfields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        if (this.state.manufacturers.add == true && rowData.id == 0)
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
    tableInputCityField(cellValue, rowData, nothing, cellFeild) {
        if (this.state.manufacturers.add == true && rowData.id == 0)
            return (
                <input defaultValue={cellValue} required className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputStateField(cellValue, rowData, nothing, cellFeild) {
        if (this.state.manufacturers.add == true && rowData.id == 0)
            return (
                <input defaultValue={cellValue} required className='filter text-filter form-control   ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }

    //sorting 
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
            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control readonly-bg input-sm' size='1' onChange={this.onToggleDropDown}>

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

    async addNewManufactureLine() {
        var manufacturers = { ...this.state.manufacturers };
        if (manufacturers.add == true) {
            this.setState({ open_new_m_cancel: true });
            return;
        }
        var structure_format = {
            id: 0,
            name: '',
            refId: '',
            city: '',
            state: ''
        };

        var new_man_arr = [];
        new_man_arr.push(structure_format);
        for (var i = 0; i < manufacturers.m_t_data.length; i++) {
            manufacturers.m_t_data[i].id = i + 1;
            new_man_arr.push(manufacturers.m_t_data[i]);

        }
        console.log(new_man_arr);
        manufacturers.m_t_data = [];
        manufacturers.add = true;
        this.setState({ manufacturers });
        manufacturers.m_t_data = await new_man_arr;
        this.setState({ manufacturers });




    }

    async   cancelNewManufacture() {
        var manufacturers = { ...this.state.manufacturers };

        var new_man_arr = [];
        for (var i = 1; i < manufacturers.m_t_data.length; i++) {
            manufacturers.m_t_data[i].id = i - 1;
            new_man_arr.push(manufacturers.m_t_data[i]);

        }
        manufacturers.m_t_data = [];
        manufacturers.add = false;
        this.setState({ manufacturers });
        manufacturers.m_t_data = await new_man_arr;
        this.setState({ manufacturers });
        this.setState({ open_new_m_cancel: false });


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

        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.open_manu_upload}

                label="No"
                primary={true}
                onClick={() => this.setState({ open_manu_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_manu_upload}

                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_manu_upload: true }), this.saveManufactureDetails())}

            />,
        ];
        const actions_cancel = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ open_new_m_cancel: false })}
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
                    {this.state.manufacturers.m_t_data.length == 0 ?
                        //  <div class="spinner"></div>
                        <div class="sk-folding-cube">
                            <div class="sk-cube1 sk-cube"></div>
                            <div class="sk-cube2 sk-cube"></div>
                            <div class="sk-cube4 sk-cube"></div>
                            <div class="sk-cube3 sk-cube"></div>
                        </div>
                        : null}
                    {this.state.manufacturers.m_t_data.length != 0 ?
                        <Row className="user-div" >
                            <div style={{ 'overflow-x': 'scroll' }} >
                                <Col xs="12" md="12">
                                    <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                        <CardBody className="">

                                            <BootstrapTable data={this.state.manufacturers.m_t_data} className="user-table"
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

                                                <TableHeaderColumn tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='id' editable={false} expandable={false} className="pos" rowSpan='2' width='55' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                                                    <div class="product-float-action-fixed">
                                                        <div class="add-margin-top">
                                                            <FloatingActionButton backgroundColor="green" mini={true} zDepth={2} onClick={this.addNewManufactureLine.bind(this)}>
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

                                                <TableHeaderColumn dataField='city' dataAlign="center" width="220" row="0" >City
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "city", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "city", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>


                                                <TableHeaderColumn dataField='state' expandable={false} row="0" dataAlign="center" width="320"  >State
                                            <IconMenu className="pull-right"
                                                        iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                        <MenuItem primaryText="ASC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "state", "asc")} />
                                                        <MenuItem primaryText="DESC" // save menu 
                                                            className="menuitem-style"
                                                            onClick={this.sorthandleBtnClick.bind(this, "state", "desc")} />
                                                    </IconMenu>
                                                </TableHeaderColumn>




                                                <TableHeaderColumn dataAlign="center" width="600" dataField='name' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Name' }} dataFormat={this.tableInputNameField.bind(this)}> </TableHeaderColumn>

                                                <TableHeaderColumn dataField='city' expandable={false} dataAlign="center" width="500" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a city' }} dataFormat={this.tableInputCityField.bind(this)}></TableHeaderColumn>


                                                <TableHeaderColumn dataField='state' dataAlign="center" width="500" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a state' }} dataFormat={this.tableInputStateField.bind(this)}> </TableHeaderColumn>

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
                        onRequestClose={() => this.setState({ open: false })}
                    />
                    <Dialog actions={save_action} modal={false} open={this.state.open_save_dialog} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                        {this.state.open_manu_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                    </Dialog>
                    <Dialog actions={actions_cancel} modal={false} open={this.state.open_new_m_cancel} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ open_new_m_cancel: false })}>
                        Do you want to cancel the manufacturer ?
                </Dialog>

                </div>
            </div>
        );
    }
}

ManufactureView.propTypes = {

};

export default ManufactureView;