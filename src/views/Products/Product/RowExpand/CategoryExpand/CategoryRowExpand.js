
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

import Snackbar from 'material-ui/Snackbar';

class BrandRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {
                category_dropdown: this.props.data.category_dropdown,//brands drop down
                category_expand_data: this.props.data.category_expand_data,//brand expand data
                c_table_data: this.props.data.category_expand_data,
                category_expand_open: this.props.data.category_expand_open,
            },
            save_open: false,
            savedata: '',

        };
        //save data
        this.openSaveData = this.openSaveData.bind(this);
        //custom input 
        this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputSlugField = this.tableInputSlugField.bind(this);
        this.customActionMenu = this.customActionMenu.bind(this);
        this.openDialogAvtiveInactive = this.openDialogAvtiveInactive.bind(this);

        // category
        this.updateProductCategory = this.updateProductCategory.bind(this);
    }
    componentWillReceiveProps(nextProps) {


        // console.log(nextProps.data);
        if (nextProps.data.category_expand_data != null) {
            var categories = { ...this.state.categories };
            category_expand_open: nextProps.data.category_expand_open,

                categories.c_table_data = nextProps.data.category_expand_data;
            categories.category_dropdown = nextProps.data.category_dropdown;//brands drop down
            categories.category_expand_data = nextProps.data.category_expand_data;//brand expand data
            this.setState({ categories });
        }

    }
    async  componentWillMount() {


        if (this.state.categories.category_expand_data != 0) {
            // console.log(this.state.categories)

            var categories = { ...this.state.categories };
            categories.c_table_data = this.props.data.category_expand_data;
            categories.category_dropdown = this.props.data.category_dropdown;//brands drop down
            categories.category_expand_data = this.props.data.category_expand_data;
            this.setState({ categories });

        }
    }

    // inactive/active

    async openDialogAvtiveInactive(event) {//save active/ inactive 
        // console.log(this.state.rowData);
        await RestApi.setToken();

        var satatus = "";
        if (this.state.rowData.status == "active") {
            this.state.rowData.status = "inactive";

        }
        else
            this.state.rowData.status = "active"
        var data = {
            status: this.state.rowData.status
        }
        fetch(RestApi.isFetch("categories/" + this.state.rowData.refId + "/status"), RestApi.getPatchMethod(data)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        this.setState({ show_activeinactive: false });//close the dialog box
        //    alert(rowData.status);
    }
    // coustom input field            start
    openSaveData(event) {


        this.props.onChangeValue(this.state.categories.category_expand_data);
        this.setState({ save_open: false });
    }
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
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
                    onClick={() => this.setState({ save_open: true, savedata: rowData })}
                />


                {rowData.status == "active" ?
                    <MenuItem primaryText="Deactivate"
                        className="menu-style"
                        leftIcon={<Checkbox
                            checkedIcon={<Visibility />}
                            uncheckedIcon={<VisibilityOff />}
                            defaultChecked


                        />} onClick={() => this.setState({ show_activeinactive: true, rowData: rowData, row_status: "Deactivate", categoryname: rowData.name })} /> : <MenuItem primaryText="Activate"
                            className="menu-style"
                            leftIcon={<Checkbox
                                checkedIcon={<Visibility />}
                                uncheckedIcon={<VisibilityOff />}
                            />} onClick={() => this.setState({ show_activeinactive: true, rowData: rowData, row_status: "Activate", categoryname: rowData.name })} />



                    /* onCheck={this.create_name_editor.bind(this,row)} */




                }

            </IconMenu>



        )

    }//------------------------------------------end

    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputTagsField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputSlugField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );

    }
    async updateProductCategory(data) {
        if (data != null) {
            // console.log(data);
            var cat_arr = [];
            var cat_name = "";

            for (var i in data) {
                var update_cat = {
                    refId: data[i].refId,
                    _id: data[i]._id,
                    label: data[i].value,
                    value: data[i].value,
                    name: data[i].name,
                    tags: data[i].tags,
                    status: data[i].status,
                    id: i,

                };
                var slug = "";
                data[i].name.split(' ').map((data) => {

                    if (data != "") slug += data + "-";
                    //  console.log(data);
                });

                slug = slug.substring(0, slug.length - 1);
                slug = slug.toLowerCase();
                update_cat.slug = slug;
                cat_name += data[i].name + ",";
                cat_arr.push(update_cat);
            }




            var categories = { ...this.state.categories };
            // categories.category_expand_open = [rowData.id];
            categories.category_expand_data = await cat_arr;
            this.props.unsavedData(cat_arr);
            categories.c_table_data = await cat_arr;
            this.setState({ categories });
            //  await this.update_expand(rowData, data);

        }

        this.props.saved(false);



    }
    validateCategory() {
        if (this.state.categories.c_table_data.length != 0)
            this.setState({ save_open: true });
        else
            this.setState({ open: true });

    }
    render() {
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
        const actions1 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.state.show_activeinactive = false}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openDialogAvtiveInactive}

            />,
        ];

        if (this.props.data) {

            var hght = this.state.categories.c_table_data.length;

            if (parseInt(hght) <= 1)
                hght = 116;
            else {
                hght = (parseInt(hght) - 1) * 45;
                hght += 116;

            }
            hght += "px";

            // console.log(this.state.categories);
            return (
                <div class="row">
                    <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: hght }} >
                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                            <i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateCategory.bind(this)}></i>
                            <br />
                        </div>
                        <br />
                        <br />

                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => (this.props.onCancel())}></i>
                        </div>

                    </div>
                    <div class="col-lg-11">


                        <div style={{ 'margin-left': '1118px' }}>
                            <div class="row">
                                <div class="col-lg-3">

                                    <Select
                                        //options={brand_options}
                                        //   onOpen={this.isCategoryExpand.bind(this, rowData)}
                                        style={{ 'border-color': this.state.categories.category_expand_data.length != 0 ? 'green' : 'red' }}
                                        onChange={this.updateProductCategory.bind(this)}
                                        multi
                                        placeholder="--select Categories--"
                                        value={this.state.categories.category_expand_data}
                                        options={this.state.categories.category_dropdown}



                                    />
                                </div>
                            </div>

                            <BootstrapTable width='190' data={this.state.categories.c_table_data} condensed


                                hover
                                version="4"
                                ref='table'
                                tableHeaderClass='bgclr'
                                tableBodyClass='bgclr'
                                containerClass='bgclr with-t'
                                tableContainerClass='bgclr'
                                headerContainerClass='bgclr'
                                bodyContainerClass='row-overflow'
                            >
                                {/* <TableHeaderColumn dataAlign='center' width="60" dataField='name' expandable={false} isKey={true} dataFormat={this.customActionMenu} > */}
                                {/* <TableHeaderColumn dataAlign='center' width="60" dataField='name' expandable={false} isKey={true}  >
                        </TableHeaderColumn> */}

                                <TableHeaderColumn dataAlign='center' dataField='name' isKey expandable={false} dataFormat={this.tableInputNameField} >Name
                        </TableHeaderColumn>

                                {/* <TableHeaderColumn dataAlign='center' dataField='slug' expandable={false} dataFormat={this.tableInputSlugField}>Slug
                    </TableHeaderColumn> */}

                                <TableHeaderColumn dataAlign='center' dataField='tags' expandable={false} dataFormat={this.tableInputTagsField}>Tags
                    </TableHeaderColumn>









                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>
                                Do you want to add category to product ?
                </Dialog>
                            <Dialog actions={actions1} modal={false} open={this.state.show_activeinactive} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.state.show_activeinactive = false}>
                                Do you want to {this.state.row_status} the Category '{this.state.categoryname}'
                    </Dialog>
                            <Snackbar
                                open={this.state.open}

                                message="Please select categories"
                                style={{ color: 'white', 'background-color': 'red !important' }}
                                style={{ top: 0, height: 0 }}
                                bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}

                                autoHideDuration={6000}
                                onRequestClose={() => this.setState({ open: false })}
                            />
                        </div>
                    </div>


                </div  >
            )
        }
        else {
            return (
                <div>Loading.....</div>
            )
        }
    }
}
export default BrandRowExpand;