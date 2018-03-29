
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
import Spinner from 'react-spinkit';


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


const manufacture_url = "manufacturers"
class AddManufactureRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manufacture: {
                m_t_data: []
            }
        };

    }
    initializeManufacture() {
        var manu_store_table = {
            name: '',
            city: '',
            state: ''
        };
        var manufacture = { ...this.state.manufacture };
        manufacture.m_t_data = [manu_store_table];
        this.setState({ manufacture });

    }

    async componentWillMount() {
        await this.initializeManufacture();
    }


    async  componentWillReceiveProps(nextProps) {
        await this.initializeManufacture();

    }
    async openSaveData(event) {
        await RestApi.setToken();

        var manufacture = this.state.manufacture.m_t_data[0];

        var slug = "";
        manufacture.name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
        });
        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        var meta = {
            created: {
                source: "cli",
                time: Math.round(new Date().getTime()),
                user: 'S',
            },
            lastModified: {
                source: "cli",
                time: Math.round(new Date().getTime()),
                user: 'S',

            },
            id: '',
            entity: "manufacturer"
        };
        var address = { city: manufacture.city, state: manufacture.state };
        var store_manu_obj = {
            contact: { address: [address] },
            id: slug,
            slug: slug,
            meta: meta,
            name: manufacture.name,
            tags: ["Healthcare", "Medical", "Pharmaceutical"],
        };
        // console.log(store_manu_obj);
        await fetch(RestApi.isFetch(manufacture_url), RestApi.getPostMethod(store_manu_obj)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    store_manu_obj.refId = json.name;
                    store_manu_obj.label = store_manu_obj.name;
                    store_manu_obj.value = store_manu_obj.name;
                    store_manu_obj.city = manufacture.city.city;
                    store_manu_obj.state = manufacture.city.state;
                    this.props.onChangeValue(store_manu_obj, false);
                    this.setState({ save_open: false, start_saving: false });


                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    validateManufacture(event) {
        var manufacture = this.state.manufacture.m_t_data[0];

        if (manufacture.name.trim() != "" && manufacture.city.trim() != "" && manufacture.state.trim() != "") {
            this.setState({ save_open: true });

        }
        else {
            this.setState({ open_fill_error: true });

            this.setState({ save_open: false });
        }
    }

    // inputfields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputCityField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputStateField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }



    render() {
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
                onClick={() => (this.setState({ start_saving: true }), this.openSaveData(this))}

            />,
        ];
        return (
            <div class="row">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >
                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateManufacture.bind(this)}></i>
                    </div>
                    <br />
                    <br />

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => this.props.onCancel()}></i>
                    </div>
                </div>
                <div class="col-lg-12 was-validated"  >


                    <div style={{ 'margin-left': '1817px' }}>
                        <BootstrapTable width='190' data={this.state.manufacture.m_t_data} condensed


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
                            {/* <TableHeaderColumn dataAlign='center' width="50" dataField='id'  expandable={false} isKey={true} dataFormat={this.tableInputAction} > */}
                            {/* </TableHeaderColumn> */}


                            {/* <TableHeaderColumn dataAlign='center' dataField='id' expandable={false} expandable={false} dataFormat={this.tableInputIdField} >id
                         </TableHeaderColumn> */}

                            <TableHeaderColumn dataAlign='center' dataField='name' width="180" isKey={true} expandable={false} dataFormat={this.tableInputNameField.bind(this)} > Name
                        </TableHeaderColumn>

                            <TableHeaderColumn dataAlign='center' dataField='city' width="130" expandable={false} dataFormat={this.tableInputCityField.bind(this)}>City
                        </TableHeaderColumn>



                            <TableHeaderColumn dataAlign='center' width="130" tdStyle={{ whiteSpace: 'normal' }} dataField='state' expandable={false} dataFormat={this.tableInputStateField.bind(this)}> State
                        </TableHeaderColumn>





                        </BootstrapTable>
                        <Snackbar
                            open={this.state.open_fill_error}
                            message="Please Fill all required fields"
                            autoHideDuration={4000}
                            style={{ color: 'white', 'background-color': 'red !important' }}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            style={{ top: 0, height: 0 }}

                            onRequestClose={() => this.setState({ open_fill_error: false })}
                        />
                        <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.setState({ save_open: false })}>
                            {this.state.start_saving != true ? "\'" + this.state.manufacture.m_t_data[0].name + "\'  will be associated for the product. Do you want to continue?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                        </Dialog>
                    </div>
                </div>
            </div>
        );
    }
}

AddManufactureRowExpand.propTypes = {

};

export default AddManufactureRowExpand;