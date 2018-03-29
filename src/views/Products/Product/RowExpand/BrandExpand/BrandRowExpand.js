
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from '../../Fetch/RestApi';
import ManufactureRowExpand from './ManufactureRowExpand'
import Db from '../../DataHandling/DB';
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

var fund = 1;
class BrandRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: {
                brands_dropdown: this.props.data.brands_dropdown,//brands drop down
                brand_expand_data: this.props.data.brand_expand_data,//brand expand data
                b_table_data: [],
                brand_expand_open: [-1],//brand expand open 
                save: false,

            },
            manufacturers: {
                m_drop_down: this.props.data.m_drop_down,
                m_expand_open: [-1],//brand expand open
                manufacture_expand_data: '',//manufacture  

            },
            save_open: false,
        };
        //save function 
        this.openSaveData = this.openSaveData.bind(this);

        //  select onchange function
        this.updateNewBrand = this.updateNewBrand.bind(this);
        this.changeManufactureBrand = this.changeManufactureBrand.bind(this);
        // table intput actions--------------------------------------start
        this.tableInputBrandField = this.tableInputBrandField.bind(this);
        this.tableInputParentField = this.tableInputParentField.bind(this);
        this.tableInputManufactureField = this.tableInputManufactureField.bind(this);
        this.tableInputAction = this.tableInputAction.bind(this);

        //bootstrap expand row handling
        this.isExpandableRow = this.isExpandableRow.bind(this);
        this.expandComponent = this.expandComponent.bind(this);
        // onValueClick
        this.isManufactureExpand = this.isManufactureExpand.bind(this);
        //expand component
        this.handleManuChangeValue = this.handleManuChangeValue.bind(this);
    }
    async fetchManufacturersResponse(json) {
        var m_drop_down = [];
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            m_drop_down.push(data);

        }
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.m_drop_down = await m_drop_down;
        this.setState({ manufacturers });
    }
    async componentWillReceiveProps(nextProps) {
        // console.log("nextprops", nextProps);
        if (nextProps.data.brands_dropdown.length != 0) {
            var brands = { ...this.state.brands };
            brands.brands_dropdown = nextProps.data.brands_dropdown;
            //    this.setState({brands});

            var b_table_object = nextProps.data.brand_expand_data;
            if (b_table_object.parent != null)
                b_table_object.parent_name = b_table_object.parent.name;
            else
                b_table_object.parent_name = "---";
            if (b_table_object.slug == null) {
                var slug = "";
                b_table_object.name.split(' ').map((data) => {
                   if(data !="")   slug += data + "-";
                });
                if (slug != "")
                    slug = slug.substring(0, slug.length - 1);

                b_table_object.slug = slug.toLowerCase();

            }

            brands.b_table_data = [b_table_object];
            this.setState({ brands });


        }




    }
    async  componentWillMount() {


        if (this.props.data != null) {
            var brands = { ...this.state.brands };

            var b_table_object = this.props.data.brand_expand_data;
            b_table_object.org_name = b_table_object.organization.name;//orgname
            //address
            
            b_table_object.org_address_address = b_table_object.organization.address[0]._address;
            b_table_object.org_address_tags = b_table_object.organization.address[0].tags;
            //emails
            b_table_object.org_emails_id=b_table_object.organization.emails[0].id;
            b_table_object.org_emails_tags=b_table_object.organization.emails[0].tags;

            //phone
            b_table_object.org_phones_id=b_table_object.organization.phones[0].id;
            b_table_object.org_phones_tags=b_table_object.organization.phones[0].tags;
                      

            


            if (b_table_object.parent != null)
                b_table_object.parent_name = b_table_object.parent.name;
            else
                b_table_object.parent_name = "---";


            brands.b_table_data = [b_table_object];
            if (b_table_object.slug == null) {
                var slug = "";
                b_table_object.name.split(' ').map((data) => {
                   if(data !="")   slug += data + "-";
                });
                if (slug != "")
                    slug = slug.substring(0, slug.length - 1);
                b_table_object.slug = slug;

            }
            this.setState({ brands });
            var manufactures = { ...this.state.manufacturers };
            manufactures.m_drop_down = this.props.data.m_drop_down;
            //console.log(manufactures.m_drop_down);
            this.setState({ manufactures });


        }
    }
    // openSaveData -------------------------------------------------------start
    openSaveData(event) {
        //console.log("save", this.state.brands.brand_expand_data);
        //      console.log("save-table", this.state.brands.b_table_data[0]);
        var data = this.state.brands.b_table_data[0];
        data.meta.lastModified.time = Math.round(new Date().getTime());
        this.setState({ save_open: false });
        var name = "";
        data.name.split(' ').map((data) => {
            name += data + "-";
        });
        if (name != "")
            name = name.substring(0, name.length - 1);

        //    console.log(name);

        var b_updated = {
            id: data.name,
            name: data.name,
            meta: data.meta,
            organization: data.organization,
            parent: data.parent,
            tags: data.tags,
            slug: name,
        };
        this.props.onChangeValue(data);
        //  console.log("save", b_updated);
        // fetch(RestApi.isFetch("brands/" + data.refId), RestApi.getPatchMethod(b_updated)).then(response => {//products fetch
        //     if (response.ok) {
        //         response.json().then(json => {
        //             //   console.log(json)
        //             this.props.onChangeValue(data);

        //         });
        //     }
        //     else
        //         this.props.history.replace('/login');
        // }).catch(function (error) { console.log(error); });//end


    }

    //brand table custom edit
    updateNewBrand(rowData, event) {

        var brands = { ...this.state.brands };

        var b_table_object = event;
        b_table_object.org_name = b_table_object.organization.name;
        if (b_table_object.parent != null)
            b_table_object.parent_name = b_table_object.parent.name;
        else
            b_table_object.parent_name = "---";
        if (b_table_object.slug == null) {
            var slug = "";
            b_table_object.name.split(' ').map((data) => {
               if(data !="")   slug += data + "-";
            });
            if (slug != "")
                slug = slug.substring(0, slug.length - 1);
            b_table_object.slug = slug;

        }

        brands.b_table_data = [b_table_object];
        brands.save = true;
        this.setState({ brands });
    }
    tableInputBrandField(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                options={this.state.brands.brands_dropdown}
                clearable={false}
                value={rowData.name}
                //onOpen={this.fetchBrand.bind(this, rowData)}
                // onValueClick={this.isBrandExpand.bind(this, rowData)}
                onChange={this.updateNewBrand.bind(this, rowData)}
            />
        );
        // return (
        //     <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // );
    }
    tableInputTagsField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputParentField(cellValue, rowData, nothing, cellFeild) {

        // return (
        //     <Select
        //         onChange={this.updateNewBrand.bind(this, rowData)}
        //         options={this.state.brands.brands_dropdown}
        //         value={rowData.parent_name}
        //     />
        // );
        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    async isManufactureExpand(rowData, event)//brand expand
    {
        //console.log(rowData, event);
        // for (var i = 0; i < this.state.manufacturers.m_drop_down.length; i++) {
        //     if (event.refId == this.state.manufacturers.m_drop_down[i].refId) {
        //         var manufacturers = { ...this.state.manufacturers };
        //         manufacturers.m_expand_open = [rowData.refId];
        //         manufacturers.manufacture_expand_data = await this.state.manufacturers.m_drop_down[i];
        //         this.setState({ manufacturers });
        //         break;
        //         // console.log("find");


        //     }
        // }
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.m_expand_open = [rowData.refId];
        manufacturers.manufacture_expand_data = rowData.organization;
        this.setState({ manufacturers });


    }
    async changeManufactureBrand(rowData, event) {
        if (event != null) {
            // console.log(event);

            rowData.org_name = event.name;
            var organization = {};
            organization.name = event.name;
            organization.contact = event.contact;

            var brand = { ...this.state.brands };
            brand.brand_expand_data.organization = organization;
            this.setState({ brand });
            var manufacturers = { ...this.state.manufacturers };
            manufacturers.m_expand_open = [rowData.id];
            manufacturers.manufacture_expand_data = await event;
            this.setState({ manufacturers });
        }

    }

    tableInputManufactureField(cellValue, rowData, nothing, cellFeild) {
        // console.log("manu", this.state.manufacturers);
        return (
            <div class="input-group">
                <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    <i class="material-icons" onClick={this.isManufactureExpand.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
            // <Select
            //     onChange={this.changeManufactureBrand.bind(this, rowData)}
            //     onValueClick={this.isManufactureExpand.bind(this, rowData)}

            //     options={this.state.manufacturers.m_drop_down}
            //     value={rowData.org_name}
            // />
        );
    }
    tableInputAction(cellValue, rowData, nothing, cellFeild)//action button
    {
        return (
            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
        );

    }
    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    handleManuChangeValue(event) {

        // console.log("brand", event);
        for (var i = 0; i < this.state.manufacturers.m_drop_down.length; i++) {
            if (event.refId == this.state.manufacturers.m_drop_down[i].refId) {
                var organization = { contact: event.contact, name: event.name };
                var brands = { ...this.state.brands };
                brands.brand_expand_data.organization = organization;
                brands.brand_expand_data.org_name = event.name;
                //     brands.b_table_data[this.state.manufacturers.m_expand_open].org_name=event.name;
                this.setState({ brands });

                var manufacture = { ...this.state.manufacturers };
                manufacture.m_drop_down[i] = event;

                this.setState({ manufacture });
                // console.log(this.state.brands);
                // console.log(this.state.manufacturers);


            }
        }

    }
    expandComponent(row) {
        if (this.state.manufacturers.m_expand_open != -1)
            return (
                // <div>Loading.....</div>

                <ManufactureRowExpand data={this.state.manufacturers} onChangeValue={this.handleManuChangeValue} />
            );
        else {
            return (
                <div>Loading.....</div>
            )
        }

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
            const options = {

                expandBy: 'column',  // Currently, available value is row and column, default is row,

                expanding: this.state.manufacturers.m_expand_open,
            };

            return (
                <Row  >
                    <Col md="1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "90px" }} >

                        {this.state.brands.save == true ? <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
                            <br />
                        </div> : null}
                        <br />
                        <br />

                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="material-icons" onClick={() => (this.props.onCancel())}>cancel</i>
                        </div>

                    </Col>
                    <Col md="11">

                        <div style={{ 'margin-left': '58px' }}>
                            <BootstrapTable width='300' data={this.state.brands.b_table_data} condensed

                                expandableRow={this.isExpandableRow}
                                expandComponent={this.expandComponent}
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
                                <TableHeaderColumn dataAlign='center' width="100" hidden dataField='refId' expandable={false} isKey={true} dataFormat={this.tableInputAction}  >Id
                        </TableHeaderColumn>


                                <TableHeaderColumn dataAlign='center' dataField='name' expandable={false} expandable={false} dataFormat={this.tableInputBrandField} >Brand Name
                    </TableHeaderColumn>



                                <TableHeaderColumn dataAlign='center' dataField='parent_name' expandable={false} dataFormat={this.tableInputParentField}>Parent Name
                    </TableHeaderColumn>



                                <TableHeaderColumn dataAlign='center' width="400" tdStyle={{ whiteSpace: 'normal' }} dataField='org_name' expandable={false} dataFormat={this.tableInputManufactureField}> Organization Name
                    </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='tags' expandable={false} dataFormat={this.tableInputTagsField} >Tags
                        </TableHeaderColumn>





                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>
                                Do you want to Save ?
                </Dialog>
                        </div>
                    </Col>

                </Row  >

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