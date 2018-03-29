
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'
import './style.css';

// Class import
import RestApi from '../../Fetch/RestApi';
import ManufactureRowExpand from '../BrandExpand/ManufactureRowExpand'
import Db from '../../DataHandling/DB';
import Store from '../../DataHandling/StoreFunctions';

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
class AddBrandRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: {
                brands_dropdown: this.props.data.brands_dropdown,//brands drop down
                brand_expand_data: this.props.data.brand_expand_data,//brand expand data
                b_table_data: [],
                brand_expand_open: [-1],//brand expand open 
                save: false,
                tags: [],

            },
            manufacturers: {
                m_drop_down: this.props.data.m_drop_down,
                m_expand_open: [-1],//brand expand open
                manufacture_expand_data: '',//manufacture  

            },
            save_open: false,
            add_t_product: false,
        };
        //save function 
        this.openSaveData = this.openSaveData.bind(this);

        // update product table
        this.openAddToProduct = this.openAddToProduct.bind(this);

        //  select onchange function
        this.addNewParent = this.addNewParent.bind(this);
        this.changeManufactureBrand = this.changeManufactureBrand.bind(this);
        this.changeTags = this.changeTags.bind(this);
        // table intput actions--------------------------------------start
        this.tableInputBrandField = this.tableInputBrandField.bind(this);
        this.tableInputParentField = this.tableInputParentField.bind(this);
        this.tableInputManufactureField = this.tableInputManufactureField.bind(this);
        this.tableInputAction = this.tableInputAction.bind(this);
        this.tableInputTagsSelectField = this.tableInputTagsSelectField.bind(this);

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
    async componentDidMount() {


    }
    async componentWillReceiveProps(nextProps) {
        this.state.brands.tags = await Store.BrandTags();
        console.log("nextprops", nextProps);
        if (nextProps.data.brands_dropdown.length != 0) {
            var brands = { ...this.state.brands };
            brands.brands_dropdown = nextProps.data.brands_dropdown;
            //    this.setState({brands});

            var b_table_object = {
                name: '',
                org_name: '',
                parent_name: '',
                tags: this.state.brands.tags,
            };

            brands.b_table_data = [b_table_object];
            this.setState({ brands });


        }




    }
    async  componentWillMount() {
        this.state.brands.tags = await Store.BrandTags();



        if (this.props.data != null) {
            var brands = { ...this.state.brands };

            var b_table_object = {
                name: '',
                org_name: '',
                parent_name: '',
                tags: this.state.brands.tags,
            };


            brands.b_table_data = [b_table_object];

            this.setState({ brands });
            var manufactures = { ...this.state.manufacturers };
            manufactures.m_drop_down = this.props.data.m_drop_down;


            console.log(manufactures.m_drop_down);
            this.setState({ manufactures })

        }
    }
    //add to product table
    openAddToProduct(event) {
        this.props.onChangeValue(this.state.brands.brands_dropdown, "1")

        this.setState({ add_t_product: false });
    }
    // openSaveData -------------------------------------------------------start
    openSaveData(event) {

        console.log("save-table", this.state.brands.b_table_data[0]);
        var data = this.state.brands.b_table_data[0];
        this.setState({ save_open: false });
        var tags = [];
        data.tags.map((data) => {
            tags.push(data.value);
        })
        var slug = "";
        data.name.split(' ').map((data) => {
           if(data !="")   slug += data + "-";
            //  console.log(data);
        });

        slug = slug.substring(0, slug.length - 1);
        data.slug = slug;
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
            entity: "brand"
        };
        // console.log(data);
        var save_brand_db = {
            meta: meta,
            organization: data.organization,
            parent: data.parent,
            slug: slug,
            tags: tags,
            name: data.name,
        };

        //console.log("save", save_brand_db);


        fetch(RestApi.isFetch("brands"), RestApi.getPostMethod(save_brand_db)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    //   console.log(json)
                    // this.props.onChangeValue(data);
               //     console.log(json);
                    var brands = { ...this.state.brands };
                    brands.b_table_data[0].name = '';
                    save_brand_db.label = save_brand_db.name;
                    save_brand_db.value = save_brand_db.name;
                    save_brand_db.refId = json.name;

                    brands.brands_dropdown.push(save_brand_db);
                    this.props.onChangeValue(brands.brands_dropdown, "0");

                    this.setState({ brands });

                    this.setState({ add_t_product: true });

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


    }

    //brand table custom edit
    addNewParent(rowData, event) {
        if (event != null) {
            var brands = { ...this.state.brands };

            var b_table_object = rowData;


            b_table_object.parent = {
                name: event.name,
                refId: event.refId,
                _id: event.refId,

            };

            var slug = "";
            event.name.split(' ').map((data) => {
               if(data !="")   slug += data + "-";
            });
            if (slug != "")
                slug = slug.substring(0, slug.length - 1);
            b_table_object.parent.slug = slug;


            b_table_object.parent_name = event.name;
            brands.b_table_data = [b_table_object];
            this.setState({ brands });
        }
        else {
            var brands = { ...this.state.brands };

            var b_table_object = rowData;
            b_table_object.parent = null;
            b_table_object.parent_name = '';
            b_table_object.slug = '';
            brands.b_table_data = [b_table_object];
            this.setState({ brands });


        }
    }
    tableInputBrandField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    changeTags(rowData, event) {
        var brands = { ...this.state.brands };
        rowData.tags = event;
        brands.b_table_data = [rowData];
        this.setState({ brands });
    }
    tableInputTagsSelectField(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                onChange={this.changeTags.bind(this, rowData)}
                multi
                options={this.state.brands.tags}
                value={rowData.tags}
            />
        );


    }
    tableInputParentField(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                onChange={this.addNewParent.bind(this, rowData)}
                options={this.state.brands.brands_dropdown}
                value={rowData.parent_name}
            />
        )

        // return (
        //     <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        // );
    }
    async isManufactureExpand(rowData, event)//brand expand
    {
      //  console.log(rowData, event);
        for (var i = 0; i < this.state.manufacturers.m_drop_down.length; i++) {
            if (event.refId == this.state.manufacturers.m_drop_down[i].refId) {
                var manufacturers = { ...this.state.manufacturers };
                manufacturers.m_expand_open = [rowData.refId];
                manufacturers.manufacture_expand_data = await this.state.manufacturers.m_drop_down[i];
                this.setState({ manufacturers });
                break;
                // console.log("find");


            }
        }
    }
    async changeManufactureBrand(rowData, event) {
        if (event != null) {
         //   console.log(event);

            rowData.org_name = event.name;
            var organization = {};
            organization.name = event.name;
            organization.contact = event.contact;

            var brands = { ...this.state.brands };

            brands.brand_expand_data.organization = organization;
            rowData.organization = organization;
            brands.b_table_data = [rowData];
            this.setState({ brands });
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
                <Select
                    onChange={this.changeManufactureBrand.bind(this, rowData)}
                    // onValueClick={this.isManufactureExpand.bind(this, rowData)}
                    className="select-width"
                    options={this.state.manufacturers.m_drop_down}
                    value={rowData.org_name}
                    clearable={false}
                />

                <div >
                    <i class="material-icons" onClick={this.isManufactureExpand.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                    {'  '}    <i class="material-icons" onClick={() => alert("not working")} style={{ 'margin-top': '8px' }}>add</i>
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
                //  <div>Loading.....</div>

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
        const save_action2 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ add_t_product: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openAddToProduct}

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
                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
                            <br />
                        </div>
                        <br />
                        <br />

                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                            <i class="material-icons" onClick={() => this.props.onCancel()}>cancel</i>
                        </div>

                    </Col>
                    <Col md="11">

                        <div style={{ 'margin-left': '58px' }}>
                            <BootstrapTable width="200" data={this.state.brands.b_table_data} condensed

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
                                <TableHeaderColumn dataAlign='center' width="100" hidden dataField='refId' expandable={false} isKey={true} dataFormat={this.tableInputAction}  >Id    </TableHeaderColumn>


                                <TableHeaderColumn dataAlign='center' width="180" dataField='name' expandable={false} expandable={false} dataFormat={this.tableInputBrandField} >Brand Name </TableHeaderColumn>


                                <TableHeaderColumn dataAlign='center' width="200" dataField='parent_name' expandable={false} dataFormat={this.tableInputParentField}>Parent Name </TableHeaderColumn>



                                <TableHeaderColumn dataAlign='center' width="200" tdStyle={{ whiteSpace: 'normal' }} dataField='org_name' expandable={false} dataFormat={this.tableInputManufactureField}> manufacture Name</TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' width="180" dataField='slug' expandable={false} dataFormat={this.tableInputTagsSelectField} >Tags
                                </TableHeaderColumn>




                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>
                                Do you want to Save ?
                </Dialog>

                            <Dialog actions={save_action2} modal={false} open={this.state.add_t_product} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ add_t_product: false })}>
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
export default AddBrandRowExpand;