import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css';
import './style.css';

// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import 

//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';
import Spinner from 'react-spinkit';
import Snackbar from 'material-ui/Snackbar';

// __MaterialUI
import DatePicker from 'material-ui/DatePicker';
// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button
import RaisedButton from 'material-ui/RaisedButton';

// class imports
import Store from '../../DataHandling/StoreFunctions';
import RestApi from '../../Fetch/RestApi';

// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import FontIcon from 'material-ui/FontIcon';



// {
//     r=rule
// }
var tags;
var f_img_url = 'https://firebasestorage.googleapis.com/v0/b/mediapp-tst.appspot.com/o/promotions%2F';
var promo_post_url = "promotions"
class AddPromotionRowExpand extends Component {
    constructor(props) {
        super(props);
        tags = Store.promotionTags();
        this.state = {
            promotions: {
                p_table_data: [],
                product_drop_down: this.props.data.promotion_products_drop,
                new_promotion: '',
                promotion_expand_data: this.props.data.promotion_expand_data,
            },
            image: '',
            expanding: [-1],
            open_img_upload: false,//upload image spinner
            saving_action: true,//one time save
            open_promo_upload: false,//save promotion spinner
            add_t_promotion: false,
            o_p_quantity: '',
            p_quantity: '',
            code: '',
            images: {
                image_expand_open: [-1],
                image_expand_data: '',

            },
 

        };
        // promotion
        this.promotionInputName = this.promotionInputName.bind(this);

        // qty
        this.tableInputQtyField = this.tableInputQtyField.bind(this);

        // product
        this.tableInputSelectProductField = this.tableInputSelectProductField.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);

        // code
        this.tableInputCodeField = this.tableInputCodeField.bind(this);

        // start Date
        this.tableInputStartDateField = this.tableInputStartDateField.bind(this);

        //endDate 
        this.tableInputEndDateField = this.tableInputEndDateField.bind(this);

        //Description
        this.tableInputDescriptionField = this.tableInputDescriptionField.bind(this);

        //image
        this.tableInputImageField = this.tableInputImageField.bind(this);
        this.addNewImage = this.addNewImage.bind(this);


        //expand
        this.expandComponent = this.expandComponent.bind(this);
        this.isExpandableRow = this.isExpandableRow.bind(this);

        // save promotion
        this.openSavePromotion = this.openSavePromotion.bind(this);
        this.openAddToCurrentProduct = this.openAddToCurrentProduct.bind(this);

        //validation
        this.promotionValidationCheck = this.promotionValidationCheck.bind(this);
    }
    //firt time declaration
    setPromotionTableAttributes() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;
        var promotion = {
            id: 1,
            name: '',
            code: '',
            description: '',
            startDate: today,
            endDate: today,
            tags: tags,
            o_p_quantity: '',
            // product_name: '',
            p_quantity: '',
            image: "",
            image_upload: '',

        }
        var promotions = { ...this.state.promotions };
        promotions.p_table_data = [promotion];
        this.setState({ promotions });
    }

    componentWillMount() {
        if (this.props.data.promotion_expand_data != null) {

            var promotions = { ...this.state.promotions };
            promotions.promotion_expand_data = this.props.data.promotion_expand_data;
            promotions.product_drop_down = this.props.data.promotion_products_drop;
            this.setState({ promotions });
            this.setPromotionTableAttributes();

        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.data)

        if (nextProps.data.promotion_expand_data != null) {

            var promotions = { ...this.state.promotions };
            promotions.promotion_expand_data = nextProps.data.promotion_expand_data;

            promotions.product_drop_down = nextProps.data.promotion_products_drop;
            this.setState({ promotions });
            this.setPromotionTableAttributes();
        }

    }

    // shouldComponentUpdate(nextProps, nextState) {

    // }



    //save 
    async openSavePromotion(event) {
        await RestApi.setToken();
        
        this.setState({ button_disabled: true });

        var promotion = this.state.promotions.p_table_data[0];


        if (this.state.saving_action == true) {
            this.setState({ save_action: false });

            var slug = "";
            promotion.name.split(' ').map((data) => {
                if (data != "") slug += data + "-";
                //  console.log(data);
            });

            slug = slug.substring(0, slug.length - 1);
            slug = slug.toLowerCase();

            var permalink = {};
            if (promotion.image_upload != '') {
                this.setState({ open_img_upload: true });
                var url = f_img_url + slug + '%2F' + slug;
                permalink.permalink = (f_img_url + slug + '%2F' + slug + '?alt=media')

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
                    if (res.ok)
                        this.setState({ open_img_upload: false });
                    return res;

                }).catch(err => err);

            }
            this.setState({ open_promo_upload: true });



            var promotion = this.state.promotions.p_table_data[0];



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
                entity: "promotion"
            };
            var groups = {
                exclude: [""],
                include: ["medi-app"],
            };



            var promotions = {

                code: promotion.code,
                description: promotion.description,
                endDate: promotion.endDate,
                meta: meta,
                groups: groups,
                name: promotion.name,

                slug: slug,
                id: slug,
                startDate: promotion.startDate,
                status: "active",
                tags: promotion.tags,


            };
            // console.log(this.state.promotions)

            var offer = {
                product: {
                    quantity: '',
                    value: {
                        _id: this.state.promotions.promotion_expand_data.refId,
                        refId: this.state.promotions.promotion_expand_data.refId,
                        name: this.state.promotions.promotion_expand_data.name,
                        slug: this.state.promotions.promotion_expand_data.slug,
                         id: this.state.promotions.promotion_expand_data.slug,
                        tags: this.state.promotions.promotion_expand_data.tags,
                    } 
                }
            };
            var rules = {
                product: {
                    quantity: '',
                    slug: this.state.promotions.promotion_expand_data.slug
                }
            };
            promotions.offer = offer;
            promotions.rules = rules;

            promotions.offer.product.quantity = parseInt(promotion.o_p_quantity);
            promotions.rules.product.quantity = parseInt(promotion.p_quantity);

            if (promotion.image != '') {
                promotions.album = permalink;
            }
            // console.log("promotions",promotions);
            if(this.props.data.refId !=null){
            await fetch(RestApi.isFetch(promo_post_url), RestApi.getPostMethod(promotions)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // var promotion={...this.state.promotions};
                        promotions.refId = json.name;
                        promotions.label = promotions.name;
                        promotions.value = promotions.name;
                        // this.state.promotions.new_promotion = promotions;
                        // this.setState({promotion});
                        this.props.onChangeValue(promotions, false);
                        this.setState({ open_promo_upload: false, save_open: false });
                        this.setState({ button_disabled: true });

                        // this.setState({ add_t_promotion: true });

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            // console.log(promotions);
        }
        else
        {
          
            // this.state.promotions.new_promotion = promotions;
            // this.setState({promotion});
            this.props.onChangeValue(promotions, false);
            this.setState({ open_promo_upload: false, save_open: false });
            this.setState({ button_disabled: true });

        }
    }

    }
    openAddToCurrentProduct(event) {
        this.setState({ add_t_promotion: false });

        this.props.onChangeValue(this.state.promotions.new_promotion, true);
        this.props.onCancel();


    }
    // validation
    promotionValidationCheck(event) {
        var promotion = this.state.promotions.p_table_data[0];
        console.log(promotion);
        const re = /^[0-9]*$/;

        if (

            promotion.name.trim() != "" &&
            promotion.code.trim() != "" &&
            promotion.description.trim() != "" &&
            promotion.startDate != "" &&
            promotion.endDate != "" &&
            promotion.o_p_quantity != "" &&

            promotion.p_quantity != ""
        ) {
            this.setState({ save_open: true });

        }
        else {
            this.setState({ open: true, save_open: false });


        }


    }

    // promotion name
    promotionInputName(cellValue, rowData, nothing, cellFeild) {//ptr
        return <input defaultValue={cellValue} className='filter text-filter form-control ' required onBlur={(data) => rowData[cellFeild] = data.target.value} />
    }

    // product select
    addNewProduct(rowData, event) {
        var offer = {
            product: {
                quantity: 1,
                value: {
                    _id: event.refId,
                    _refId: event.refId,
                    name: event.name,
                    slug: event.slug,
                    tags: event.tags,
                }
            }
        };
        var rules = {
            product: {
                quantity: '',
                slug: event.name,
            }
        }
        var promotions = { ...this.state.promotions };
        rowData.product_name = event.name;
        rowData.offer = offer;
        rowData.rules = rules;
        promotions.p_table_data = [rowData];

        this.setState({ promotions });
    }
    tableInputSelectProductField(cellValue, rowData, nothing, cellFeild) {//ptr

        return (
            <Select
                onChange={this.addNewProduct.bind(this, rowData)}
                //    onOpen={() => console.log(this.state.promotions.product_drop_down)}
                options={this.state.promotions.product_drop_down}
                value={rowData.product_name}
            />
        );
    }

    // qty
    tableInputCodeField(cellValue, rowData, nothing, cellFeild) {//ptr
        return <input value={this.state.code} className='filter text-filter form-control ' onChange={(data) => this.setState({ code: event.target.value })} required onBlur={(data) => rowData[cellFeild] = this.setCodeFromat(data.target.value)} />
    }
    setCodeFromat(code) {
        var code_value = "";
        code.split(' ').map(data => {
            code_value += data;
        });
        code_value = code_value.toUpperCase();
        this.setState({ code: code_value });
        return code_value;
    }


    onChangeProductQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ o_p_quantity: e.target.value })
        }
    }
    tableInputOfferProductQtyField(cellValue, rowData, nothing, cellFeild) {//ptr
        return <input value={this.state.o_p_quantity} pattern="^[0-9]*$" onChange={this.onChangeProductQty.bind(this)} className='filter text-filter form-control ' required onBlur={(data) => rowData[cellFeild] = data.target.value} />
    }

    //code
    onChangePQty(e) {
        const re = /^[0-9]*$/;
        if (e.target.value == '' || re.test(e.target.value)) {

            // if(res.test(e.target.value))
            this.setState({ p_quantity: e.target.value })
        }
    }
    tableInputQtyField(cellValue, rowData, nothing, cellFeild) {//ptr
        return <input value={this.state.p_quantity} pattern="^[0-9]*$" onChange={this.onChangePQty.bind(this)} className='filter text-filter form-control ' required onBlur={(data) => rowData[cellFeild] = this.state.p_quantity} />

    }

    //start date
    tableInputStartDateField(cellValue, rowData, nothing, cellFeild) {//ptr
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

        if (rowData.status == "inactive")
            return <DatePicker readOnly className='filter text-filter form-control box-height readonly-bg' required disabled={true} formatDate={(date) => (date.getDate() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} defaultDate={d} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
        else
            return <DatePicker className='filter text-filter form-control box-height' required defaultDate={d} formatDate={(date) => (((date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />

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
        if (rowData.status == "inactive")
            return <DatePicker readOnly className='filter text-filter form-control box-height readonly-bg' required disabled={true} formatDate={(date) => (date.getDate() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} defaultDate={d} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
        else
            return <DatePicker className='filter text-filter form-control box-height' required defaultDate={d} formatDate={(date) => (((date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />

    }

    // description
    tableInputDescriptionField(cellValue, rowData, nothing, cellFeild) {//ptr
        return <input className='filter text-filter form-control ' required onBlur={(data) => rowData[cellFeild] = data.target.value} />
    }
    // image
    addNewImage(event) {
        // console.log(event.target.files[0]);
        // rowData[cellFeild] = event.target.files[0];
        // if (event.target.files && event.target.files[0]) {
        //     let reader = new FileReader();
        //     reader.onload = (e) => {
        //         this.setState({ image: e.target.result });
        //     };
        //     reader.readAsDataURL(event.target.files[0]);

        // }
        // this.setState({ expanding: [rowData.id] });

        // console.log(this.state.promotions.p_table_data);
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
    // image ............................................................................start
    expandImage(rowData, event) {
        var images = { ...this.state.images };

        images.image_expand_data = rowData.image != null ? rowData.image : "";
        images.row_data = rowData;
        images.image_expand_open = rowData.id;

        this.setState({ images });
        this.setState({ open_image_view: true });





        // this.setState({ expanding: [rowData.id] });
    }
    tableInputImageField(cellValue, rowData, nothing, cellFeild) {//ptr
        // return <input type="file" className='filter text-filter form-control '  onChange={this.addNewImage.bind(this, rowData, cellFeild)} />
        if (cellValue == "") {
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

    //expand
    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    expandComponent(row) {
        // console.log(this.state.image);
        return (
            <div class="pull-right">
                {this.state.image != '' ? <img src={this.state.image} style={{ height: '200px', background: 'white' }} /> : null}
            </div>
        )


    }
    deleteImage() {
        this.setState({ d_image_d_open: false });
        this.setState({ open_image_up: false });

        var promotions = { ...this.state.promotions };
        promotions.p_table_data[0].album = null;
        promotions.p_table_data[0].image = "";
        promotions.p_table_data[0].image_upload = '';
        promotions.image_upload = '';
        this.setState({ promotions });

        this.setState({ set_img_open: false });
        var images = { ...this.state.images };
        images.image_expand_data = "";
        this.setState({ images });
        this.setState({ d_image_d_open: false });







    }
    uploadImage() {
        this.setState({ open_image_up: false });
        this.setState({ added_new_image: false });

        var promotions = { ...this.state.promotions };
        promotions.p_table_data[0].image = this.state.images.image_expand_data;

        this.setState({ open_image_view: false });

        this.setState({ promotions });

    }

    showMessage() {
        if (this.props.data.promotion_expand_data.promotion != null) {
            return (
                <div>
                    '{this.state.promotions.p_table_data[0].name}' will get active and '{this.props.data.promotion_expand_data.promotion.name}'  will get inactive. Do you want to continue adding new promotion to the product.

           </div>)
        }
        else {
            return (
                <div>
                    '{this.state.promotions.p_table_data[0].name}' will get active. Do you want to continue adding new promotion to the product.

          </div>)
        }
    }
    render() {
        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,
        };
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
                onClick={this.openSavePromotion}

            />,
        ];
        const save_action2 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => (this.setState({ add_t_promotion: false }), this.props.onCancel())}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openAddToCurrentProduct}

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


        return (
            <div class="row">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >
                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                        {/* <i class="material-icons" onClick={this.promotionValidationCheck}>save</i> */}
                        <i className="fa fa-save fa-lg mt-2 f-edit " onClick={this.promotionValidationCheck}></i>
                        <br />
                    </div>
                    <br />
                    <br />

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i className="fa fa-close fa-lg mt-2 f-edit " onClick={() => this.props.onCancel()}></i>

                        {/* <i class="material-icons" onClick={() => this.props.onCancel()}>cancel</i> */}
                    </div>

                </div>

                <div class="col-lg-12">

                    <div style={{ 'margin-left': '58px' }}>
                        <BootstrapTable width='400' data={this.state.promotions.p_table_data} condensed
                            hoverx
                            expandableRow={this.isExpandableRow}
                            expandComponent={this.expandComponent}
                            options={options}
                            version="4"
                            ref='table'
                            tableHeaderClass='bgclr'
                            tableBodyClass='bgclr'
                            containerClass='bgclr'
                            tableContainerClass='bgclr'
                            headerContainerClass='bgclr'
                            bodyContainerClass='row-overflow'
                        >


                            <TableHeaderColumn dataField='id' hidden width="180" dataAlign='center' expandable={false} isKey={true} expandable={false}  >Name </TableHeaderColumn>

                            <TableHeaderColumn dataField='name' width="180" dataAlign='center' expandable={false} expandable={false} dataFormat={this.promotionInputName} >Name </TableHeaderColumn>

                            <TableHeaderColumn dataField='startDate' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputStartDateField} > Start Date</TableHeaderColumn>

                            <TableHeaderColumn dataField='endDate' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputEndDateField} > End Date</TableHeaderColumn>

                            {/* <TableHeaderColumn dataField='product_name' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputSelectProductField} > Product</TableHeaderColumn> */}
                            <TableHeaderColumn dataField='o_p_quantity' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputOfferProductQtyField.bind(this)} > Offer Product Qty</TableHeaderColumn>

                            <TableHeaderColumn dataField='p_quantity' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputQtyField.bind(this)} > Min Purchase Count</TableHeaderColumn>

                            <TableHeaderColumn dataField='code' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputCodeField} > Code</TableHeaderColumn>


                            <TableHeaderColumn dataField='description' width="150" dataAlign='center' expandable={false} dataFormat={this.tableInputDescriptionField} > Description</TableHeaderColumn>

                            <TableHeaderColumn dataField='image' width="90" dataAlign='center' expandable={false} dataFormat={this.tableInputImageField} > Image</TableHeaderColumn>

                        </BootstrapTable>
                        <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.setState({ save_open: false })}>


                            {this.state.open_promo_upload != true ? this.showMessage() : null}
                            {this.state.open_promo_upload == true ?
                                <div>
                                    Saving {this.state.open_img_upload != false ? "Image  and " : ''}Promotion.....
                                         <br />
                                    <center> <Spinner name="line-scale-pulse-out-rapid" /></center>


                                </div> : null}


                        </Dialog>

                        <Dialog actions={save_action2} modal={false} open={this.state.add_t_promotion} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => (this.setState({ add_t_promotion: false }), this.props.onCancel())}>
                            Do you want to Save this promotion to product table?
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




                        <Snackbar
                            open={this.state.open}
                            message="Please Fill Required Fields"
                            autoHideDuration={6000}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            style={{ color: 'white' }}
                            style={{ top: 0, height: 0 }}
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
                            autoHideDuration={2}

                            onRequestClose={() => this.setState({ set_img_open: false })}
                        />
                    </div>
                </div>

            </div  >
        );
    }
}

AddPromotionRowExpand.propTypes = {

};

export default AddPromotionRowExpand;