
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from '../../Fetch/RestApi';
import ManuFactureRowExpand from './ManufacturerExpandRow/ManuFactureRowExpand';
import UomsRowExpand from './UomsExpandRow/UomsRowExpand';
import SkusRowExpand from './SkusExpandRow/SkuRowExpand';
import PromotionRowExpand from './PromotionExpandRow/PromotionRowExpand';
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

const that = this;

class VariantRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            variants: {
                v_table_data: [],

            },
            save_open: false,
            savedata: '',
            manufacturers: {
                manufacture_expand_data: [],
                manufacure_expand_open: [-1],
            },
            uoms: {
                uom_expand_data: [],
                uom_expand_open: [-1],
            },
            skus: {
                sku_expand_data: [],
                sku_expand_open: [-1],
            },
            promotions: {
                promotion_expand_data: [],
                promotion_expand_open: [-1],
            },
            expanding: [0]

        };
        //save data
        this.openSaveData = this.openSaveData.bind(this);
        //custom input 
        this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputPromotionField = this.tableInputPromotionField.bind(this);
        this.tableInputManufactureField = this.tableInputManufactureField.bind(this);
        this.tableInputUomField = this.tableInputUomField.bind(this);
        this.tableInputSkuField = this.tableInputSkuField.bind(this);



        this.customActionMenu = this.customActionMenu.bind(this);

        //bootstrap expand row handling
        this.isExpandableRow = this.isExpandableRow.bind(this);
        this.expandComponent = this.expandComponent.bind(this);



        // onclick event
        this.fetchManufacture = this.fetchManufacture.bind(this);
        this.fetchUom = this.fetchUom.bind(this);
        this.fetchSku = this.fetchSku.bind(this);
        this.fetchPromotion = this.fetchPromotion.bind(this);


    }
    componentWillReceiveProps(nextProps) {
        // console.log("100", nextProps.data);
        if (nextProps.data.variant_expand_data != null) {
            // console.log(this.props.data.variant_expand_data);
            var variants = { ...this.state.variants }
            variants.v_table_data = nextProps.data.variant_expand_data;
            this.setState({ variants });
        }

    }
    async  componentWillMount() {
        if (this.props.data.variant_expand_data != null) {
            // console.log(this.props.data.variant_expand_data);
            var variants = { ...this.state.variants }
            variants.v_table_data = this.props.data.variant_expand_data;
            this.setState({ variants });
        }
    }



    // coustom input field            start
    openSaveData(event) {
        this.props.onChangeValue(this.state.savedata);

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




            </IconMenu>



        )

    }//------------------------------------------end

    // input field onclick -----------------------start
    fetchManufacturersResponse(json, id) {

        var manufacture_expand_data = {
            name: json.name,
            id: json.id,
            tags: json.tags,
            city: json.contact.address[0].city,
            state: json.contact.address[0].state,
            streetAddress: json.contact.address[0].streetAddress,
            address: json.contact.address[0]._address,
        };
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_data = manufacture_expand_data;
        manufacturers.manufacure_expand_open = id;
        this.setState({ manufacturers });
        this.setState({ expanding: [id] });

    }
    async fetchManufacture(rowData, event) {

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });
        this.setState({ expanding: [-1] });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });
        this.setState({ expanding: [-1] });

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });
        this.setState({ expanding: [-1] });


        var manufacure = rowData.manufacturer;

        var refId;
        if (manufacure._id != null)
            refId = manufacure._id;
        else
            refId = manufacure.refId;

        await fetch(RestApi.isFetch("manufacturers/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
            if (response.ok) {
                response.json().then(json => {

                    this.fetchManufacturersResponse(json, rowData.name);//response traversal

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async fetchUom(rowData, event) {

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacure_expand_open = [-1];
        this.setState({ manufacturers });
        this.setState({ expanding: [-1] });

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });
        this.setState({ expanding: [-1] });


        // console.log(rowData, event);

        var rowdata = rowData.uom.values;
        var uom_arr = [];
        for (var index in rowdata) {
            var refId;
            if (rowdata[index]._id != null)
                refId = rowdata[index]._id;
            else
                refId = rowdata[index].refId;

            await fetch(RestApi.isFetch("uoms/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
                if (response.ok) {
                    response.json().then(json => {
                        var uom_fetch = {
                            code: json.code,
                            description: json.description,
                            dimension: json.dimension,
                            id: json.id,
                            name: json.name,
                            parent_multiplier: json.parent.multiplier,
                            parent_name: json.parent.value.name,
                        };
                        uom_arr.push(uom_fetch);
                        var uoms = { ...this.state.uoms };
                        uoms.uom_expand_data = uom_arr;
                        uoms.uom_expand_open = [rowData.name];
                        this.setState({ uoms });
                        this.setState({ expanding: [rowData.name] });


                        //  this.fetchManufacturersResponse(json, rowData.name);//response traversal

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end        

        }

    }
    fetchSkusResponse(json, id) {
        json.manufacturer_name = json.manufacturer.name;
        json.uom_name = json.uom.values[0].name;
        var skus = { ...this.state.skus };
        skus.sku_expand_data = json;
        skus.sku_expand_open = [id];
        this.setState({ skus });
        this.setState({ expanding: [id] });

    }
    async fetchSku(rowData, event) {

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });
        this.setState({ expanding: [-1] });


        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacure_expand_open = [-1];
        this.setState({ manufacturers });
        this.setState({ expanding: [-1] });

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });
        this.setState({ expanding: [-1] });

        var sku = rowData.sku;

        var refId;
        if (sku._id != null)
            refId = sku._id;
        else
            refId = sku.refId;

        await fetch(RestApi.isFetch("skus/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
            if (response.ok) {
                response.json().then(json => {

                    this.fetchSkusResponse(json, rowData.name);//response traversal

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    fetchPromotionResponse(json, id) {
        if (json.offer != null) {
            if (json.offer.order != null) {
                if (json.offer.order.subTotal != null) {
                    json.p_subTotal = json.offer.order.subTotal;
                    json.p_min = json.rules.order.mrpTotal.min;
                    json.p_max = json.rules.order.mrpTotal.max;
                    json.p_type = 1;
                }
            }
            else {
                if (json.offer.order != null) {
                    if (json.offer.order.amount != null) {
                        json.p_amount = json.offer.order.amount.value;
                        json.p_min = json.rules.order.itemTotal.min;
                        json.p_max = json.rules.order.itemTotal.max;
                        json.promotion_type = 2;
                    }
                }
                else {
                    json.p_product_qty = json.offer.product.quantity;
                    json.p_product_value = json.offer.product.value.name;

                    json.p_product_rules_slug = json.rules.product.slug;
                    json.p_product_rules_qty = json.rules.product.quantity;
                    json.promotion_type = 3;
                }


            }
            var promotions = { ...this.state.promotions };
            promotions.promotion_expand_data = json;
            promotions.promotion_expand_open = [id];
            this.setState({ promotions });
            this.setState({ expanding: [id] });
        }
    }
    async fetchPromotion(rowData, event) {
        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });
        this.setState({ expanding: [-1] });


        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacure_expand_open = [-1];
        this.setState({ manufacturers });
        this.setState({ expanding: [-1] });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });
        this.setState({ expanding: [-1] });

        if (rowData.promotion != null) {
            var promotion = rowData.promotion;

            var refId;
            if (promotion._id != null)
                refId = promotion._id;
            else
                refId = promotion.refId;

            await fetch(RestApi.isFetch("promotions/" + refId), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
                if (response.ok) {
                    response.json().then(json => {

                        this.fetchPromotionResponse(json, rowData.name);//response traversal

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
        }
    }

    //end

    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );

        return (
            <input defaultValue={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }

    tableInputManufactureField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );

        return (
            <div class="input-group">
                <input defaultValue={cellValue} readOnly className='filter text-filter form-control   readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    <i class="material-icons" onClick={this.fetchManufacture.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
        );
    }
    tableInputSkuField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        return (
            <div class="input-group">
                <input defaultValue={cellValue} readOnly className='filter text-filter form-control  readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    <i class="material-icons" onClick={this.fetchSku.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
        );
    }
    tableInputUomField(cellValue, rowData, nothing, cellFeild) {
        var values = rowData.uom.values;
        return (
            <Select
                //   onChange={this.changeManufactureBrand.bind(this, rowData)}
                // onValueClick={this.isManufactureExpand.bind(this, rowData)}
                disabled="disabled"
                multi
                onValueClick={this.fetchUom.bind(this, rowData)}
                options={rowData.uom.values}
                value={values}
            />
        );
    }


    tableInputPromotionField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        // console.log(rowData);
        return (
            <div class="input-group">
                <input value={cellValue} id="input2-group1" readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />

                <div >
                    <i class="material-icons" onClick={this.fetchPromotion.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>
                </div>
            </div>
            //<input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );


    }


    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    expandComponent(row) {
        // console.log(this.state.manufacturers);
        if (this.state.manufacturers.manufacure_expand_open != -1)
            return (
                <ManuFactureRowExpand data={this.state.manufacturers} />
            )
        else if (this.state.uoms.uom_expand_open != -1) {
            return (
                <UomsRowExpand data={this.state.uoms} />
            )
        }
        else if (this.state.skus.sku_expand_open != -1) {
            return (
                <SkusRowExpand data={this.state.skus} />
            )
        }
        else if (this.state.promotions.promotion_expand_open != -1) {
            return (
                <PromotionRowExpand data={this.state.promotions} />

            )
        }
        else {
            return (
                <div>
                    Loading or error..........
                    </div>
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
        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,
        };
        if (this.props.data) {
            return (
                <div style={{ 'margin-left': '60px' }}>

                    <BootstrapTable width='190' data={this.state.variants.v_table_data} condensed

                        expandableRow={this.isExpandableRow}
                        expandComponent={this.expandComponent}
                        options={options}
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
                        <TableHeaderColumn dataAlign='center' width="60" dataField='name' expandable={false} isKey={true} dataFormat={this.customActionMenu}>
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='name' width="160" expandable={false} dataFormat={this.tableInputNameField} >Name
                        </TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='alias' width="90" expandable={false} dataFormat={this.tableInputNameField} >alias
                        </TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='slug' width="80" expandable={false} dataFormat={this.tableInputNameField} >Slug
                        </TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='status' width="80" expandable={false} dataFormat={this.tableInputNameField} >Status
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='mrp_value' width="80" expandable={false} dataFormat={this.tableInputNameField} >Mrp
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='price_value' width="80" expandable={false} dataFormat={this.tableInputNameField}>Price
                        </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='manufacturer_name' width="180" expandable={false} dataFormat={this.tableInputManufactureField} >Manufacture
                        </TableHeaderColumn>
                        <TableHeaderColumn dataAlign='center' dataField='tags' width="160" expandable={false} dataFormat={this.tableInputUomField} >Uom </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='sku_name' width="130" expandable={false} dataFormat={this.tableInputSkuField}>Sku          </TableHeaderColumn>

                        <TableHeaderColumn dataAlign='center' dataField='promotion_name' width="190" expandable={false} dataFormat={this.tableInputPromotionField}>Promotion     </TableHeaderColumn>
                    </BootstrapTable>
                    <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                        width: '25%',
                        maxWidth: 'none'
                    }} onRequestClose={() => this.setState({ save_open: false })}>
                        Do you want to Save ?
                </Dialog>

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
export default VariantRowExpand;