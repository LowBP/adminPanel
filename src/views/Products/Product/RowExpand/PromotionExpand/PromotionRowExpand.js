
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from '../../Fetch/RestApi';
// import ManuFactureRowExpand from '../ManufacturerExpandRow/ManuFactureRowExpand';
// import UomsRowExpand from '../UomsExpandRow/UomsRowExpand';

import Spinner from 'react-spinkit';


// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import
import Snackbar from 'material-ui/Snackbar';

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
import FontIcon from 'material-ui/FontIcon';


// __MaterialUI
import DatePicker from 'material-ui/DatePicker';
var f_img_url = 'https://firebasestorage.googleapis.com/v0/b/mediapp-tst.appspot.com/o/promotions%2F';
var promo_post_url = "promotions"

class PromotionRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: this.props.data.promotion_expand_data.code,
            promotions: {
                promotion_expand_data: [],
                p_table_data: [],
                save: false,
                image_upload: '',

            },
            save_open: false,
            expanding: [-1],
            open_img_upload: false,
            open_promo_upload: false,
            o_p_quantity: this.props.data.promotion_expand_data.offer.product.quantity,
            p_quantity: this.props.data.promotion_expand_data.rules.product.quantity,
            images: {
                image_expand_open: [-1],
                image_expand_data: "",

            },
            autoHideDuration: 6000,
        };
        //table input format
        this.tableInputAction = this.tableInputAction.bind(this);
        // this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputPromotionField = this.tableInputPromotionField.bind(this);
        this.tableInputImageField = this.tableInputImageField.bind(this);

        //save function 
        this.openSaveData = this.openSaveData.bind(this);


        //bootstrap expand row handling
        this.isExpandableRow = this.isExpandableRow.bind(this);
        this.expandComponent = this.expandComponent.bind(this);

        // Expand arrow change event
        this.imageExpandArrowChange = this.imageExpandArrowChange.bind(this);

        // initializatiion
        this.startCreateTableStructure = this.startCreateTableStructure.bind(this);

    }
    startCreateTableStructure(data) {
        //onStatusChange
        // console.log("reach");
        var table_structure = {
            id: 1,
            name: data.name,
            status: data.status,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code,
            description: data.description,
            offer_quantity: data.offer.product.quantity,
            product_quantity: data.rules.product.quantity,
        };
        if (data.album != null)
            table_structure.album = data.album.permalink;
        else
            table_structure.album = null;

        var promotions = { ...this.state.promotions };
        promotions.p_table_data = [table_structure];
        promotions.promotion_expand_data = data;
        this.setState({ promotions });

    }
    async componentWillReceiveProps(nextProps) {


        if (nextProps.data != null) {

            await this.startCreateTableStructure(nextProps.data.promotion_expand_data);
        }

    }

    async componentWillMount() {

        if (this.props.data != null) {
            // console.log(this.props.data.promotion_expand_data)

            await this.startCreateTableStructure(this.props.data.promotion_expand_data);

        }

    }
    // openSaveData -------------------------------------------------------start
    async openSaveData(event) {
        await RestApi.setToken();

        this.setState({ button_disabled: true });
        var promotions = { ...this.state.promotions };
        var promotion_data = promotions.p_table_data[0];
        // console.log(promotions.promotion_expand_data)
        //image upload
        var slug = "";
        promotion_data.name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
            //  console.log(data);
        });

        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();

        this.setState({ open_promo_upload: true });


        var prom_struct_obj = {
            code: promotion_data.code,
            description: promotion_data.description,
            endDate: promotion_data.endDate,
            startDate: promotion_data.startDate,
            status: promotion_data.status,
            name: promotion_data.name,
            id: slug,
            slug: slug,

            conditions: promotions.promotion_expand_data.conditions,
            groups: promotions.promotion_expand_data.groups,
            meta: promotions.promotion_expand_data.meta,
            offer: promotions.promotion_expand_data.offer,
            rules: promotions.promotion_expand_data.rules,
            tags: promotions.promotion_expand_data.tags,
        };


        //  prom_struct_obj.offer.product.quantity = promotion_data.offer_quantity;
        //prom_struct_obj.rules.product.quantity = promotion_data.product_quantity;
        prom_struct_obj.meta.lastModified.time = Math.round(new Date().getTime());
        // console.log("pr", prom_struct_obj);
        var index = promotions.promotion_expand_data.index;

        await fetch(RestApi.isFetch(promo_post_url + "/" + promotions.promotion_expand_data.refId), RestApi.getPatchMethod(prom_struct_obj)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    json.refId = promotions.promotion_expand_data.refId;
                    // console.log(json);
                    this.setState({ open_promo_upload: false });
                    this.setState({ save_open: false });
                    this.setState({ button_disabled: false });
                    this.props.onChangeValue(json, index);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        // this.props.onChangeValue(this.state.promotions.promotion_expand_data);
    }
    // validation
    openAddToCurrentProduct(event) {
        this.setState({ add_t_promotion: false });

        this.props.onChangeValue(this.state.promotions.new_promotion, true);
        this.props.onCancel();


    }
    promotionValidate(event) {
        var promotions = { ...this.state.promotions };



        var promotion = this.state.promotions.p_table_data[0];
        // console.log(promotion);
        const re = /^[0-9]*$/;

        if (

            // promotion.name.trim() != "" &&
            promotion.code.trim() != "" &&
            promotion.description.trim() != "" &&
            promotion.startDate != ""
            //&&
            // promotion.endDate != "" &&
            //  promotion.offer_quantity != "" && re.test(promotion.offer_quantity) &&

            //promotion.product_quantity != "" && re.test(promotion.product_quantity)
        ) {
            this.setState({ save_open: true });

        }
        else {
            this.setState({ open: true, save_open: false });


        }




    }


    // expand option function ---------------------------------start




    //table data format
    tableInputAction(cellValue, rowData, nothing, cellFeild)//action button
    {
        return (
            <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i>
        );

    }


    tableInputPromotionField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input defaultValue={cellValue} readOnly required className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    tableInputStatusField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //start date
    tableInputStartDateField(cellValue, rowData, nothing, cellFeild) {//ptr

        if (cellValue == null) {
            cellValue = rowData.endDate;
        }
        if (cellValue != null && cellValue.search('/') != -1) {
            var arr = [];
            cellValue.split('/').map(data => {
                arr.push(data);
            });
            cellValue = arr[2] + "-" + arr[1] + "-" + arr[0];
            // var promotions = { ...this.state.promotions };
            // promotions.p_table_data[0].startDate = cellValue;
            // this.setState({ promotions });
            rowData.cellValue = cellValue;
        }


        var d = new Date(cellValue);

        // if (rowData.status == "inactive")
        //     return <DatePicker readOnly className='filter text-filter form-control box-height readonly-bg' required disabled={true} formatDate={(date) => (date.getDate() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} defaultDate={d} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
        // else
        return <DatePicker className='filter text-filter form-control box-height readonly-bg ' readOnly required defaultDate={d} formatDate={(date) => (((date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />

    }

    //end date
    tableInputEndDateField(cellValue, rowData, nothing, cellFeild) {//ptr



        if (cellValue.search('/') != -1) {
            var arr = [];
            cellValue.split('/').map(data => {
                arr.push(data);
            })
            cellValue = arr[2] + "-" + arr[1] + "-" + arr[0];
            // var promotions = { ...this.state.promotions };
            // promotions.p_table_data[0].endDate = cellValue;
            // this.setState({ promotions });
            rowData.cellValue = cellValue;

        }

        var d = new Date(cellValue);
        // if (rowData.status == "inactive")
        //     return <DatePicker readOnly className='filter text-filter form-control box-height readonly-bg' required disabled={true} formatDate={(date) => (date.getDate() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} defaultDate={d} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
        // else
        return <DatePicker className='filter text-filter form-control box-height' required defaultDate={d} formatDate={(date) => (((date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
    }
    // offerqty
    onChangeProductQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ o_p_quantity: e.target.value })
        }
    }
    tableInputOfferQtyField(cellValue, rowData, nothing, cellFeild) {
        return <input value={this.state.o_p_quantity} pattern="^[0-9]*$" onChange={this.onChangeProductQty.bind(this)} readOnly className='filter text-filter form-control readonly-bg ' required onBlur={(data) => rowData[cellFeild] = this.state.o_p_quantity} />

    }

    onChangePQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ p_quantity: e.target.value })
        }
    }
    tableInputProductQtyField(cellValue, rowData, nothing, cellFeild) {
        return <input value={this.state.p_quantity} pattern="^[0-9]*$" onChange={this.onChangePQty.bind(this)} className='filter text-filter form-control readonly-bg ' readOnly required onBlur={(data) => rowData[cellFeild] = this.state.p_quantity} />

    }
    // code
    tableInputcodeField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input defaultValue={cellValue} className='filter text-filter form-control  ' required onBlur={(data) => rowData[cellFeild] = this.setCodeFromat(data.target.value)} />
        );
    }
    setCodeFromat(code) {
        var code_value = "";
        code.split(' ').map(data => {
            code_value += data;
        });
        code_value = code_value.toUpperCase();
        return code_value;
    }

    tableInputDescriptionField(cellValue, rowData, nothing, cellFeild) {

        return (
            <input defaultValue={cellValue} className='filter text-filter form-control  ' required onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }


    imageExpandArrowChange(event) {
        if (this.state.expanding != -1)
            this.setState({ expanding: [-1] });


    }
    addNewImage(event) {


        this.setState({ set_img_open: false });
        if (event.target.files && event.target.files[0]) {
            this.setState({ added_new_image: true });

            var promotions = { ...this.state.promotions };
            promotions.p_table_data[0].image_upload = event.target.files[0];

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ image: e.target.result });

                //promotions.p_table_data[0].image = e.target.result;
                var images = { ...this.state.images };
                images.image_expand_data = e.target.result;

                this.setState({ images });
                this.setState({ promotions });
            };
            reader.readAsDataURL(event.target.files[0]);

        }


    }
    expandImage(rowData, event) {
        var images = { ...this.state.images };

        images.image_expand_data = rowData.album == null ? "" : rowData.album;
        images.row_data = rowData;
        this.setState({ images });
        this.setState({ open_image_view: true });

        // this.setState({ expanding: [rowData.id] });
    }
    tableInputImageField(cellValue, rowData, nothing, cellFeild) {
        if (cellValue == null) {
            return (<div class="input-group no-image">

                <a class="add-image" onClick={this.expandImage.bind(this, rowData, cellValue)}>Add Image </a>


            </div>);
        }

        return (
            <div class="input-group">
                <img src={cellValue} style={{ width: '220px', height: '35px' }} onClick={this.expandImage.bind(this, rowData, cellValue)} />

            </div>

            // <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }


    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    expandComponent(row) {
        return (
            <div class="pull-right">
                <FlatButton label="Choose Image" labelPosition="before">
                    <input type="file" onChange={this.addNewImage.bind(this)} />
                </FlatButton>
                <img src={row.album} style={{ height: '300px', width: '400px', background: 'white' }} />
            </div>
        );
    }
    async    deleteImage() {
        await RestApi.setToken();

        this.setState({ d_image_d_open: false });
        this.setState({ open_image_up: false });

        var promotions = { ...this.state.promotions };
        promotions.p_table_data[0].album = null;
        promotions.p_table_data[0].image = "";
        promotions.p_table_data[0].image_upload = '';
        promotions.image_upload = '';

        var prom_struct_obj = {};
        prom_struct_obj.album = null;
        prom_struct_obj.meta = promotions.promotion_expand_data.meta


        //  prom_struct_obj.offer.product.quantity = promotion_data.offer_quantity;
        //prom_struct_obj.rules.product.quantity = promotion_data.product_quantity;
        prom_struct_obj.meta.lastModified.time = Math.round(new Date().getTime());


        fetch(RestApi.isFetch(promo_post_url + "/" + promotions.promotion_expand_data.refId), RestApi.getPatchMethod(prom_struct_obj)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        this.setState({ promotions });

        this.setState({ set_img_open: false });
        var images = { ...this.state.images };
        images.image_expand_data = "";
        this.setState({ images });
        this.setState({ d_image_d_open: false });

    }
    async  uploadImage() {
        await RestApi.setToken();

        this.setState({ open_image_up: false });
        this.setState({ added_new_image: false });

        var promotions = { ...this.state.promotions };
        promotions.p_table_data[0].album = this.state.images.image_expand_data;

        this.setState({ open_image_view: false });


        var prom_struct_obj = {};
        if (promotions.p_table_data[0].image_upload != '') {
            var permalink = {};

            var slug = "";
            promotions.p_table_data[0].name.split(' ').map((data) => {
                if (data != "") slug += data + "-";
                //  console.log(data);
            });

            slug = slug.substring(0, slug.length - 1);
            slug = slug.toLowerCase();

            var url = f_img_url + slug + '%2F' + slug;
            permalink.permalink = (f_img_url + slug + '%2F' + slug + '?alt=media')
            fetch(url, RestApi.getPostImageMethod(promotions.p_table_data[0].image_upload)).then(res => {
                if (res.ok)
                    this.setState({ open_img_upload: false });
                return res;

            }).catch(err => err);

            prom_struct_obj.album = permalink;
            prom_struct_obj.meta = promotions.promotion_expand_data.meta


            //  prom_struct_obj.offer.product.quantity = promotion_data.offer_quantity;
            //prom_struct_obj.rules.product.quantity = promotion_data.product_quantity;
            prom_struct_obj.meta.lastModified.time = Math.round(new Date().getTime());
            // console.log("pr", prom_struct_obj);

            fetch(RestApi.isFetch(promo_post_url + "/" + promotions.promotion_expand_data.refId), RestApi.getPatchMethod(prom_struct_obj)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
        }



        this.setState({ promotions });





    }
    render() {
        // console.log(this.state.manufacturers.m_table_data);
        const save_action = [ //dailog actions
            <FlatButton
                disabled={this.state.button_disabled}
                label="No"
                primary={true}
                onClick={() => this.setState({ save_open: false })}
            />,
            <FlatButton
                disabled={this.state.button_disabled}

                label="Yes"
                primary={true}
                onClick={this.openSaveData}

            />,
        ];
        const action_save_image = [ //dailog actions
            <FlatButton

                label="Close"
                primary={true}
                onClick={() => this.setState({ open_image_view: false })}
            />,
            <FlatButton
                disabled={this.state.images.image_expand_data == "" ? true : false}
                label="Save"
                primary={true}
                onClick={() => this.setState({ open_image_up: true })}
            />
        ];

        const action_delete_image = [ //dailog actions
            <FlatButton
                label="Close"
                primary={true}
                onClick={() => this.setState({ open_image_view: false })}
            />,
            <FlatButton
                disabled={this.state.images.image_expand_data == "" ? true : false}

                label="Delete"
                primary={true}
                onClick={() => this.setState({ d_image_d_open: true })}
            />
        ];

        const remove_action = [ //dailog actions
            <FlatButton
                disabled={this.state.start_remove}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_remove_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.start_remove}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ start_remove: true }), this.props.onRemove(this.props.data.promotion_expand_data), this.props.data.promotion_expand_data.status = "inactive", this.setState({ open_remove_dialog: false }), this.setState({ start_remove: false }))}

            />,
        ];
        const status_change = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ show_activeinactive: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={() => (this.props.onStatusChange(this.state.rowData, this.state.rowData.status), this.setState({ show_activeinactive: false }))}

            />,
        ];


        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,
        };
        if (this.props.data != null) {

            return (
                <Row  >
                    <Col md="1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >
                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', 'margin-left': '-10px', 'margin-top': '10px' }}>
                            {/* <i class="material-icons" onClick={() => this.setState({ save_open: true })}>save</i> */}
                            {/* <i className="fa fa-save fa-lg mt-2 f-edit " onClick={this.promotionValidate.bind(this)}></i>	&nbsp;&nbsp;
                            <i className="fa fa-close fa-lg mt-2 f-edit " onClick={() => (this.props.onCancel())}></i>


                        </div>



                        <br />
                        <br />
                        <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>

                            <i className="fa fa-trash-o fa-lg mt-2 f-edit " onClick={() => (this.setState({ open_remove_dialog: true }))}></i> */}


                            <IconMenu
                                className="wert"
                                iconButtonElement={<IconButton iconClassName="material-icons"
                                    className="iconbutton-height" iconStyle={{ color: 'black' }}>more_horiz</IconButton>}
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
                                    onClick={this.promotionValidate.bind(this)}
                                />


                                {this.props.data.promotion_expand_data.status == "active" ?
                                    <MenuItem primaryText="Deactivate"
                                        className="menu-style"
                                        leftIcon={<Checkbox
                                            checkedIcon={<Visibility />}
                                            uncheckedIcon={<VisibilityOff />}
                                            defaultChecked


                                        />} onClick={() => (this.setState({ show_activeinactive: true }), this.setState({ rowData: this.props.data.promotion_expand_data, row_status: "Deactivate", promotion_name: this.props.data.promotion_expand_data.name }))} /> : <MenuItem primaryText="Activate"
                                            className="menu-style"
                                            leftIcon={<Checkbox
                                                checkedIcon={<Visibility />}
                                                uncheckedIcon={<VisibilityOff />}
                                            />} onClick={() => (this.setState({ show_activeinactive: true }), this.setState({ rowData: this.props.data.promotion_expand_data, row_status: "Activate", promotion_name: this.props.data.promotion_expand_data.name }))} />



                                    /* onCheck={this.create_name_editor.bind(this,row)} */




                                }
                                <MenuItem primaryText="Close"
                                    className="menu-style"
                                    leftIcon={<IconButton

                                        iconClassName="material-icons"
                                        iconStyle={{ margin: '0px !important', color: '#263238' }}
                                        style={{ 'height': '0px', margin: '0px !important' }} >
                                        close
                    </IconButton>}
                                    // onClick={this.newProductSave.bind(this)}
                                    onClick={() => this.props.onCancel()}
                                />

                            </IconMenu>

                        </div>

                    </Col>
                    <Col md="12">

                        <div style={{ 'margin-left': '58px' }}>
                            <BootstrapTable width='600' data={this.state.promotions.p_table_data} condensed

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
                                {/* <TableHeaderColumn dataAlign='center' width="50" dataField='name' expandable={false} isKey={true} dataFormat={this.tableInputAction} >
                        </TableHeaderColumn> */}





                                <TableHeaderColumn dataAlign='center' dataField='name' width="210" expandable={false} isKey={true} expandable={false} dataFormat={this.tableInputPromotionField} >Name </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='status' width="150" expandable={false} dataFormat={this.tableInputStatusField.bind(this)} > Status</TableHeaderColumn>
                                <TableHeaderColumn dataAlign='center' dataField='startDate' width="150" expandable={false} dataFormat={this.tableInputStartDateField.bind(this)} > Start Date</TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='endDate' width="150" expandable={false} dataFormat={this.tableInputEndDateField.bind(this)} > End Date</TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='offer_quantity' width="150" expandable={false} dataFormat={this.tableInputOfferQtyField.bind(this)} >Offer Product Qty </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='product_quantity' width="150" expandable={false} dataFormat={this.tableInputProductQtyField.bind(this)} >Min Purchase Count </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='code' width="150" expandable={false} dataFormat={this.tableInputcodeField.bind(this)} >Code </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='description' width="300" expandable={false} dataFormat={this.tableInputDescriptionField} >description </TableHeaderColumn>

                                <TableHeaderColumn dataAlign='center' dataField='album' width="90" expandable={false} dataFormat={this.tableInputImageField} >Image </TableHeaderColumn>


                            </BootstrapTable>
                            <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ save_open: false })}>

                                {this.state.open_promo_upload != true ? " Do you want to Save ?" : null}
                                {this.state.open_promo_upload == true ?
                                    <div>
                                        Saving {this.state.open_img_upload != false ? "Image  and " : ''}Promotion.....
                                         <br />
                                        <center> <Spinner name="line-scale-pulse-out-rapid" /></center>


                                    </div> : null}

                            </Dialog>

                            <Dialog actions={remove_action} modal={false} open={this.state.open_remove_dialog} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ open_remove_dialog: false })}>
                                {this.state.start_remove != true ? "Do you want to Remove  '" + this.state.promotions.p_table_data[0].name + "' ?" : null}
                                {this.state.start_remove == true ? <center> <Spinner name="line-scale-pulse-out-rapid" /></center> : null}

                            </Dialog>



                            <Dialog actions={this.state.added_new_image == true ? action_save_image : action_delete_image} modal={false} open={this.state.open_image_view} contentStyle={{
                                width: '40%',
                                maxWidth: 'none',
                                title: "Image of Promotion "
                            }} onRequestClose={() => this.setState({ open_image_view: false })}>
                                <IconButton onClick={() => this.fileUpload.click()}>
                                    <FontIcon className="material-icons" >
                                        add_a_photo
                         </FontIcon>
                                </IconButton>
                                <input type="file" ref={(fileUpload) => {
                                    this.fileUpload = fileUpload;
                                }}
                                    style={{ visibility: 'hidden' }} onChange={(data) => (this.addNewImage(data), this.setState({ set_img_open: true }))} />

                                {/* {this.state.images.image_expand_data != "" ? (
                                <i class="fa fa-trash-o fa-lg mt-2 f-edit " onClick={() => this.setState({ d_image_d_open: true })}></i>) : null} */}
                                <div>

                                    {this.state.images.image_expand_data != "" ? <img class=" img-view-size" src={this.state.images.image_expand_data} /> : null}
                                </div>
                            </Dialog>


                            <Dialog actions={status_change} modal={false} open={this.state.show_activeinactive} contentStyle={{
                                width: '25%',
                                maxWidth: 'none'
                            }} onRequestClose={() => this.setState({ show_activeinactive: false })}>
                                Do you want to {this.state.row_status} the promotion '{this.state.promotion_name}'
                </Dialog>


                        </div>
                        <Snackbar
                            open={this.state.open}
                            message="Please Fill Required Fields"
                            autoHideDuration={6000}
                            style={{ color: 'white' }}
                            style={{ top: 0, height: 0 }}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            onRequestClose={() => this.setState({ open: false })}
                        />

                        <Snackbar
                            open={this.state.d_image_d_open}
                            message="Do you want To Remove"
                            action="Yes"
                            style={{ color: 'white' }}
                            style={{ top: 0, height: 0 }}
                            bodyStyle={{ 'font-weight': 'bold' }}

                            autoHideDuration={this.state.autoHideDuration}
                            onActionClick={this.deleteImage.bind(this)}
                            onRequestClose={() => this.setState({ d_image_d_open: false })}
                        />
                        <Snackbar
                            open={this.state.open_image_up}
                            message="Do you want To Upload"
                            action="Yes"
                            style={{ color: 'white' }}
                            bodyStyle={{ 'font-weight': 'bold' }}

                            style={{ top: 0, height: 0 }}
                            autoHideDuration={this.state.autoHideDuration}
                            onActionClick={this.uploadImage.bind(this)}
                            onRequestClose={() => this.setState({ open_image_up: false })}
                        />
                        <Snackbar
                            open={this.state.set_img_open}
                            message="Do you want To Upload"
                            action="Yes"
                            style={{ color: 'white' }}
                            style={{ top: 0, height: 0, visibility: 'hidden' }}
                            autoHideDuration={1}

                            onRequestClose={() => this.setState({ set_img_open: false })}
                        />


                    </Col>

                </Row  >

            )
        }
        else {
            return (
                <div>Loading or error .....</div>
            )
        }
    }
}
export default PromotionRowExpand;