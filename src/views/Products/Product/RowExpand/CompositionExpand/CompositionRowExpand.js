
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

import Snackbar from 'material-ui/Snackbar';

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


class CompositionRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            compositions: {
                c_table_data: this.props.data.composition_expand_data,

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

        //add new composition
        this.addNewComposition = this.addNewComposition.bind(this);

        // delete
        this.deleteComposition = this.deleteComposition.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data.composition_expand_data != null) {
            var compositions = { ...this.state.compositions };
            compositions.c_table_data = nextProps.data.composition_expand_data;

            if (compositions.c_table_data.length == 0) {
                var new_row = {
                    id: 0,
                    chemical: '',
                    quantity: ''
                };
                compositions.c_table_data.push(new_row);
            }


            this.setState({ compositions });
        }
    }
    async  componentWillMount() {

        if (this.props.data.composition_expand_data != null) {
            var compositions = { ...this.state.compositions }
            compositions.c_table_data = this.props.data.composition_expand_data;
            if (compositions.c_table_data.length == 0) {
                var new_row = {
                    id: 0,
                    chemical: '',
                    quantity: ''
                };
                compositions.c_table_data.push(new_row);
            }

            this.setState({ compositions });
        }

    }


    // coustom input field            start
    async openSaveData(event) {
        var export_comp = [];
        var compositionnameqty = '';
        var compositions = { ...this.state.compositions };
        for (var i = 0; i < compositions.c_table_data.length; i++) {
            if (compositions.c_table_data[i].chemical != "" && compositions.c_table_data[i].quantity != "") {

                compositionnameqty += compositions.c_table_data[i].chemical + ',';
                export_comp.push(compositions.c_table_data[i]);
            }
        }
        console.log(export_comp);
        this.props.onChangeValue(await export_comp, compositionnameqty);

        this.setState({ save_open: false });
    }
    validateComposition(event) {
        var compositions = { ...this.state.compositions };
        if (!compositions.c_table_data.length) {
            this.setState({ open: true });
            return;
        }

        for (var i = 0; i < compositions.c_table_data.length; i++)
            if (compositions.c_table_data[i].chemical.trim() == "" || compositions.c_table_data[i].quantity.trim() == "") {
                this.setState({ open: true });
                return;
            }
        this.setState({ save_open: true })
    }
    //add new composition
    addNewComposition(event) {
        var compositions = { ...this.state.compositions };
        var len = compositions.c_table_data.length;
        if (parseInt(len) != 0)
            if (compositions.c_table_data[len - 1].chemical.trim() == "" || compositions.c_table_data[len - 1].quantity.trim() == "") {
                this.setState({ open: true });
                return;
            }

        var new_row = {
            id: len,
            chemical: '',
            quantity: ''
        };
        compositions.c_table_data.push(new_row);
        this.setState({ compositions });
    }
    //delete
    deleteComposition(rowData, event) {
        var compositions = { ...this.state.compositions };
        console.log(rowData)
        var len = compositions.c_table_data.length;
        var not_d_comp_arr = [];
        for (var i = 0, k = 0; i < len; i++) {
            if (rowData.id != i) {
                compositions.c_table_data[i].id = k;
                not_d_comp_arr.push(compositions.c_table_data[i]);
            }
        }

        compositions.c_table_data = not_d_comp_arr;
        this.setState({ compositions });

    }

    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        return (
            <i class="material-icons" onClick={this.deleteComposition.bind(this, rowData)} style={{ color: 'grey' }}>delete</i>

            // <IconMenu
            //     className="wert"
            //     iconButtonElement={<IconButton iconClassName="material-icons"
            //         className="iconbutton-height" iconStyle={{ color: 'grey' }}>view_module</IconButton>}
            //     anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            //     targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            // >
            //     <MenuItem primaryText="Save"
            //         className="menu-style"
            //         leftIcon={<IconButton

            //             iconClassName="material-icons"
            //             iconStyle={{ margin: '0px !important', color: '#263238' }}
            //             style={{ 'height': '0px', margin: '0px !important' }} >
            //             save
            //         </IconButton>}
            //         onClick={() => this.setState({ save_open: true, savedata: rowData })}
            //     />




            // </IconMenu>



        )

    }//------------------------------------------end

    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }


    tableInputSlugField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
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

        if (this.props.data) {
            var hght = this.state.compositions.c_table_data.length;

            if (parseInt(hght) <= 1)
                hght = 116;
            else {
                hght = (parseInt(hght) - 1) * 45;
                hght += 116;

            }
            hght += "px";


            return (
                <div class="row">
                    <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: hght }} >

                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateComposition.bind(this)}></i>


                        </div>
                        <br />
                        <br />
                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => (this.props.onCancel())}></i>
                        </div>


                    </div>

                    <div class="col-lg-12">


                        <div style={{ 'margin-left': '1396px' }}>
                            <BootstrapTable width='190' data={this.state.compositions.c_table_data} condensed


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
                                <TableHeaderColumn dataAlign='center' width="60" dataField='chemical' expandable={false} isKey={true} dataFormat={this.customActionMenu} >
                                    <i class="material-icons" onClick={this.addNewComposition.bind(this)} style={{ color: 'grey' }}>add</i>

                                </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='chemical' expandable={false} dataFormat={this.tableInputNameField} >Chemical Name    </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='quantity' expandable={false} dataFormat={this.tableInputSlugField}>quantity </TableHeaderColumn>
                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>
                                Do you want to Save ?
                </Dialog>
                            <Snackbar
                                open={this.state.open}
                                message="Please Fill Required Fields"
                                autoHideDuration={6000}
                                style={{ color: 'white', 'background-color': 'red !important' }}
                                style={{ top: 0, height: 0 }}
                                bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}

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
export default CompositionRowExpand;