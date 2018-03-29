
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
// import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button


class BrandRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manufacturers: {
                manufacture_dropdown: this.props.data.m_drop_down,//brands drop down
                manufacture_expand_data: this.props.data.manufacture_expand_data,//brand expand data
                m_table_data: [],
            },
            save_open: false,
        };
        //table input format
        this.tableInputAction = this.tableInputAction.bind(this);
        this.tableInputIdField = this.tableInputIdField.bind(this);
        this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputIdField = this.tableInputIdField.bind(this);
        this.tableInputCityField = this.tableInputCityField.bind(this);
        this.tableInputStateField = this.tableInputStateField.bind(this);
        //save function 
        this.openSaveData = this.openSaveData.bind(this);

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            var manufacturers = { ...this.state.manufacturers };

            // console.log(nextProps)
            manufacturers.m_table_data = nextProps.data;
            this.setState({ manufacturers });
        }


    }

    componentWillMount() {

        if (this.props.data != null) {
            // console.log(this.props.data);
            var manufacturers = { ...this.state.manufacturers };


            manufacturers.m_table_data = this.props.data;
            this.setState({ manufacturers });
        }

    }
    // openSaveData -------------------------------------------------------start
    async openSaveData(event) {
        await RestApi.setToken();

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
    tableInputCityField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputStateField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
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
        if (this.props.data != null) {

            return (
                <div class="row">
                    <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >


                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => this.props.onCancel()}></i>
                        </div>




                    </div>
                    <div class="col-lg-12">


                        <div style={{ 'margin-left': '1817px' }}>
                            <BootstrapTable width='190' data={this.state.manufacturers.m_table_data} condensed


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

                                <TableHeaderColumn dataAlign='center' dataField='name' width="180" isKey={true} expandable={false} dataFormat={this.tableInputNameField} > Name
                                </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='city' width="130" expandable={false} dataFormat={this.tableInputCityField}>City
                                </TableHeaderColumn>



                                <TableHeaderColumn dataAlign='center' width="130" tdStyle={{ whiteSpace: 'normal' }} dataField='state' expandable={false} dataFormat={this.tableInputStateField}> State
                                </TableHeaderColumn>





                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>
                                Do you want to Save {this.state.manufacturers.m_table_data[0].name}?
                </Dialog>
                        </div>
                    </div>
                </div>


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