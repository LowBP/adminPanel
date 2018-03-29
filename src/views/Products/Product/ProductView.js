

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css'

// Class import
import RestApi from './Fetch/RestApi';
import BrandRowExpand from './RowExpand/BrandExpand/BrandRowExpand';
import CategoryRowExpand from './RowExpand/CategoryExpand/CategoryRowExpand';
import CompositionRowExpand from './RowExpand/CompositionExpand/CompositionRowExpand';
import VariantRowExpand from './RowExpand/VariantExpand/VariantRowExpand';
import PromotionRowExpand from './RowExpand/PromotionExpand/PromotionRowExpand';
import ManufactureExpand from './RowExpand/ManufactureExpand/ManufactureRowExpand'
import ViewUomsRowExpand from './RowExpand/UomsExpand/ViewUomsRowExpand';

//Add
import AddBrandRowExpand from './RowExpand/BrandAddExpand/AddBrandRowExpand';
import AddPromotionRowExpand from './RowExpand/PromotionExpand/AddPromotionRowExpand';
import AddCategoryRowExpand from './RowExpand/CategoryExpand/AddCategoryRowExpand';
import AddManufactureRowExpand from './RowExpand/ManufactureExpand/AddManufactureRowExpand';
import AddSkusRowExpand from './RowExpand/SkusExpand/AddSkusRowExpand';
import ViewSkusRowExpand from './RowExpand/SkusExpand/ViewSkusRowExpand';
import AddUomsRowExpand from './RowExpand/UomsExpand/AddUomsRowExpand';

import Db from './DataHandling/DB'

import Store from './DataHandling/StoreFunctions';

// normal import 
import { Badge, Row, Col, Card, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Form, FormGroup, FormText, Label, Input, Image, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';

//material class import
import Snackbar from 'material-ui/Snackbar';


//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table';
import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';
import Loading from 'react-loading-bar';//loading progress
import Spinner from 'react-spinkit';


import './style.css'

// material design for menu handling
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import FontIcon from 'material-ui/FontIcon';

// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
/*
  f=fetch
  t=table
  p=products
  m=manufacture
  prom=promotion
*/
const that = this;
var sortorder = false;

// firebase ftech url passing
const prom_f_url = "promotions";
const products_url = "products";
const promotion_url = "promotions";
const productvariant_url = "productVariants";
const manufacture_url = "manufacturers";
const skus_url = "skus";
const uoms_url = "uoms";
const brand_url = "brands";
const meta_url = "/meta/lastModified";
const promo_value_url = "/offer/product/value";
var f_img_url = 'https://firebasestorage.googleapis.com/v0/b/mediapp-tst.appspot.com/o/products%2F';

class ProductView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingbar: false,
            saved: '',
            autoHideDuration: 6000,
            expanding: [-1],
            products: {
                f_products: [],//fetched products
                p_t_data: [],//table formatted data
                form: [],//product form
                add: false,
            },

            brands: {//brands------------------------------------------------------------declr
                brands_dropdown: [],//brands drop down
                brand_expand_data: '',//brand expand data
                brand_expand_open: [-1],//brand expand open 
                view_fetch_start: true,//fetch true to fetch the barand
                m_drop_down: [],//manufacture stored
                start: false,
                view: false,
                add: false,
                add_fetch_start: true,

            },

            categories: {//category----------------------------------------------------start
                category_dropdown: [],
                category_expand_data: [],
                category_expand_open: [-1],
                add: false,
                view: false,
            },
            compositions: {
                composition_expand_data: [],
                composition_expand_open: [-1],
            },
            variants: {
                variant_dropdown: [],
                variant_expand_data: [],
                variant_expand_open: [-1],
            },

            images: {
                image_expand_open: [-1],
                image_expand_data: "",

            },
            promotions: {
                promotion_expand_data: [],
                promotion_expand_open: [-1],

                id: '',
                add_newProm_active: false,
                promotion_products_drop: [],
                viewProm_active: false,

                //first time promotion fetch
                p_f_start: true,
            },
            manufacturers: {
                manufacture_drop_down: [],
                manufacture_expand_data: [],
                manufacture_expand_open: [-1],
                add: false,
                view: false,
                id: '',
            },
            skus: {
                sku_drop_down: [],
                sku_expand_data: [],
                sku_expand_open: [-1],
                add: false,
                view: false,
                id: '',
            },
            uoms: {
                uom_drop_down: [],
                uom_expand_data: [],
                uom_expand_open: [-1],
                add: false,
                view: false,
                id: '',
            },
            promotion_f_start: true,//promotion
            sku_f_start: true,//skus
            manu_f_start: true,//manu
            uom_f_start: true,
            open_img_upload: false,
            open_product_upload: false,
            sortorder: false,
            drop_val: 25,
            manu_f_finsh: false,
            open_save_dialog: false,
            new_product: '',
            open_s_d_new_p: false,
            ptr: '',
            mrp: ''

        };
        //table custom fields
        this.customActionMenu = this.customActionMenu.bind(this);//custom action menu
        this.tableInputSelectBrand = this.tableInputSelectBrand.bind(this);//
        this.tableInputSelectFormField = this.tableInputSelectFormField.bind(this);
        this.tableInputCompositionSelectField = this.tableInputCompositionSelectField.bind(this);
        this.tableInputVariantsSelectField = this.tableInputVariantsSelectField.bind(this);
        this.tableMrpInputField = this.tableMrpInputField.bind(this);
        this.tablePtrInputField = this.tablePtrInputField.bind(this);



        // onChange functions --------------------------start
        this.updateNewBrand = this.updateNewBrand.bind(this);//brand onChange
        this.updateProductForm = this.updateProductForm.bind(this);//update brand
        this.updateProductCategory = this.updateProductCategory.bind(this);//update category
        this.ChangeComposition = this.ChangeComposition.bind(this);
        this.ChangeVariants = this.ChangeVariants.bind(this);
        // onValueClick function --------------------------start
        this.isBrandExpand = this.isBrandExpand.bind(this);//brand expand


        //bootstrap expand row handling
        this.isExpandableRow = this.isExpandableRow.bind(this);
        this.expandComponent = this.expandComponent.bind(this);

        this.productVariantFetch = this.productVariantFetch.bind(this);

        //component change event
        this.handleBrandChangeValue = this.handleBrandChangeValue.bind(this);
        this.handleCompositionChangeValue = this.handleCompositionChangeValue.bind(this);
        this.handleAddBrandChangeValue = this.handleAddBrandChangeValue.bind(this);

        //product Name
        this.tableNameInputField = this.tableNameInputField.bind(this);

        // onOpen event
        this.openComposition = this.openComposition.bind(this);
        this.openVariant = this.openVariant.bind(this);

        // onclick
        this.expandImage = this.expandImage.bind(this);
        this.fetchBrand = this.fetchBrand.bind(this);//brand
        this.addNewBrand = this.addNewBrand.bind(this);//brand

        // promotion
        this.tablePromotionInputField = this.tablePromotionInputField.bind(this);//promotion input field
        this.handleViewPromotionChangeValue = this.handleViewPromotionChangeValue.bind(this);//viewpromotion chnage value
        this.fetchPromotion = this.fetchPromotion.bind(this);//promotion
        this.addNewPromotion = this.addNewPromotion.bind(this);//add new promotion expand
        this.onSaveNewPromotion = this.onSaveNewPromotion.bind(this);

        // category
        this.tableInputCategorySelectField = this.tableInputCategorySelectField.bind(this);
        this.handleCategoryChangeValue = this.handleCategoryChangeValue.bind(this);
        this.isCategoryExpand = this.isCategoryExpand.bind(this);//brand expand
        this.handleCategroyChangeValue = this.handleCategroyChangeValue.bind(this);
        this.addNewCategory = this.addNewCategory.bind(this);
        this.handleCategoryAddChangeValue = this.handleCategoryAddChangeValue.bind(this);

        // image
        this.tableImageFileField = this.tableImageFileField.bind(this);
        this.addNewImage = this.addNewImage.bind(this);

        // active or inactive and save
        this.openDialogActiveInactive = this.openDialogActiveInactive.bind(this);

        this.saveProductDetails = this.saveProductDetails.bind(this);

        // pagination
        this.onToggleDropDown = this.onToggleDropDown.bind(this);

        this.renderSizePerPageDropDown = this.renderSizePerPageDropDown.bind(this);

        // manu
        this.addManufactureDetails = this.addManufactureDetails.bind(this);





    }
    async  componentDidMount() {
        this.state.products.form = await Store.productForm();
        // console.log("componentDidMount products", await this.state.products);
        // manufacture fetch
        await fetch(RestApi.isFetch(manufacture_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchManufactureResponse(json);//response traversal
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        // console.log("pranav1", this.state.products);
    }

    async fetchManufactureResponse(json) {
        var man_drop_arr = [];
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            data.city = data.contact.address[0].city;
            data.state = data.contact.address[0].state;
            man_drop_arr.push(data);
        }
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_drop_down = await man_drop_arr;
        // console.log("manu", manufacturers);
        this.setState({ manufacturers });
    }
    async manufacturerFetch(variants, t_data_object) {
        // console.log(variants);

        var variant_refId = "";
        if (variants.refId != null)
            variant_refId = variants.refId;
        else
            variant_refId = variants._id;

        variants.refId = variant_refId;


        await fetch(RestApi.isFetch(productvariant_url + "/" + variant_refId + "/manufacturer"), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    json.label = json.name;
                    json.value = json.name;
                    t_data_object.manufacture = json;
                    t_data_object.manufacture_name = json.name;
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


    }
    async  fetchProductsResponse(json) {//fetched products to f_products
        var push_data = [], push_t_data = [];//temp array
        var i = 0;
        for (var key in json) {

            try {
                var data = json[key];
                data.refId = key;
                data.label = data.name;
                data.value = data.name;
                push_data.push(data);
                // make table structure data------------------------start
                var category_name = "", category_name = "";
                var comp_chemical_qty = "", variants_name = "";
                var t_data_object = {
                    id: i++,
                    alias: data.alias,
                    slug: data.slug,
                    tags: data.tags,
                    name: data.name,
                    status: data.status,
                    refId: data.refId,
                    form: data.form,
                    variants: data.variants,//variant array
                    variantnames: variants_name,//varinats name

                };//table data object

                //brand------------start

                t_data_object.brandname = data.brand.name;//brand name
                t_data_object.brand = data.brand;//brand object

                //category-----------start
                data.category.map((value, i) => {
                    if (i == (data.category.length - 1))
                        category_name += value.name;
                    else
                        category_name += value.name + ", ";
                    data.category[i].value = value.name;
                    data.category[i].label = value.name;



                    // fetch(RestApi.isFetch("categories/" + data.category[i].refId + "/status"), RestApi.getFetchMethod()).then(response => {//products fetch
                    //     if (response.ok) {
                    //         response.json().then(json => {
                    //             // console.log(json.status);
                    //             data.category[i].status = json.status;
                    //         });
                    //     }
                    //     else
                    //         this.props.history.replace('/login');
                    // }).catch(function (error) { console.log(error); });//end







                });

                t_data_object.categoryname = category_name;//category name
                t_data_object.category = data.category;//category object

                // composition -------------------start
                if (data.composition != null) {
                    data.composition.map((value, i) => {
                        if (data.composition.length - 1 == i)
                            comp_chemical_qty += value.chemical;
                        else
                            comp_chemical_qty += value.chemical + ",";

                        // data.composition[i].value = (value.chemical + "," + value.quantity);
                        //data.composition[i].label = (value.chemical + "," + value.quantity);
                        data.composition[i].id = i;
                    });

                    t_data_object.compositionnameqty = comp_chemical_qty;//table_chemical_composition
                    t_data_object.composition = data.composition;//composition
                }
                //variants -------------------------------start
                if (data.variants != null) {


                    t_data_object.variantsname = data.variants[0].name;//variants to t_data_object
                    t_data_object.variants = data.variants[0];//variants to t_data_object
                    t_data_object.mrp = t_data_object.variants.mrp.value;
                    t_data_object.ptr = t_data_object.variants.price.value;
                    // skus
                    t_data_object.sku = t_data_object.variants.sku;
                    if (t_data_object.variants.sku._id != null)
                        t_data_object.sku.refId = t_data_object.sku._id;
                    else {
                        t_data_object.sku._id = t_data_object.sku.refId;

                    }

                    t_data_object.sku_name = t_data_object.sku.name;

                    //uoms
                    var uom = t_data_object.variants.uom;
                    t_data_object.uom = uom.values;
                    var uom_name = '';
                    t_data_object.uom.forEach(function (element, i) {
                        t_data_object.uom[i].label = element.name;
                        t_data_object.uom[i].value = element.name;
                        uom_name += element.name + ", ";
                    }, this);
                    t_data_object.uom_default = uom.default;
                    t_data_object.uom_name = uom_name;
                    t_data_object.uom_t_sku = data.variants[0].uom;


                    //promotion
                    if (t_data_object.variants.promotion != null) {
                        t_data_object.promotion = t_data_object.variants.promotion;
                        t_data_object.promotion.label = t_data_object.promotion.name;
                        t_data_object.promotion.value = t_data_object.promotion.name;

                        // const refId = "\"" + data.refId + "\"";
                        // await fetch(RestApi.doProductWisePromoFilter(promotion_url, refId)).then(response => {//manufacure fetch fetch
                        //     if (response.ok) {
                        //         response.json().then(json => {
                        //             var promo_arr = [];
                        //             // console.log("first",json);
                        //             for (var key in json) {
                        //                 var data = json[key];
                        //                 data.refId = key;
                        //                 data.label = data.name;
                        //                 data.value = data.name;
                        //                 promo_arr.push(data);

                        //             }
                        //             t_data_object.related_promotion = promo_arr;
                        //             // console.log(products.p_t_data[index].related_promotion);
                        //             // this.fetchPromotionResponse(json, rowData.id);//response traversal
                        //         });
                        //     }
                        //     else
                        //         this.props.history.replace('/login');
                        // }).catch(function (error) { console.log(error); });//end

                        // t_data_object.related_promotion = [t_data_object.promotion];


                        t_data_object.promotion_name = t_data_object.variants.promotion.name;
                    }

                }
                if (data.album != null)
                    t_data_object.album = data.album.permalink;
                else
                    t_data_object.album = "";






                push_t_data.push(await t_data_object);
            }
            catch (error) {
                console.log("error", error);
            }

        };
        // var promotions = { ...this.state.promotions };
        // promotions.promotion_products_drop = await push_data;
        var products = { ...this.state.products }
        products.p_t_data = await push_t_data;//product table data

        products.f_products = await push_data;//push data array to products.f_products state
        // console.log(products);
        this.setState({ products });
        // this.setState({ promotions });
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
        var brands = { ...this.state.brands };
        brands.m_drop_down = await m_drop_down;
        this.setState({ brands });
    }
    async fetchBrandsResponse(rowData, json, mode, onOpen) {
        // console.log(rowData, mode);
        var drop_brands = [];
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            drop_brands.push(data);
            if (rowData.brand._id == key || rowData.brand.refId == key) {
                let products = { ...this.state.products };
                products.p_t_data[rowData.id].brand = data;
                var brands = { ...this.state.brands };
                //  brands.brand_expand_open = [rowData.id];
                if (onOpen == false) {
                    brands.view_fetch_start = false;
                    this.setState({ brands });
                }
                else if (mode == "view") {
                    brands.add = false;
                    brands.view = true;
                    brands.brand_expand_data = data;
                    brands.brand_expand_open = [rowData.id];
                    brands.id = rowData.id;
                    brands.view_fetch_start = false;
                    brands.add_fetch_start = false;

                    this.setState({ expanding: [rowData.id] });

                }
                else {
                    brands.add = true;
                    brands.view = false;
                    brands.brand_expand_data = data;
                    brands.brand_expand_open = [rowData.id];
                    brands.id = rowData.id;
                    brands.add_fetch_start = false;
                    brands.view_fetch_start = false;

                    this.setState({ brands });
                    this.setState({ expanding: [rowData.id] });

                }
                brands.start = false;

                this.setState({ brands });

            }

        }

        var brands = { ...this.state.brands };
        brands.brands_dropdown = await drop_brands;
        this.setState({ brands });
        // console.log(drop_brnads);


    }
    async fetchCategoryResponse(json) {
        var drop_categories = [];
        for (var key in json) {
            var data = json[key];
            data._id = key;
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            drop_categories.push(data);

        }

        var categories = { ...this.state.categories };
        categories.category_dropdown = await drop_categories;
        this.setState({ categories });
        // console.log(this.state.products);

    }
    async fetchVariantResponse(json) {
        var variant_name = [];
        for (var key in json) {
            var data = json[key];
            data._id = key;
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            variant_name.push(data);
        }
        var variants = { ...this.state.variants };
        variants.variant_dropdown = await variant_name;
        this.setState({ variants });

    }


    async  componentWillMount() {
        await RestApi.setToken();

        await fetch(RestApi.isFetch(products_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchProductsResponse(json);//response traversal

                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch("categories"), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.fetchCategoryResponse(json);//response traversal
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        // await fetch(RestApi.isFetch("productVariants"), RestApi.getFetchMethod()).then(response => {//productVariant fetch
        //     if (response.ok) {
        //         response.json().then(json => {
        //             this.fetchVariantResponse(json);//response traversal
        //         });
        //     }
        //     else
        //         this.props.history.replace('/login');
        // }).catch(function (error) { console.log(error); });//end

        if (await this.state.products.p_t_data.length != 0) {
            var products = { ...this.state.products };

            for (var i = 0; i < products.p_t_data.length; i++) {
                // console.log("manu", products.p_t_data[i]);
                await this.manufacturerFetch(products.p_t_data[i].variants, products.p_t_data[i]);

                if (i + 1 == products.p_t_data.length)
                    this.setState({ manu_f_finsh: true });

            }
            this.setState({ products });
        }


    }
    // -----------------------------------------------------------------------------------------------------------------------------end

    //product save and (activate/Deactivate)
    //promotion status change
    async  productPromotionStatusChange(refId) {

        await RestApi.setToken();

        var status = {
            status: "inactive"
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }

    async  openDialogActiveInactive(event) {//save active/ inactive state

        await RestApi.setToken();

        if (this.state.rowData.status == "active") {
            this.state.rowData.status = "inactive";

        }
        else
            this.state.rowData.status = "active"
        var temp_data = {};
        temp_data.status = this.state.rowData.status;
        // console.log(this.state.rowData)
        fetch(RestApi.isFetch(products_url + "/" + this.state.rowData.refId), RestApi.getPatchMethod(temp_data)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json)
                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end

        var time = {
            time: Math.round(new Date().getTime()),
        };

        fetch(RestApi.isFetch(products_url + "/" + this.state.rowData.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json)
                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end


        this.setState({ show_activeinactive: false, });//close the dialog box

        // if (this.state.products.p_t_data[this.state.rowData.id].de_activated != null&& this.state.rowData.status=="active") {
        //     if (this.state.products.p_t_data[this.state.rowData.id].de_activated == true)
        //         this.setState({ pro_state_promo_open: true });
        //     else {
        //         return;
        //     }
        // }

        if (this.state.rowData.promotion != null)
            this.setState({ pro_state_promo_open: true });


    }

    async    productPromotionStateChange() {
        await RestApi.setToken();



        if (this.state.rowData.status == "inactive") {
            this.promotionDeactivate_dialog(this.state.rowData);
            this.setState({ show_activeinactive: false, pro_state_promo_open: false });

            // this.state.rowData.de_activated = true;
            //this.productPromotionDeactivateStateChange();

            // await this.promotionDeactivate_dialog(this.state.rowData);
            // var products = { ...this.state.products };
            // products.p_t_data[this.state.rowData.id].de_activated = true;
            // this.setState({ products });
        }
        else {
            this.promotionActivate_dialog(this.state.rowData);
            // this.state.rowData.de_activated = false;

            var products = { ...this.state.products };
            if (products.p_t_data[this.state.rowData.id].change_promotion != null) {
                var time = {
                    time: Math.round(new Date().getTime())
                };
                var set_promotion = products.p_t_data[this.state.rowData.id].change_promotion;
                fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.rowData.id].refId + "/variants/0"), RestApi.getPatchMethod(set_promotion)).then(response => {//products fetch
                    if (response.ok) {
                        response.json().then(json => {
                            // console.log("promotion status update", json);
                        });
                    }
                    else
                        this.props.history.replace('/login');
                }).catch(function (error) { console.log(error); });//end


                fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.rowData.id].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                    if (response.ok) {
                        response.json().then(json => {
                            // console.log("promotion status update", json);
                        });
                    }
                    else
                        this.props.history.replace('/login');
                }).catch(function (error) { console.log(error); });//end
                var refId = this.state.products.p_t_data[this.state.rowData.id].variants.refId != null ? this.state.products.p_t_data[this.state.rowData.id].variants.refId : this.state.products.p_t_data[this.state.rowData.id].variants._id;

                fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(set_promotion)).then(response => {//products fetch
                    if (response.ok) {
                        response.json().then(json => {
                            // console.log("promotion status update", json);
                        });
                    }
                    else
                        this.props.history.replace('/login');
                }).catch(function (error) { console.log(error); });//end

                fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                    if (response.ok) {
                        response.json().then(json => {
                            // console.log("promotion status update", json);
                        });
                    }
                    else
                        this.props.history.replace('/login');
                }).catch(function (error) { console.log(error); });//end


                products.p_t_data[this.state.rowData.id].change_promotion = null;

                this.setState({ products });

            }
            this.setState({ show_activeinactive: false, pro_state_promo_open: false });


        }

    }
    async promotionDeactivate_dialog(rowData) {
        await RestApi.setToken();

        var status = {
            status: "inactive"
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var time = {
            time: Math.round(new Date().getTime())
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        if (rowData.related_promotion != null)
            for (var i = 0; i < rowData.related_promotion.length; i++) {
                if (rowData.related_promotion[i].status == "active") {
                    var products = { ...this.state.products };
                    products.p_t_data[rowData.id].related_promotion[i].status = "inactive";
                    this.setState({ products });
                }
            }
    }

    async promotionActivate_dialog(rowData) {
        await RestApi.setToken();

        console.log(rowData);
        var status = {
            status: "active"
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var time = {
            time: Math.round(new Date().getTime())
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        if (rowData.related_promotion != null)
            for (var i = 0; i < rowData.related_promotion.length; i++) {
                if (rowData.related_promotion[i].refId == rowData.promotion.refId) {
                    var products = { ...this.state.products };
                    products.p_t_data[rowData.id].related_promotion[i].status = "active";
                    this.setState({ products });
                    break;
                }
            }
    }

    async productPromotionDeactivateStateChange() {
        await RestApi.setToken();

        var status = {
            status: "inactive"
        };

        var rowData = this.state.rowData;
        fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var time = {
            time: Math.round(new Date().getTime())
        };
        fetch(RestApi.isFetch(promotion_url + "/" + rowData.promotion.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var set_promotion_null = {
            promotion: null,
        };
        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[rowData.id].refId + "/variants/0"), RestApi.getPatchMethod(set_promotion_null)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[rowData.id].refId + "/variants/0"), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var refId = this.state.products.p_t_data[rowData.id].variants.refId != null ? this.state.products.p_t_data[rowData.id].variants.refId : this.state.products.p_t_data[rowData.id].variants._id;

        fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(set_promotion_null)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end



        this.setState({ pro_state_promo_open: false });

        // this.setState({ show_activeinactive: true });
        if (rowData.related_promotion != null)
            for (var i = 0; i < rowData.related_promotion.length; i++) {
                if (rowData.related_promotion[i].status == "active") {
                    var products = { ...this.state.products };
                    products.p_t_data[rowData.id].related_promotion[i].status = "inactive";
                    this.setState({ products });
                }
            }
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].promotion = null;
        products.p_t_data[rowData.id].promotion_name = null;
        this.setState({ products });



    }

    async skuUpdateUomChange(sku, uom) {
        await RestApi.setToken();

        var refId = sku._id != null ? sku._id : sku.refId;
        var update_sku = {};
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
            entity: "sku"
        };
        update_sku.meta = meta;
        update_sku.uom = uom;

        await fetch(RestApi.isFetch(skus_url + "/" + refId), RestApi.getPatchMethod(update_sku)).then(res => {
            if (res.ok)
                res.json().then(json => {
                    // console.log("sku uom update-----", json);
                });
            else
                this.props.history.replace('/login');

        });


    }
    async updateProductVariants(variant, manufacture) {
        await RestApi.setToken();

        var refId = variant._id != null ? variant._id : variant.refId;
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
            entity: "productVariant"
        };
        var update_variant_obj = {
            manufacturer: manufacture,
            meta: meta,
            mrp: variant.mrp,
            price: variant.price,
            promotion: variant.promotion,
            sku: variant.sku,
            status: 'active',
            uom: variant.uom
        };

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(update_variant_obj)).then(res => {
            if (res.ok) {
                res.json().then(response => {
                    // console.log("Updated Pvariant---", response);
                });

            }
            else
                this.props.history.replace('/login');

        })

    }






    async saveProductDetails(event) {
        await RestApi.setToken();


        // console.log("savingdata", this.state.savedata);
        var product = this.state.savedata;

        await this.savePriceMrp(product);
        await this.savePromotion(product)
        var slug = this.createSlug(product);

        var product_store = {
            slug: slug,
            id: slug,
            form: product.form
        };
        //image upload
        // if (product.image_upload != null) {

        //     var permalink = {};
        //     if (product.album != '') {
        //         this.setState({ open_img_upload: true });

        //         var url = f_img_url + slug + '%2F' + slug;
        //         permalink.permalink = (f_img_url + slug + '%2F' + slug + '?alt=media')

        //         product_store.album = permalink;//image link

        //         await fetch(url, RestApi.getPostImageMethod(product.image_upload)).then(res => {
        //             if (res.ok) {

        //                 res.json().then(json => {
        //                     this.setState({ open_img_upload: false });
        //                 });
        //             }
        //             else
        //                 this.props.history.replace('/login');

        //         }).catch(err => err);

        //     }
        // }
        // else {
        //     product_store.album = null;
        // }

        // await this.updateProductVariants(variants, store_manufacture);

        await fetch(RestApi.isFetch(products_url + "/" + product.refId), RestApi.getPatchMethod(product_store)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    // console.log("updated_product----", json);

                });
            }
            else
                this.setState({ open_img_upload: false });


        }).catch(err => err);
        var time = {
            time: Math.round(new Date().getTime()),
        };

        await fetch(RestApi.isFetch(products_url + "/" + product.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json)
                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end


        this.setState({ open_product_upload: false, open_save_dialog: false, });


    }

    async   savePriceMrp(product) {
        await RestApi.setToken();

        var price_mrp = {
            mrp: {
                currency: "INR",
                value: parseFloat(product.mrp)
            },
            price: {
                currency: "INR",
                value: parseFloat(product.ptr)
            },

        };
        var time = {
            time: Math.round(new Date().getTime())
        };


        await fetch(RestApi.isFetch(products_url + "/" + product.refId + "/variants/0"), RestApi.getPatchMethod(price_mrp)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


        await fetch(RestApi.isFetch(products_url + "/" + product.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        price_mrp.manufacturer = {
            _id: (product.manufacture._id) != null ? product.manufacture._id : product.manufacture.refId,
            refId: (product.manufacture._id) != null ? product.manufacture._id : product.manufacture.refId,
            id: product.manufacture.id,
            name: product.manufacture.name,
            tags: product.manufacture.tags
        };
        var refId = product.variants.refId != null ? product.variants.refId : product.variants._id;

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(price_mrp)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end



    }

    async savePromotion(product) {
        if (product.promotion != null) {
            // console.log("promotion", product.promotion);
            var store_promo_obj = {
                promotion: {
                    code: product.promotion.code,
                    name: product.promotion.name,
                    _id: product.promotion._id != null ? product.promotion._id : product.promotion.refId,
                    refId: product.promotion._id != null ? product.promotion._id : product.promotion.refId,
                    slug: product.promotion.slug,
                    id: product.promotion.slug,
                    tags: product.promotion.tags,
                }
            };

            if (product.related_promotion != null) {
                for (var i = 0; i < product.related_promotion.length; i++) {
                    if (product.related_promotion[i].refId != store_promo_obj.promotion.refId) {
                        if (product.related_promotion[i].status == "active") {
                            var status = {
                                status: "inactive"
                            };
                            product.related_promotion[i].status = "inactive";

                            // Deactivate promotion
                            await this.promotionDeactivate(product.related_promotion[i].refId, status);
                        }
                    }
                    else {
                        product.related_promotion[i].status = "active";

                    }

                }
            }
            var variants_refId = product.variants.refId != null ? product.variants.refId : product.variants._id;
            await this.promotionSave(product.refId, variants_refId, store_promo_obj);


        }
    }
    async  promotionSave(product_refId, p_v_refId, store_promotion) {
        await RestApi.setToken();

        var status = {
            status: "active"
        };
        var time = {
            time: Math.round(new Date().getTime())
        };
        // activate promotion
        this.promotionDeactivate(store_promotion.promotion.refId, status);







        fetch(RestApi.isFetch(products_url + "/" + product_refId + "/variants/0"), RestApi.getPatchMethod(store_promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(products_url + "/" + product_refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + p_v_refId), RestApi.getPatchMethod(store_promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + p_v_refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


    }

    //create slug 
    createSlug(product) {
        // slug
        var slug = "";
        product.name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
            //  console.log(data);
        });

        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        return slug;
    }
    //save new products-------------------------------------------------------start
    setBrandData(name, slug) {
        var brand = {
            id: slug,
            meta: {
                "created": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                },
                "entity": "brand",
                "id": "",
                "lastModified": {
                    "source": "cli",
                    time: Math.round(new Date().getTime()),
                    "user": "S"
                }
            },
            name: name,
            "organization": {
                "contact": {
                    "address": [
                        {
                            "_address": "54-D, Government Industrial Estate, Charkop, Kandivali (W)\nMumbai, Maharashtra\nIN-400067",
                            "_id": "-Kp8WhxEDIVHRGSCqkJK",
                            "id": "makers-labs-office",
                            "tags": [
                                "work",
                                "office"
                            ]
                        }
                    ],
                    "emails": [
                        {
                            "_id": "-Kp8XqrAbUPYGeEeiugz",
                            "id": "info@makerslabs.com",
                            "tags": [
                                "support"
                            ]
                        }
                    ],
                    "phones": [
                        {
                            "_id": "-Kp8ZoBYkPwkaOCvOqps",
                            "id": "+91-022-28688544",
                            "tags": [
                                "support",
                                "landline",
                                "fax",
                                "primary"
                            ]
                        }
                    ]
                },
                "name": "Makers Laboratories Ltd."
            },
            slug: slug,
            "tags": [
                "Healthcare",
                "Medical",
                "Pharmaceutical"
            ]
        };
        return brand;
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
    async onSaveNewBrand(brand) {
        await RestApi.setToken();

        var refId = '';

        await fetch(RestApi.isFetch(brand_url), RestApi.getPostMethod(brand)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("brandkey",json);
                    refId = json.name;
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
        if (await refId != '')
            return (await refId)


    }
    setProductBrand(refId, name) {
        var store_p_brand = {
            _id: refId,
            refId: refId,
            name: name,
            id: this.nameToSlugConvert(name),
            slug: this.nameToSlugConvert(name),
            tags: ["Healthcare", "Medical", "Pharmaceutical"]
        };

        return store_p_brand;
    }
    async setCategoryDetails(category) {
        var cat_arr = [];
        //category
        var categories = category;
        for (var i = 0; i < categories.length; i++) {
            var cat_obj = {
                _id: categories[i]._id,
                refId: categories[i].refId,
                id: categories[i].slug,
                slug: categories[i].slug,
                name: categories[i].name,
                tags: categories[i].tags,

            };
            cat_arr.push(cat_obj);
        }

        return (await cat_arr);
    }
    async setComposition(composition) {
        var comp_arr = [];
        //compositions
        var compositions = composition;
        for (var i = 0; i < compositions.length; i++) {
            var comp_obj = {
                chemical: compositions[i].chemical,
                quantity: compositions[i].quantity,
            }
            comp_arr.push(comp_obj);

        }

        return (await comp_arr);
    }
    setMetaData(entity) {
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
            entity: entity
        };
        return meta
    }
    async setSkuUomDetails(products, new_p_data) {
        var store_sku_object = new_p_data.save_new_sku;

        await fetch(RestApi.isFetch(skus_url), RestApi.getPostMethod(store_sku_object)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json);
                    this.setState({ new_sku_refId: json.name });
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

    }
    setManufacture(manufacture) {
        var store_manufacture = {
            _id: (manufacture._id) != null ? manufacture._id : manufacture.refId,
            refId: (manufacture._id) != null ? manufacture._id : manufacture.refId,
            id: manufacture.id,
            name: manufacture.name,
            tags: manufacture.tags
        };

        return store_manufacture;
    }
    async uploadProductVariant(store_product_variant, new_p_data, store_t_pro, products) {
        await RestApi.setToken();
        store_product_variant.sku.refId = this.state.new_sku_refId;
        store_product_variant.sku._id = this.state.new_sku_refId;
        new_p_data.sku.refId = this.state.new_sku_refId;
        new_p_data.sku._id = this.state.new_sku_refId;

        await fetch(RestApi.isFetch(productvariant_url), RestApi.getPostMethod(store_product_variant)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("Updated Pvariant---", json);
                    store_product_variant.refId = json.name;
                    store_product_variant._id = json.name;
                    store_product_variant.manufacturer = null;
                    store_product_variant.status = null;
                    store_product_variant.manufacturer = null;
                    store_product_variant.alias = null;
                    store_product_variant.meta = null;
                    this.setState({ variant_info: store_product_variant });

                    this.startsaveToproducts(new_p_data, store_t_pro, products);

                });

            }
            else
                this.props.history.replace('/login');

        });

        if (await store_product_variant.refId != null);

    }
    async startsaveToproducts(new_p_data, store_t_pro, products) {
        await RestApi.setToken();
        //        //image upload
        if (new_p_data.image_upload != null) {
            var permalink = {};
            if (new_p_data.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(new_p_data.name) + '%2F' + this.nameToSlugConvert(new_p_data.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(new_p_data.name) + '%2F' + this.nameToSlugConvert(new_p_data.name) + '?alt=media')

                store_t_pro.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(new_p_data.image_upload)).then(res => {
                    if (res.ok) {

                        res.json().then(json => {
                            this.setState({ open_img_upload: false });
                        });
                    }
                    else
                        this.props.history.replace('/login');

                }).catch(err => err);

            }
        }
        if (await this.state.variant_info != null) {
            store_t_pro.variants = [this.state.variant_info];
            await this.saveToproducts(new_p_data, products, store_t_pro);


        }
    }
    async setVariantDetails(new_p_data, store_t_pro, products) {

        var store_product_variant = {
            alias: "drugVariant",
            id: this.nameToSlugConvert(new_p_data.name),
            slug: this.nameToSlugConvert(new_p_data.name),
            uom: new_p_data.uom_t_sku,
            tags: ["primary"],
            status: "active",
            price: { currency: "INR", value: parseFloat(new_p_data.ptr) },
            mrp: { currency: "INR", value: parseFloat(new_p_data.mrp) },
            name: new_p_data.name,
            meta: this.setMetaData("productVariant"),
            manufacturer: this.setManufacture(new_p_data.manufacture),
            sku: new_p_data.sku,

        };

        //promotions
        // if (new_p_data.promotion != null) {
        //     var store_promo_obj = {
        //         code: new_p_data.promotion.code,
        //         name: new_p_data.promotion.name,
        //         _id: new_p_data.promotion._id != null ? new_p_data.promotion._id : new_p_data.promotion.refId,
        //         refId: new_p_data.promotion._id != null ? new_p_data.promotion._id : new_p_data.promotion.refId,
        //         slug: new_p_data.promotion.slug,
        //         tags: new_p_data.promotion.tags,
        //     };
        //     store_product_variant.promotion = store_promo_obj;

        // }


        await this.uploadProductVariant(store_product_variant, new_p_data, store_t_pro, products);

    }
    async newProductSave() {//-----------------------------------------------------------------------------------------------------------newproduct
        this.setState({ expanding: [-1] });

        var products = { ...this.state.products };

        var new_p_data = this.state.new_product;
        await this.setSkuUomDetails(products, new_p_data);


        products.add = false;
        //    console.log(new_p_data);

        this.setState({ open_product_upload: true });
        var brand = await this.setBrandData(new_p_data.name, this.nameToSlugConvert(new_p_data.name));
        var brand_refId = await this.onSaveNewBrand(brand);


        var store_t_pro = {
            alias: "drug",
            name: new_p_data.name,
            form: new_p_data.form,
            status: "active",
            tags: ["Healthcare", "Medical", "Pharmaceutical"],
            slug: this.nameToSlugConvert(new_p_data.name),
            id: this.nameToSlugConvert(new_p_data.name),

            brand: await this.setProductBrand(brand_refId, new_p_data.name),
            category: await this.setCategoryDetails(new_p_data.category),
            composition: await this.setComposition(new_p_data.composition),
            meta: this.setMetaData("product"),

        };

        var variant = await this.setVariantDetails(new_p_data, store_t_pro, products);
    }

    async saveToproducts(new_p_data, products, store_t_pro) {
        await RestApi.setToken();

        await fetch(RestApi.isFetch(products_url), RestApi.getPostMethod(store_t_pro)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    // console.log("new product---", json);
                    this.setState({ open_product_upload: false, open_s_d_new_p: false });
                    products.p_t_data[this.state.new_product.id].refId = json.name;

                    products.add = false;
                    products.p_t_data[0].variants = this.state.variant_info;
                    products.p_t_data[0].sku.refId = this.state.new_sku_refId;
                    products.p_t_data[0].sku._id = this.state.new_sku_refId;

                    this.setState({ products });
                    this.setState({ open_product_upload: false, open_s_d_new_p: false });

                    if (products.p_t_data[this.state.new_product.id].promotion != null) {
                        products.p_t_data[this.state.new_product.id].save_new_promotion.offer.product.value = {
                            _id: json.name,
                            refId: json.name,
                            id: store_t_pro.id,
                            slug: store_t_pro.slug,
                            name: store_t_pro.name,
                            tags: store_t_pro.tags,
                        };
                        products.p_t_data[this.state.new_product.id].save_new_promotion.rules.product.slug = store_t_pro.slug;
                        this.saveNewPromotion(products);
                        // var promotion_refId = products.p_t_data[this.state.new_product.id].promotion._id != null ? products.p_t_data[this.state.new_product.id].promotion._id : products.p_t_data[this.state.new_product.id].promotion.refId;
                        // this.updateNewPromotionFromProductSave(promotion_refId, promotion_value);

                    }

                });
            }
            else
                this.props.history.replace('/login');

        });
    }

    async saveNewPromotion(products) {
        var promotion = products.p_t_data[this.state.new_product.id].save_new_promotion;

        fetch(RestApi.isFetch(promotion_url), RestApi.getPostMethod(promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // var promotion={...this.state.promotions};
                    promotion.refId = json.name;
                    promotion.label = promotion.name;
                    promotion.value = promotion.name;
                    // this.state.promotions.new_promotion = promotions;
                    // this.setState({promotion});
                    // this.props.onChangeValue(promotions, false);
                    this.saveNewPromotionToProduct_Variants(products, promotion);
                    // this.setState({ add_t_promotion: true });

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
    }
    async saveNewPromotionToProduct_Variants(products, promotion) {
        var store_promo_obj = {
            promotion: {
                code: promotion.code,
                name: promotion.name,
                _id: promotion.refId,
                refId: promotion.refId,
                slug: promotion.slug,
                id: promotion.slug,
                tags: promotion.tags,
            }
        };

        await fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.new_product.id].refId + "/variants/0"), RestApi.getPatchMethod(store_promo_obj)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var time = {
            time: Math.round(new Date().getTime())
        };
        await fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.new_product.id].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var refId = products.p_t_data[this.state.new_product.id].variants.refId;
        await fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(store_promo_obj)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        await fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var promo_to_product_t = {
            _id: promotion.refId,
            refId: promotion.refId,
            name: promotion.name,
            code: promotion.code,
            slug: promotion.slug,
            tags: promotion.tags,
            label: promotion.name,
            value: promotion.name,
        };

        promotion.label = promotion.name;
        promotion.value = promotion.name;
        products.p_t_data[this.state.new_product.id].variants.promotion = promo_to_product_t;

        products.p_t_data[this.state.new_product.id].promotion = promo_to_product_t;

        products.p_t_data[this.state.new_product.id].related_promotion = [promotion];

        products.p_t_data[this.state.new_product.id].promotion_name = promo_to_product_t.name;
        this.setState({ products });


    }
    async   updateNewPromotionFromProductSave(refId, promotion_value) {
        await RestApi.setToken();

        fetch(RestApi.isFetch(promotion_url + "/" + refId + promo_value_url), RestApi.getPatchMethod(promotion_value)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


        var time = {
            time: Math.round(new Date().getTime())
        };
        fetch(RestApi.isFetch(promotion_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end



    }

    // validations
    ptrMtrValidate(value) {
        const re = /^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$/;
        if (parseFloat(value) > 0)
            if (value == '' || re.test(value)) {

                return true;
            }

        return false;
    }
    validateProducts(rowData, event) {
        this.setState({ savedata: rowData });
        var product = rowData;
        if (product.name.trim() != "" &&
            product.form.trim() != "" &&
            product.ptr != "" &&
            product.mrp != "" &&
            product.categoryname != null &&
            product.compositionnameqty != null &&
            product.manufacture_name != null &&
            product.sku_name != null &&
            product.uom_name != null && this.ptrMtrValidate(product.ptr) && this.ptrMtrValidate(product.mrp)

        ) {

            this.setState({ open_save_dialog: true });
        }
        else {
            this.setState({ open: true, open_save_dialog: false, open_product_upload: false });


        }
    }

    //validate new products
    validateNewProduct(rowData, event) {
        this.setState({ new_product: rowData })
        var new_p_data = rowData;
        console.log("new product----", rowData);

        if (new_p_data.name.trim() != "" &&
            new_p_data.form.trim() != "" &&

            new_p_data.ptr != "" &&
            new_p_data.mrp != "" &&
            new_p_data.categoryname != null &&
            new_p_data.compositionnameqty != null &&
            new_p_data.manufacture_name != null &&
            new_p_data.sku_name != null &&
            new_p_data.uom_name != null && this.ptrMtrValidate(new_p_data.ptr) && this.ptrMtrValidate(new_p_data.mrp)

        ) {
            this.setState({ open_s_d_new_p: true });
        }
        else {
            this.setState({ open: true, open_s_d_new_p: false, open_product_upload: false });


        }
    }


    // all react-bootstrap-table fuction will done here------------------------------------------------------start
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        if (rowData.id == 0 && this.state.products.add == true)
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

                        onClick={this.validateNewProduct.bind(this, rowData)}
                    />
                    <MenuItem primaryText="Cancel"
                        className="menu-style"
                        leftIcon={<IconButton

                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                            cancel
                    </IconButton>}

                        onClick={() => this.setState({ open_new_p_cancel: true })}
                    />
                </IconMenu>
            );
        var icon_color = "grey";
        if (rowData.status == "inactive") {
            icon_color = "lightgray";
        }
        return (
            <IconMenu
                className="wert"
                iconButtonElement={<IconButton iconClassName="material-icons"
                    className="iconbutton-height" iconStyle={{ color: icon_color }}>view_module</IconButton>}
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
                    onClick={this.validateProducts.bind(this, rowData)}
                />


                {rowData.status == "active" ?
                    <MenuItem primaryText="Deactivate"
                        className="menu-style"
                        leftIcon={<Checkbox
                            checkedIcon={<Visibility />}
                            uncheckedIcon={<VisibilityOff />}
                            defaultChecked


                        />} onClick={() => (rowData.promotion != null ? this.setState({ show_activeinactive: true }) : this.setState({ show_activeinactive: true }), this.setState({ rowData: rowData, row_status: "Deactivate", productname: rowData.name }))} /> : <MenuItem primaryText="Activate"
                            className="menu-style"
                            leftIcon={<Checkbox
                                checkedIcon={<Visibility />}
                                uncheckedIcon={<VisibilityOff />}
                            />} onClick={() => (rowData.promotion != null ? this.setState({ show_activeinactive: true }) : this.setState({ show_activeinactive: true }), this.setState({ rowData: rowData, row_status: "Activate", productname: rowData.name }))} />



                    /* onCheck={this.create_name_editor.bind(this,row)} */




                }

            </IconMenu>



        )

    }//------------------------------------------end


    // 1) product name----------------------------------------------------------------------------------------start
    tableNameInputField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.id == 0 && this.state.products.add == true)
            return <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

        if (rowData.status == "inactive")
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else
            return (
                <input value={cellValue} required readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
    }
    // 1) product name----------------------------------------------------------------------------------------end



    // product form----------------------------------------------------------------------start
    updateProductForm(rowData, event) {
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].form = event.value;
        this.setState({ products });
    }
    tableInputSelectFormField(cellValue, rowData, nothing, cellFeild) {//brand select field
        var top_view = '';
        if (this.state.products.p_t_data.length - 4 <= rowData.id)
            top_view = "drop-up";

        var border_clr = rowData.form != "" ? 'green' : 'red';


        // if (rowData.status == "inactive")
        //     return (
        //         <Select
        //             //options={brand_options}
        //             disabled="disabled"
        //             className={top_view}
        //             style={{ 'border-color': border_clr }}
        //             onChange={this.updateProductForm.bind(this, rowData)}
        //             value={rowData.form}
        //             options={this.state.products.form}
        //             clearable={false}

        //         />
        //     );
        // else
        return (
            <Select
                //opti  ons={brand_options}
                onChange={this.updateProductForm.bind(this, rowData)}
                value={rowData.form}
                className={top_view}
                options={this.state.products.form}
                clearable={false}
                className={top_view}
                style={{ 'border-color': border_clr }}

            />
        );
    }
    //product form--------------------------------------------------------------------------end



    //brand -----------------------------------------------------------------------------------------------------start
    updateNewBrand(rowData, event) {//update brand
        var edit_brand = {};
        rowData.brandname = event.value;//assign the selected brand names to table data
        edit_brand.name = event.name;
        edit_brand.value = event.name;
        edit_brand.label = event.name;
        edit_brand.refId = event.refId;
        edit_brand.slug = event.slug;
        edit_brand.tags = event.tags;

        var products = { ...this.state.products }
        products.p_t_data[rowData.id].brand = edit_brand;//product table data
        this.setState({ products });

        var brands = { ...this.state.brands };
        //  brands.brand_expand_open = [rowData.id];
        brands.brand_expand_data = event;
        brands.brand_expand_open = [rowData.id];
        this.setState({ brands });
        this.setState({ expanding: [rowData.id] });
    }
    async isBrandExpand(rowData, event)//brand expand
    {
        for (var i = 0; i < this.state.brands.brands_dropdown.length; i++) {
            if (event.refId == this.state.brands.brands_dropdown[i].refId) {
                var categories = { ...this.state.categories };//close expand
                categories.category_expand_open = [-1];
                this.setState({ categories });

                var brands = { ...this.state.brands };
                brands.brand_expand_open = [rowData.id];
                brands.brand_expand_data = await this.state.brands.brands_dropdown[i];
                this.setState({ brands });
                this.setState({ expanding: [rowData.id] });


            }
        }
    }
    async  fetchBrand(rowData, onOpen) {
        await RestApi.setToken();


        var brands = { ...this.state.brands };
        brands.start = true;
        brands.add = false;
        brands.view = true;
        this.setState({ brands });

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });
        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });

        // console.log(rowData);
        if (this.state.brands.view_fetch_start == true) {
            // Db.brandrowexpand = true;

            Db.brandrowexpand_first = true;
            await fetch(RestApi.isFetch("manufacturers"), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
                if (response.ok) {
                    response.json().then(json => {

                        this.fetchManufacturersResponse(json);//response traversal

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            await fetch(RestApi.isFetch("brands"), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        this.fetchBrandsResponse(rowData, json, "view", onOpen);//response traversal
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

        }
        else {
            fetch(RestApi.isFetch("brands/" + rowData.brand.refId), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        var brands = { ...this.state.brands };
                        // console.log(json);
                        var b_table_object = json;
                        b_table_object.org_name = json.organization.name;
                        if (json.parent != null)
                            b_table_object.parent_name = json.parent.name;
                        else
                            b_table_object.parent_name = "---";


                        var brands = { ...this.state.brands };
                        //  brands.brand_expand_open = [rowData.id];
                        brands.add = false;
                        brands.view = true;
                        brands.brand_expand_data = b_table_object;
                        brands.brand_expand_data.x_open = rowData.id;
                        brands.brand_expand_open = [rowData.id];
                        brands.id = rowData.id;
                        this.setState({ brands });
                        this.setState({ expanding: [rowData.id] });
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            var brands = { ...this.state.brands };
            //  brands.brand_expand_open = [rowData.id];

            brands.brand_expand_data = rowData.brand;
            brands.brand_expand_data.x_open = rowData.id;
            brands.brand_expand_open = [rowData.id];
            this.setState({ brands });
            this.setState({ expanding: [rowData.id] });
        }

    }
    async addNewBrand(rowData) {
        await RestApi.setToken();

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });
        this.setState({ expanding: [-1] });


        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        // this.setState({ expanding: [-1] });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });

        if (this.state.brands.add_fetch_start == true) {
            var brands = { ...this.state.brands };
            brands.start = true;
            this.setState({ brands });
            // Db.brandrowexpand = true;
            await fetch(RestApi.isFetch("manufacturers"), RestApi.getFetchMethod()).then(response => {//manufacure fetch fetch
                if (response.ok) {
                    response.json().then(json => {

                        this.fetchManufacturersResponse(json);//response traversal

                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            await fetch(RestApi.isFetch("brands"), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        this.fetchBrandsResponse(rowData, json, "add");//response traversal
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

        }
        else {
            var brands = { ...this.state.brands };
            brands.add = true;
            brands.view = false;
            // brands.brand_expand_data = data;
            brands.brand_expand_open = [rowData.id];
            brands.id = rowData.id;
            //  brands.add_fetch_start = false;
            //brands.view_fetch_start = false;

            this.setState({ brands });
            this.setState({ expanding: [rowData.id] });
        }


    }
    tableInputSelectBrand(cellValue, rowData, nothing, cellFeild) {//brand select field
        var brand_options = this.state.brands.brands_dropdown;//= this.state.brands;//fetched category entity 

        if (rowData.status == "inactive")
            return (
                <div class="input-group">
                    <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => sortorder = false} onBlur={(data) => rowData[cellFeild] = data.target.value} />
                    <div >
                        {/* <i class="material-icons readonly-bg " readOnly style={{ 'margin-top': '8px' }}>expand_more</i>{' '}
                        <i class="material-icons readonly-bg " readOnly style={{ 'margin-top': '8px' }}>add</i> */}
                    </div>
                </div>
            );
        return (
            <div class="input-group">
                {/* <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} /> */}
                <Select
                    options={brand_options}
                    value={rowData.brand}
                    className="react-select-drop-w"
                    clearable={false}
                    onOpen={this.fetchBrand.bind(this, rowData, false)}
                    // onValueClick={this.isBrandExpand.bind(this, rowData)}
                    onChange={this.updateNewBrand.bind(this, rowData)}
                />

                <div >
                    <i class="material-icons" onClick={this.fetchBrand.bind(this, rowData, true)} style={{ 'margin-top': '8px' }}>expand_more</i>{' '}
                    <i class="material-icons" onClick={this.addNewBrand.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                </div>
            </div>
        );
        // console.log(rowData.brand);
        // if (rowData.status == "inactive")
        //     return (
        //         <Select
        //             disabled="disabled"
        //             value={rowData.brand}
        //         />);
        // else
        //     return (
        //         <Select
        //             options={brand_options}
        //             value={rowData.brand}
        //             onOpen={this.fetchBrand.bind(this, rowData)}
        //             // onValueClick={this.isBrandExpand.bind(this, rowData)}
        //             onChange={this.updateNewBrand.bind(this, rowData)}
        //         />
        //     );

    }
    // -------------------------------------------------------------------------------------------------------------brand end


    //promotion -----------------------------------------------------------------------------start
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
            if (json.album != null)
                json.image = json.album.permalink;
            var promotions = { ...this.state.promotions };
            promotions.promotion_expand_data = json;
            promotions.promotion_expand_open = [id];
            promotions.id = id;
            this.setState({ promotions });
            this.setState({ expanding: [id] });
        }
    }
    async fetch_prom(products, index, refId) {
        await RestApi.setToken();

        await fetch(RestApi.doProductWisePromoFilter(promotion_url, refId)).then(response => {//manufacure fetch fetch
            if (response.ok) {
                response.json().then(json => {
                    // this.setState({ promotion_f_start: false });
                    // console.log(index);
                    this.state.loadingbar = true;
                    var promo_arr = [];
                    for (var key in json) {
                        var data = json[key];
                        data.refId = key;
                        data.label = data.name;
                        data.value = data.name;
                        promo_arr.push(data);

                    };
                    products.p_t_data[index].related_promotion = promo_arr;
                    this.setState({ products });
                    // console.log(products.p_t_data[index].related_promotion);
                    // this.fetchPromotionResponse(json, rowData.id);//response traversal
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
    }
    async fetchPromotion(rowData, event) {


        this.setState({ loadingbar: true });
        var products = { ...this.state.products };

        for (var i = 0; i < products.p_t_data.length; i++) {
            if (products.p_t_data[i]) {
                const refId = "\"" + products.p_t_data[i].refId + "\"";

                await this.fetch_prom(products, i, refId);

            }

            if (products.p_t_data.length - 1 == i) {
                this.setState({ loadingbar: false });


            }

        }
        //  console.log(products.p_t_data);
        this.setState({ loadingbar: false });

        this.setState({ products });


        //WIN Cefpodoxime 50,Tidoxyl CLV 1.2 g - Injection,Miljon Pimple Gel




    }
    addNewPromotion(rowData) {
        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];

        this.setState({ categories });
        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });

        var promotions = { ...this.state.promotions };
        promotions.viewProm_active = false;
        promotions.promotion_expand_data = rowData;
        promotions.promotion_expand_open = [rowData.id];
        promotions.id = rowData.id;
        promotions.refId = rowData.refId;
        promotions.add_newProm_active = true;
        this.setState({ promotions });
        this.setState({ expanding: [rowData.id] });
    }
    onChangeUpdate(rowData, event) {
        var promotion_obj_struct = {
            _id: event.refId,
            refId: event.refId,
            code: event.code,
            name: event.name,
            slug: event.slug,
            tags: event.tags,
            label: event.name,
            value: event.name,
        };
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].promotion_name = event.name;
        products.p_t_data[rowData.id].promotion = promotion_obj_struct;
        products.p_t_data[rowData.id].change_promotion = {
            promotion: {
                _id: event.refId,
                refId: event.refId,
                code: event.code,
                name: event.name,
                slug: event.slug,
                tags: event.tags,
            }
        };
        this.setState({ products });

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [rowData.id];
        promotions.id = rowData.id;
        promotions.viewProm_active = true;
        promotions.add_newProm_active = false;
        promotions.promotion_expand_data = event;
        this.setState({ expanding: [rowData.id] });
        this.setState({ promotions });
        // console.log(event);
    }
    async viewPromotionDetails(rowData, event) {
        if (this.state.promotion_f_start == true) {
            this.setState({ promotion_f_start: false });
            await this.fetchPromotion(rowData);
            this.setState({ loadingbar: false });

        }

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];

        this.setState({ categories });
        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });
        if (rowData.promotion != null) {

            if (rowData.related_promotion != null) {
                for (var i = 0; i < rowData.related_promotion.length; i++) {
                    if (rowData.related_promotion[i].name == rowData.promotion.name || rowData.related_promotion[i].refId == rowData.promotion._id) {
                        var promotions = { ...this.state.promotions };
                        promotions.promotion_expand_open = [rowData.id];
                        promotions.id = rowData.id;
                        promotions.viewProm_active = true;
                        promotions.add_newProm_active = false;
                        promotions.promotion_expand_data = rowData.related_promotion[i];
                        promotions.promotion_expand_data.index = i;
                        this.setState({ expanding: [rowData.id] });
                        this.setState({ promotions });

                    }
                }
            }
            else
                alert("promotion error");

        }
        else
            alert("promotion is not found");

    }
    async openPromotion(rowData) {
        if (this.state.promotion_f_start == true) {
            this.setState({ promotion_f_start: false });
            await this.fetchPromotion(rowData);
            this.setState({ loadingbar: false });

        }
        else
            this.setState({ loadingbar: false });
    }
    tablePromotionInputField(cellValue, rowData, nothing, cellFeild) {

        if (rowData.id == 0 && this.state.products.add == true)
            return (
                <div class="input-group">

                    <input value={cellValue} readOnly className='filter text-filter form-control  readonly-bg ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
                    <div >
                        <i class="material-icons" onClick={this.addNewPromotion.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                    </div>
                </div>

            );

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        return (

            <div class="input-group">
                <Select
                    options={rowData.related_promotion}
                    value={rowData.promotion}
                    className="react-select-drop-w"
                    clearable={false}

                    onOpen={this.openPromotion.bind(this)}
                    // onValueClick={this.isBrandExpand.bind(this, rowData)}
                    onChange={this.onChangeUpdate.bind(this, rowData)}
                />


                <div >
                    {this.state.expanding != -1 && this.state.promotions.promotion_expand_open != -1 && rowData.id == this.state.promotions.promotion_expand_open ? <i class="material-icons" onClick={() => (this.setState({ expanding: [-1] }), this.state.promotions.promotion_expand_open = [-1])} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.viewPromotionDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}
                    <i class="material-icons" onClick={this.addNewPromotion.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                </div>
            </div>
            // <div class="input-group">
            //     <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            //     <div >
            //         <i class="material-icons" onClick={this.fetchPromotion.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>{' '}
            //         <i class="material-icons" onClick={this.addNewPromotion.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>

            //     </div>
            // </div>
        );
    }
    async  handleViewPromotionChangeValue(event, index) {

        var products = { ...this.state.products };

        // console.log("data", event, index);
        var save_promotion = {
            _id: event.refId,
            refId: event.refId,
            code: event.code,
            name: event.name,
            slug: event.slug,
            id: event.slug,
            tags: event.tags,
            label: event.name,
            value: event.value
        };






        // products.p_t_data[this.state.promotions.promotion_expand_open].promotion = save_promotion;
        // products.p_t_data[this.state.promotions.promotion_expand_open].variants.promotion = save_promotion;
        // products.p_t_data[this.state.promotions.promotion_expand_open].promotion_name = event.name;

        for (var i = 0; i < products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion.length; i++) {
            if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId == event.refId) {
                products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i] = event;
                products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].label = event.name;
                products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].value = event.name;
                products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = event.status;

            }
            // else {
            //     if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status == "active") {
            //         products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = "inactive";
            //         var status = {
            //             status: "inactive"
            //         };
            //         this.promotionDeactivate(products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId, status);

            //     }
            // }
        }


        console.log("pranav", products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion, index)
        // await this.setRelatedPromtionStatus(products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion, index);

        // console.log("pro",  products.p_t_data[this.state.promotions.promotion_expand_open]);
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_data = event;
        this.setState({ promotions });
        this.setState({ products });



    }
    async   promotionStateChangeFromPromotionRowExpand(event, status) {
        await RestApi.setToken();

        console.log(event, status)
        var products = { ...this.state.products };
        if (status == "active") {
            // this.state.rowData.status = "inactive";
            this.removePromotion(event);

            for (var i = 0; i < products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion.length; i++) {
                if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId == event.refId) {
                    products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = "inactive";
                    break;

                }
            }



            return;
        }

        var status = {
            status: "active"
        };
        var time = {
            time: Math.round(new Date().getTime())
        };
        // activate promotion
        this.promotionDeactivate(event.refId, status);


        var set_promotion = {
            promotion: {
                _id: event.refId != null ? event.refId : event._id,
                refId: event.refId != null ? event.refId : event._id,
                code: event.code,
                name: event.name,
                slug: this.nameToSlugConvert(event.name),
                id: this.nameToSlugConvert(event.name),
                tags: event.tags,
            }
        };

        fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.promotions.promotion_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(set_promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


        fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.promotions.promotion_expand_open].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var refId = this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId != null ? this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId : this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants._id;

        fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(set_promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        for (var i = 0; i < products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion.length; i++) {
            if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId == event.refId) {
                products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = "active";

            }
            else {
                if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status == "active") {
                    products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = "inactive";
                    var status = {
                        status: "inactive"
                    };
                    this.promotionDeactivate(products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId, status);

                }
            }
        }
        products.p_t_data[this.state.promotions.promotion_expand_open].promotion = event;
        products.p_t_data[this.state.promotions.promotion_expand_open].promotion_name = event.name;
        this.setState({ products });
        this.setState({ products });

    }
    async  promotionDeactivate(refId, status) {
        await RestApi.setToken();
        fetch(RestApi.isFetch(promotion_url + "/" + refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                    console.log(json);
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var time = {
            time: Math.round(new Date().getTime())
        };
        fetch(RestApi.isFetch(promotion_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }



    async removePromotion(event) {

        await RestApi.setToken();

        var status = {
            status: "inactive"
        };
        fetch(RestApi.isFetch(promotion_url + "/" + event.refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var time = {
            time: Math.round(new Date().getTime())
        };
        fetch(RestApi.isFetch(promotion_url + "/" + event.refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
        var set_promotion_null = {
            promotion: null,
        };
        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[this.state.promotions.promotion_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(set_promotion_null)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[this.state.promotions.promotion_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var refId = this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId != null ? this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId : this.state.products.p_t_data[this.state.promotions.promotion_expand_ope].variants._id;

        fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(set_promotion_null)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end



        var products = { ...this.state.products };
        products.p_t_data[this.state.promotions.promotion_expand_open].promotion = '';
        products.p_t_data[this.state.promotions.promotion_expand_open].promotion_name = '';
        this.setState({ products });

        // var promotions = { ...this.state.promotions };
        // promotions.promotion_expand_open = [-1];
        // this.setState({ promotions });
        // // this.setState({ expanding: [-1] });
    }
    async  onSaveNewPromotion(promotion, save) {
        // var promotions = { ...this.state.promotions };
        // console.log(promotion);


        // // promotions.promotion_dropdown.push(promotion);
        // this.setState({ promotions });


        var promo_to_product_t = {
            _id: promotion.refId,
            refId: promotion.refId,
            name: promotion.name,
            code: promotion.code,
            slug: promotion.slug,
            tags: promotion.tags,
            label: promotion.name,
            value: promotion.name,
        };
        var products = { ...this.state.products };
        products.p_t_data[this.state.promotions.promotion_expand_open].save_new_promotion = promotion;
        products.p_t_data[this.state.promotions.promotion_expand_open].promotion_refId = promotion.refId;
        if (products.p_t_data[this.state.promotions.promotion_expand_open].refId != null) {
            this.addnewpromotiontoProducts(promotion);
        }

        products.p_t_data[this.state.promotions.promotion_expand_open].promotion = promo_to_product_t;
        if (products.p_t_data[this.state.promotions.id].related_promotion != null) {

            products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion.push(promotion);
        }
        else
            products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion = [promotion];

        products.p_t_data[this.state.promotions.promotion_expand_open].promotion_name = promo_to_product_t.name;


        for (var i = 0; i < products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion.length; i++)
            if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId != promotion.refId) {

                if (products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status == "active") {
                    products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].status = "inactive";
                    var status = {
                        status: "inactive"
                    };
                    this.promotionDeactivate(products.p_t_data[this.state.promotions.promotion_expand_open].related_promotion[i].refId, status);

                }
            }

        //  console.log(products.p_t_data[this.state.promotions.id]);
        this.setState({ products });
        var promotions = { ...this.state.promotions };
        // promotions.id = promotions.promotion_expand_open;
        promotions.viewProm_active = true;
        promotions.add_newProm_active = false;
        promotions.promotion_expand_data = promotion;
        // this.setState({ expanding: [ promotions.promotion_expand_open] });
        this.setState({ promotions });



    }
    async   addnewpromotiontoProducts(promotion) {
        await RestApi.setToken();

        var promo_to_product_t = {
            promotion: {
                _id: promotion.refId,
                refId: promotion.refId,
                name: promotion.name,
                code: promotion.code,
                slug: promotion.slug,
                tags: promotion.tags,
            }
        };
        var time = {
            time: Math.round(new Date().getTime()),
        }
        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[this.state.promotions.promotion_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(promo_to_product_t)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(products_url + "/" + this.state.products.p_t_data[this.state.promotions.promotion_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        var refId = this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId != null ? this.state.products.p_t_data[this.state.promotions.promotion_expand_open].variants.refId : this.state.products.p_t_data[this.state.promotions.promotion_expand_ope].variants._id;

        fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(promo_to_product_t)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

        fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log("promotion status update", json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end


    }
    //promotion -----------------------------------------------------------------------------end



    //ptr & mrp
    //products variants all actions will done here------------------------------------------------start
    tableMrpInputField(cellValue, rowData, nothing, cellFeild) {//mrp
        if (rowData.id == 0 && this.state.products.add == true)
            return <input defaultValue={cellValue} pattern="^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$" required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} required readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        if (this.state.products.pm == true) {
            return (
                <input value={cellValue} required className='filter text-filter form-control  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        }
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} required className='filter text-filter form-control  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else
            return (
                <input defaultValue={cellValue} pattern="^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$" required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
    }


    tablePtrInputField(cellValue, rowData, nothing, cellFeild) {//ptr
        if (rowData.id == 0 && this.state.products.add == true)
            return <input defaultValue={cellValue} pattern="^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$" required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} required readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        if (this.state.products.pm == true) {
            return (
                <input value={cellValue} required className='filter text-filter form-control  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        }
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} required className='filter text-filter form-control  ' onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else
            return (
                <input defaultValue={cellValue} pattern="^[0-9]*[.]{0,1}(\.[0-9][0-9]?)*$" required className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
    }



    //product variants------------------------------------------------------------------------end


    //category------------------------------------------------------------------------------start
    async update_expand(rowData, event) {
        await RestApi.setToken();
        var f_each_cat = [];

        //this.setState({ expanding: [-1] });

        var brands = { ...this.state.brands };
        brands.brand_expand_open = [-1];//close expand
        this.setState({ brands });
        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });

        for (var i = 0; i < event.length; i++) {
            var refId = event[i].refId;
            var ln = event.length;
            await fetch(RestApi.isFetch("categories/" + refId), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // var data = this.fetchOneCategoryResponse(json, refId);
                        // console.log(json);

                        json.refId = refId;
                        f_each_cat.push(json);//response traversal
                        // console.log(f_each_cat.length);
                        if (f_each_cat.length == ln) {

                            var categories = { ...this.state.categories };
                            categories.category_expand_open = [rowData.id];
                            categories.category_expand_data = f_each_cat;
                            this.setState({ categories });
                            this.setState({ expanding: [rowData.id] });
                        }
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
        }






    }
    async updateProductCategory(rowData, data) {

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
                    slug: data[i].slug,
                    tags: data[i].tags,
                    status: data[i].status,
                    id: i,
                    rowData_id: rowData.id,
                };
                cat_name += data[i].name + ",";
                cat_arr.push(update_cat);
            }


            var products = { ...this.state.products };
            products.p_t_data[rowData.id].categoryname = cat_name;
            products.p_t_data[rowData.id].category = await cat_arr;
            this.setState({ products });

            var categories = { ...this.state.categories };
            categories.category_expand_open = [rowData.id];
            categories.category_expand_data = cat_arr;

            this.setState({ categories });
            //  await this.update_expand(rowData, data);

        }
        else {
            var products = { ...this.state.products };
            products.p_t_data[rowData.id].categoryname = "";
            products.p_t_data[rowData.id].category = '';
            this.setState({ products });
        }
    }
    async handleCategroyChangeValue(event) {
        await RestApi.setToken();

        this.setState({ save_unsaved_category: false });
        var products = { ...this.state.products };

        var cat_arr = [];
        for (var i = 0; i < event.length; i++) {


            var cat_obj = {
                _id: event[i]._id,
                refId: event[i].refId,
                id: event[i].slug,
                slug: event[i].slug,
                name: event[i].name,
                tags: event[i].tags,

            };
            cat_arr.push(cat_obj);
        }

        var category = {
            category: cat_arr,
        }
        if (products.p_t_data[this.state.categories.category_expand_open].refId != null) {

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.categories.category_expand_open].refId), RestApi.getPatchMethod(category)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

            var time = {
                time: Math.round(new Date().getTime())
            };
            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.categories.category_expand_open].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
        }


        var cat_name = "";
        for (var i in event) {
            if (event.length - 1 == i)
                cat_name += event[i].name;
            else
                cat_name += event[i].name + ", ";
        }
        products.p_t_data[this.state.categories.category_expand_open].categoryname = cat_name;
        products.p_t_data[this.state.categories.category_expand_open].category = event;
        this.setState({ products });
        var categories = { ...this.state.categories };
        categories.category_expand_data = event;
        // categories.category_expand_open = [];
        this.setState({ categories });
        // this.setState({ expanding: [-1] });
    }
    async handleCategoryAddChangeValue(event, action) {
        await RestApi.setToken();

        var categories = { ...this.state.categories };


        // console.log(event);
        var products = { ...this.state.products };
        if (products.p_t_data[this.state.categories.category_expand_open].category == null) {
            products.p_t_data[this.state.categories.category_expand_open].categoryname = event.name;

            products.p_t_data[this.state.categories.category_expand_open].category = [event];
        }
        else {
            products.p_t_data[this.state.categories.category_expand_open].categoryname += "," + event.name;


            products.p_t_data[this.state.categories.category_expand_open].category.push(event);
        }

        if (products.p_t_data[this.state.categories.category_expand_open].refId != null) {

            var event = products.p_t_data[this.state.categories.category_expand_open].category;
            var cat_arr = [];
            for (var i = 0; i < event.length; i++) {


                var cat_obj = {
                    _id: event[i]._id,
                    refId: event[i].refId,
                    id: event[i].slug,
                    slug: event[i].slug,
                    name: event[i].name,
                    tags: event[i].tags,

                };
                cat_arr.push(cat_obj);
            }

            var category = {
                category: cat_arr,
            }

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.categories.category_expand_open].refId), RestApi.getPatchMethod(category)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

            var time = {
                time: Math.round(new Date().getTime())
            };
            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.categories.category_expand_open].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end



        }





        categories.id = products.p_t_data[this.state.categories.category_expand_open].id;
        categories.category_expand_data = products.p_t_data[this.state.categories.category_expand_open].category;


        event.label = event.name;
        event.value = event.name;
        categories.category_dropdown.push(event);
        // this.setState({ categories });

        categories.view = true;
        categories.add = false;
        this.setState({ products });
        this.setState({ categories });
    }
    fetchOneCategoryResponse(json, refId) {

        json.label = json.name;
        json.value = json.name;
        json.slug = json.slug;
        json._id = refId;
        json.refId = refId;

        return json;
    }
    async isCategoryExpand(rowData, ev) //brand expand
    {
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });



        // console.log(ev);
        // for (var i in rowData.category) {
        //     rowData.category[i].id = i;
        //     rowData.category[i].rowData_id = rowData.id;
        // }
        if (rowData.category != null) {
            var categories = { ...this.state.categories };
            categories.category_expand_open = [rowData.id];
            categories.category_expand_data = rowData.category;
            categories.view = true;
            categories.add = false;

            categories.id = rowData.id;
            this.setState({ categories });
            this.setState({ expanding: [rowData.id] })
        }
        else {
            var categories = { ...this.state.categories };
            categories.category_expand_open = [rowData.id];
            categories.category_expand_data = [];
            categories.view = true;
            categories.add = false;

            categories.id = rowData.id;
            this.setState({ categories });
            this.setState({ expanding: [rowData.id] })
        }
        // console.log(this.state.categories);


    }
    addNewCategory(rowData) {
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });



        var categories = { ...this.state.categories };
        categories.category_expand_open = [rowData.id];
        categories.category_expand_data = rowData.category;
        categories.view = false;
        categories.add = true;
        categories.id = rowData.id;
        this.setState({ categories });
        this.setState({ expanding: [rowData.id] })
        // console.log(this.state.categories);

    }
    tableInputCategorySelectField(cellValue, rowData, nothing, cellFeild) {//brand select field
        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        var br_color = "filter text-filter form-control readonly-bg border-color-red";
        if (cellValue) {
            br_color = "filter text-filter form-control readonly-bg border-color-green";
        }
        return (
            <div class="input-group">
                <input value={cellValue} readOnly required className={br_color} onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    {this.state.categories.category_expand_open != -1 && rowData.id == this.state.categories.category_expand_open && this.state.expanding != -1 ? <i class="material-icons" onClick={() => this.setState({ expanding: [-1] })} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.isCategoryExpand.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}
                    <i class="material-icons" onClick={this.addNewCategory.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>

                </div>
            </div>
            // <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );



        // if (rowData.status == "inactive")
        //     return (<Select
        //         multi
        //         disabled="disabled"
        //         /* options={Store.form} */
        //         value={rowData.category}
        //     />);
        // else
        //     return (
        //         <Select
        //             //options={brand_options}
        //             onOpen={this.isCategoryExpand.bind(this, rowData)}
        //             onChange={this.updateProductCategory.bind(this, rowData)}
        //             multi
        //             value={rowData.category}
        //             options={this.state.categories.category_dropdown}



        //         />
        //     );
    }
    //category---------------------------------------------------------------------------------end



    //   composition--------------------------------------------------------------------------start
    ChangeComposition(rowData, event) {//adding new composition to table data
        rowData.composition = event;
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].composition = event;
        this.setState({ products });
        var temp_name = '';
        rowData.composition.map((data, i) => {
            temp_name += data.value + ",";//adding name for sorting method
        });
        rowData.comp = temp_name;//assign the selected composition names to table data
        var compositions = { ...this.state.compositions };
        compositions.composition_expand_data = rowData.composition;
        compositions.composition_expand_open = [rowData.id];
        this.setState({ compositions });
        this.setState({ expanding: [rowData.id] });
    }
    openComposition(rowData) {
        // if (this.state.saved == false) {

        //     if (this.state.unsaved_category != null&& this.state.unsaved_category.length !=0) {
        //         this.setState({ save_unsaved_category: true });
        //         this.setState({ saved: true });
        //         return;
        //     }

        // }

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });
        this.setState({ expanding: [-1] });


        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });


        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });


        var compositions = { ...this.state.compositions };
        console.log("composition add", rowData.composition);
        if (rowData.composition == null)
            compositions.composition_expand_data = [];
        else
            compositions.composition_expand_data = rowData.composition;
        compositions.composition_expand_open = [rowData.id];
        this.setState({ compositions });
        this.setState({ expanding: [rowData.id] })
    }
    tableInputCompositionSelectField(cellValue, rowData, nothing, cellFeild) {//brand select field


        // return (
        //     <Select
        //         onChange={this.ChangeComposition.bind(this, rowData)}
        //         onOpen={this.openComposition.bind(this, rowData)}
        //         required
        //         multi
        //         value={rowData.composition}
        //     />
        // );

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        var br_color = "filter text-filter form-control readonly-bg border-color-red";
        if (cellValue) {
            br_color = "filter text-filter form-control readonly-bg border-color-green";
        }
        return (
            <div class="input-group">
                <input value={cellValue} readOnly required className={br_color} onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >
                    {this.state.compositions.composition_expand_open != -1 && rowData.id == this.state.compositions.composition_expand_open && this.state.expanding != -1 ? <i class="material-icons" onClick={() => this.setState({ expanding: [-1] })} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.openComposition.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}
                    <i class="material-icons" onClick={this.openComposition.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>

                </div>
            </div>
            // <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );

    }
    //   composition--------------------------------------------------------------------------end
    //manufacture.........................................................................start
    async   viewManufactureDetails(rowData, event) {

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });



        var manufactures = this.state.manufacturers.manufacture_drop_down;

        for (var i = 0; i < manufactures.length; i++) {
            if (rowData.manufacture._id == manufactures[i].refId || rowData.manufacture.refId == manufactures[i].refId) {
                // console.log(rowData.manufacture);
                // console.log(manufactures[i]);
                var manufacturers = { ...this.state.manufacturers };
                manufacturers.manufacture_expand_data = [manufactures[i]];
                manufacturers.manufacture_expand_open = [rowData.id];
                manufacturers.add = false;
                manufacturers.view = true;
                manufacturers.id = rowData.id;

                this.setState({ expanding: [rowData.id] });
                this.setState({ manufacturers });

                break;
            }
        }

    }
    addManufactureDetails(rowData, event) {
        // console.log("manufac");
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });


        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [rowData.id];

        manufacturers.add = true;
        manufacturers.view = false;
        manufacturers.id = rowData.id;

        this.setState({ expanding: [rowData.id] });
        this.setState({ manufacturers });

    }
    async    handleAddProductChangeValue(new_m_data) {
        await RestApi.setToken();

        var products = { ...this.state.products };
        products.p_t_data[this.state.manufacturers.manufacture_expand_open].manufacture = new_m_data;
        products.p_t_data[this.state.manufacturers.manufacture_expand_open].manufacture_name = new_m_data.name;

        var store_m_data = {
            manufacturer: {
                _id: new_m_data.refId,
                refId: new_m_data.refId,
                id: new_m_data.id,
                slug: new_m_data.slug,
                name: new_m_data.name,
                tags: new_m_data.tags
            }
        };
        if (products.p_t_data[this.state.manufacturers.manufacture_expand_open].refId != null) {
            var refId = this.state.products.p_t_data[this.state.manufacturers.manufacture_expand_open].variants.refId != null ? this.state.products.p_t_data[this.state.manufacturers.manufacture_expand_open].variants.refId : this.state.products.p_t_data[this.state.manufacturers.manufacture_expand_open].variants._id;

            fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(store_m_data)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            var time = {
                time: Math.round(new Date().getTime()),
            };
            fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end



        }



        this.setState({ products });
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_drop_down.push(new_m_data);
        manufacturers.manufacture_expand_data = [new_m_data];
        manufacturers.add = false;
        manufacturers.view = true;
        this.setState({ manufacturers });



    }
    onChangeManufactureUpdate(rowData, event) {
        var store_manu = {
            _id: event.refId,
            refId: event.refId,
            name: event.name,
            tags: event.tags,
            label: event.name,
            value: event.name
        };
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].manufacture = store_manu;
        products.p_t_data[rowData.id].manufacture_name = event.name;
        this.setState({ products });
        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_data = [event];

        this.setState({ manufacturers });


    }

    tableInputManufactureField(cellValue, rowData, nothing, cellFeild) {//brand select field

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );

        var border_clr = rowData.manufacture_name != null ? 'green' : 'red';

        return (

            <div class="input-group">
                <Select
                    value={rowData.manufacture}
                    options={this.state.manufacturers.manufacture_drop_down}
                    className="m-react-select-drop-w"
                    clearable={false}
                    style={{ 'border-color': border_clr }}
                    onChange={this.onChangeManufactureUpdate.bind(this, rowData)}
                />

                <div >
                    {this.state.manufacturers.manufacture_expand_open != -1 && rowData.id == this.state.manufacturers.manufacture_expand_open && this.state.expanding != -1 ? <i class="material-icons" onClick={() => this.setState({ expanding: [-1] })} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.viewManufactureDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}
                    <i class="material-icons" onClick={this.addManufactureDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                </div>
            </div>
        );



    }





    //sku ------------------------------------------------------------------------------------start

    addSkusDetails(rowData) {
        if (this.state.products.add == true && rowData.uom_t_sku == null) {
            this.setState({ open_sku_error_msg: true });
            return;
        }

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });


        var skus = { ...this.state.skus };
        skus.sku_expand_data = rowData;
        skus.sku_expand_open = [rowData.id]
        skus.manufacture = this.state.manufacturers.manufacture_drop_down;
        skus.add = true;
        skus.view = false;
        skus.id = rowData.id;
        this.setState({ skus });
        this.setState({ expanding: [rowData.id] });
    }
    async handleAddSkusChangeValue(new_sku) {
        await RestApi.setToken();

        console.log(new_sku);
        var products = { ...this.state.products };
        var store_sku_object = {
            _id: new_sku.refId,
            refId: new_sku.refId,
            name: new_sku.name,
            slug: new_sku.slug,
            id: new_sku.id
        };
        // console.log("products", products.p_t_data[this.state.expanding]);
        // console.log("products-sku", products.p_t_data[this.state.expanding].sku);
        if (new_sku.manufacturer)
            products.p_t_data[this.state.skus.sku_expand_open].manu_name = new_sku.manufacturer.name;
        if (products.p_t_data[this.state.skus.sku_expand_open].refId) {

            var sku = {
                sku: {
                    _id: new_sku.refId,
                    refId: new_sku.refId,
                    name: new_sku.name,
                    slug: new_sku.slug,
                    id: new_sku.id
                }
            }

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.skus.sku_expand_open].refId + "/variants/0"), RestApi.getPatchMethod(sku)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

            var time = {
                time: Math.round(new Date().getTime()),
            };
            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.skus.sku_expand_open].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end
            var refId = this.state.products.p_t_data[this.state.skus.sku_expand_open].variants.refId != null ? this.state.products.p_t_data[this.state.skus.sku_expand_open].variants.refId : this.state.products.p_t_data[this.state.skus.sku_expand_open].variants._id;

            fetch(RestApi.isFetch(productvariant_url + "/" + refId), RestApi.getPatchMethod(sku)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

            fetch(RestApi.isFetch(productvariant_url + "/" + refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end


        }
        else {
            products.p_t_data[this.state.skus.sku_expand_open].save_new_sku = new_sku;

        }

        products.p_t_data[this.state.skus.sku_expand_open].sku = store_sku_object;
        products.p_t_data[this.state.skus.sku_expand_open].sku_name = new_sku.name;

        var skus = { ...this.state.skus };
        skus.sku_expand_data = products.p_t_data[this.state.skus.sku_expand_open];
        skus.add = false;
        skus.view = true;
        this.setState({ skus });

        this.setState({ products });


    }
    tableInputSkusField(cellValue, rowData, nothing, cellFeild) {//brand select field

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        var br_color = "filter text-filter form-control readonly-bg border-color-red";
        if (cellValue) {
            br_color = "filter text-filter form-control readonly-bg border-color-green";
        }
        return (
            <div class="input-group">
                <input value={cellValue} readOnly className={br_color} onBlur={(data) => rowData[cellFeild] = data.target.value} />
                <div >

                    {this.state.skus.sku_expand_open != -1 && rowData.id == this.state.skus.sku_expand_open && this.state.expanding != -1 ? <i class="material-icons" onClick={() => this.setState({ expanding: [-1] })} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.viewSkusDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}

                    <i class="material-icons" onClick={this.addSkusDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                </div>
            </div>
        );



    }

    async viewSkusDetails(rowData) {
        await RestApi.setToken();

        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });

        var uoms = { ...this.state.uoms };
        uoms.uom_expand_open = [-1];
        this.setState({ uoms });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });

        if (rowData.sku != null) {

            var refId = rowData.sku._id != null ? rowData.sku._id : rowData.sku.refId;
            await fetch(RestApi.isFetch(skus_url + "/" + refId + "/manufacturer"), RestApi.getFetchMethod()).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        rowData.manu_name = json.name;
                        var skus = { ...this.state.skus };
                        skus.sku_expand_data = rowData;
                        skus.sku_expand_open = [rowData.id]
                        // skus.manufacture = this.state.manufacturers.manufacture_drop_down;
                        skus.add = false;
                        skus.view = true;

                        skus.id = rowData.id;
                        this.setState({ skus });
                        this.setState({ expanding: [rowData.id] });


                    });
                }
                else
                    this.props.history.replace('/login');

            }).catch(function (error) { console.log(error); });//end
        }
        else {
            if (this.state.products.add == true && rowData.uom_t_sku == null) {
                this.setState({ open_sku_error_msg: true });
                return;
            }
            var skus = { ...this.state.skus };
            skus.sku_expand_data = rowData;
            skus.sku_expand_open = [rowData.id]
            skus.manufacture = this.state.manufacturers.manufacture_drop_down;
            skus.add = true;
            skus.view = false;
            skus.id = rowData.id;
            this.setState({ skus });
            this.setState({ expanding: [rowData.id] });
        }
    }
    //sku ------------------------------------------------------------------------------------end

    //uom-------------------------------------------------------------------------------------------start()
    async storeFetchedUoms(json, uoms, rowData) {
        var uom_arr = [];
        for (var key in json) {
            // this.setState({ loadingbar: true });
            var data = json[key];
            data.refId = key;
            data.label = data.name;
            data.value = data.name;
            uom_arr.push(data);
        }
        var uoms = { ...this.state.uoms };
        uoms.uom_drop_down = await uom_arr;


        if (await uoms.uom_drop_down.length != 0) {

            var uom_arr_drop = [], refId;
            if (rowData.uom != null)
                for (var i = 0; i < rowData.uom.length; i++) {

                    var uom = rowData.uom[i];

                    if (uom.refId != null)
                        refId = uom.refId;
                    else
                        refId = uom._id;
                    for (var j = 0; j < uoms.uom_drop_down.length; j++) {
                        if (refId == uoms.uom_drop_down[j].refId) {
                            uom_arr_drop.push(uoms.uom_drop_down[j]);
                            break;
                        }
                    }
                }


            // console.log(uom_arr_drop);
            var products = { ...this.state.products };
            products.p_t_data[rowData.id].related_uom = await uom_arr_drop;
            this.setState({ products });
            // var uoms = { ...this.state.uoms };
            uoms.uom_expand_data = await uom_arr_drop;
            uoms.uom_expand_open = [rowData.id];
            uoms.id = rowData.id;
            uoms.add = false;
            uoms.view = true;
            this.setState({ uoms });
            this.setState({ expanding: [rowData.id] });
        }



        this.setState({ uoms });
        this.setState({ loadingbar: false });


    }
    async  startUomsFetchData(rowData, uoms) {
        await RestApi.setToken();

        await fetch(RestApi.isFetch(uoms_url), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    this.setState({ loadingbar: true });

                    this.storeFetchedUoms(json, uoms, rowData);
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end

    }
    async openFetchUoms(rowData) {
        if (this.state.uom_f_start == true) {
            this.setState({ uom_f_start: false });
            var uoms = { ...this.state.uoms };
            await this.startUomsFetchData(rowData, uoms);
            // this.setState({ uoms });
        }
    }
    async  viewUomsDetails(rowData) {
        var promotions = { ...this.state.promotions };
        promotions.promotion_expand_open = [-1];
        this.setState({ promotions });

        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });

        var manufacturers = { ...this.state.manufacturers };
        manufacturers.manufacture_expand_open = [-1];
        this.setState({ manufacturers });

        var skus = { ...this.state.skus };
        skus.sku_expand_open = [-1];
        this.setState({ skus });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });


        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });


        var uom, refId, uom_arr = [];
        if (this.state.uom_f_start == true) {
            var uoms = { ...this.state.uoms };

            this.setState({ uom_f_start: false });
            await this.startUomsFetchData(rowData, uoms);

            // this.setState({ loadingbar: false });


        }
        else {
            if (rowData.uom != null) {
                console.log(this.state.uoms)
                for (var i = 0; i < rowData.uom.length; i++) {

                    uom = rowData.uom[i];

                    if (uom.refId != null)
                        refId = uom.refId;
                    else
                        refId = uom._id;
                    for (var j = 0; j < await this.state.uoms.uom_drop_down.length; j++) {
                        if (refId == this.state.uoms.uom_drop_down[j].refId) {
                            uom_arr.push(await this.state.uoms.uom_drop_down[j]);
                            break;
                        }
                    }
                }


                // console.log(uom_arr);
                var products = { ...this.state.products };
                products.p_t_data[rowData.id].related_uom = await uom_arr;
                this.setState({ products });
                var uoms = { ...this.state.uoms };
                uoms.uom_expand_data = await uom_arr;
                uoms.uom_expand_open = [rowData.id];
                uoms.id = rowData.id;
                uoms.add = false;
                uoms.view = true;
                this.setState({ uoms });
                this.setState({ expanding: [rowData.id] });
            }
            else {
                var products = { ...this.state.products };
                products.p_t_data[rowData.id].related_uom = [];
                this.setState({ products });
                var uoms = { ...this.state.uoms };
                uoms.uom_expand_data = [];
                uoms.uom_expand_open = [rowData.id];
                uoms.id = rowData.id;
                uoms.add = false;
                uoms.view = true;
                this.setState({ uoms });
                this.setState({ expanding: [rowData.id] });
            }
        }



    }
    async onChangeUomUpdate(event) {

        var rowData = this.state.products.p_t_data[this.state.uoms.uom_expand_open];
        // console.log(event);
        if (event != null) {
            console.log(event);
            var uom_arr = [], uom, refId, uom_name = "", uom_default;
            var store_uom = {
                default: '',
                values: []
            }
            for (var i = 0; i < event.length; i++) {
                uom = event[i];
                if (uom.refId != null)
                    refId = uom.refId;
                else
                    refId = uom._id;

                for (var j = 0; j < this.state.uoms.uom_drop_down.length; j++) {
                    if (refId == this.state.uoms.uom_drop_down[j].refId) {
                        uom_arr.push(this.state.uoms.uom_drop_down[j]);
                        uom_default = uom_arr[0].id;
                        uom_name += this.state.uoms.uom_drop_down[j].name + ", ";

                        var uom_data = this.state.uoms.uom_drop_down[j];
                        var store_uom_values = {
                            _id: uom_data.refId,
                            refId: uom_data.refId,
                            name: uom_data.name,
                            id: uom_data.id,
                            slug: uom_data.slug != null ? uom_data.slug : uom_data.id,
                            tags: uom_data.tags

                        };
                        store_uom.values.push(store_uom_values);


                        break;
                    }
                }
            }
            store_uom.default = uom_default;
            var products = { ...this.state.products };
            products.p_t_data[rowData.id].related_uom = await uom_arr;
            products.p_t_data[rowData.id].uom = await uom_arr;
            products.p_t_data[rowData.id].uom_name = uom_name;
            products.p_t_data[rowData.id].uom_default = uom_default;
            products.p_t_data[rowData.id].uom_t_sku = await store_uom;
            this.setState({ products });
            var uoms = { ...this.state.uoms };
            uoms.uom_expand_data = await uom_arr;
            uoms.update_sku_in_skus = await store_uom;
            uoms.uom_expand_open = [rowData.id];
            uoms.id = rowData.id;
            uoms.add = false;
            uoms.view = true;
            console.log(uoms)
            this.setState({ uoms });
            this.setState({ expanding: [rowData.id] });
        }
        else {
            var products = { ...this.state.products };
            products.p_t_data[rowData.id].uom = [];
            products.p_t_data[rowData.id].uom_name = "";
            this.setState({ products });
            var uoms = { ...this.state.uoms };
            uoms.uom_expand_data = [];
            uoms.update_sku_in_skus = null;

            uoms.uom_expand_open = [rowData.id];
            uoms.id = rowData.id;
            uoms.add = false;
            uoms.view = true;
            console.log(uoms)
            this.setState({ uoms });
            this.setState({ expanding: [rowData.id] });



        }



    }
    async addUomsDetails(rowData) {

        if (this.state.uom_f_start == true) {
            var uoms = { ...this.state.uoms };

            this.setState({ uom_f_start: false });
            await this.startUomsFetchData(rowData, uoms);
            this.setState({ uoms });

            // this.setState({ loadingbar: false });
        }
        var uoms = { ...this.state.uoms };

        uoms.uom_expand_open = [rowData.id];
        uoms.id = rowData.id;
        uoms.add = true;
        uoms.view = false;
        this.setState({ uoms });
        this.setState({ expanding: [rowData.id] });
    }
    tableInputUomsField(cellValue, rowData, nothing, cellFeild) {//brand select field

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        var br_color = "filter text-filter form-control readonly-bg border-color-red";
        if (cellValue) {
            br_color = "filter text-filter form-control readonly-bg border-color-green";
        }
        return (

            <div class="input-group">
                {/* <Select
                    value={rowData.uom}
                    options={this.state.uoms.uom_drop_down}
                    className="m-react-select-drop-uom-w Select-block"
                    multi
                    clearable={false}
                    onOpen={this.openFetchUoms.bind(this, rowData)}
                    onChange={this.onChangeUomUpdate.bind(this, rowData)}
                /> */}
                <input value={cellValue} readOnly className={br_color} onBlur={(data) => rowData[cellFeild] = data.target.value} />

                <div >
                    {this.state.uoms.uom_expand_open != -1 && rowData.id == this.state.uoms.uom_expand_open && this.state.expanding != -1 ? <i class="material-icons" onClick={() => this.setState({ expanding: [-1] })} style={{ 'margin-top': '8px' }}>expand_less</i> : <i class="material-icons" onClick={this.viewUomsDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>expand_more</i>}{' '}
                    <i class="material-icons" onClick={this.viewUomsDetails.bind(this, rowData)} style={{ 'margin-top': '8px' }}>add</i>
                </div>
            </div>
        );



    }
    //uom-------------------------------------------------------------------------------------------end

    // productVariants-------------------------------------------------------------------------start-not using
    async ChangeVariants(rowData, event) {
        var products = { ...this.state.products };
        products.p_t_data[rowData.id].variants = await event;
        products.p_t_data[rowData.id].variantnames = variantsname;
        this.setState({ products });
    }
    async productVariantFetch(rowData) {
        await RestApi.setToken();

        var rowdata = rowData.variants;

        var variant_arr = [];
        if (rowdata.length > 0) {
            // alert(rowdata.length)
            var promotion_name = "";
            for (var i = 0; i < rowdata.length; i++) {

                var refId;
                if (rowdata[i]._id != null)
                    refId = rowdata[i]._id;
                else
                    refId = rowdata[i].refId;
                rowdata[i].row_id = i;
                // console.log("pro", rowdata[i])
                if (rowdata[i].promotion != null)
                    promotion_name = rowdata[i].promotion.name;
                var promotion = {
                    data: rowdata[i].promotion

                };

                var ii = i;
                await fetch(RestApi.isFetch("productVariants/" + refId), RestApi.getFetchMethod()).then(response => {//products fetch
                    if (response.ok) {
                        response.json().then(json => {
                            // var data = this.fetchOneCategoryResponse(json, refId);
                            // console.log(rowdata[ii]);
                            json.refId = refId;
                            json.manufacturer_name = json.manufacturer.name;
                            json.mrp_value = json.mrp.value;
                            json.price_value = json.price.value;
                            json.sku_name = json.sku.name;
                            json.promotion = promotion.data;
                            json.promotion_name = promotion_name;
                            json.row_id = rowdata[ii].index;
                            for (var i in json.uom.values) {
                                json.uom.values[i].label = json.uom.values[i].name;
                                json.uom.values[i].value = json.uom.values[i].name;

                            }
                            var variants = { ...this.state.variants };
                            variant_arr.push(json);
                            // console.log(variant_arr);
                            variants.variant_expand_data = variant_arr;
                            variants.variant_expand_open = [rowData.id];
                            this.setState({ variants });
                            this.setState({ expanding: [rowData.id] })

                        });
                    }
                });

                // var variants = { ...this.state.variants };

            }



        }

    }
    async openVariant(rowData) {
        var brands = { ...this.state.brands };
        brands.brand_expand_open = [-1];
        this.setState({ brands });
        this.setState({ expanding: [-1] });

        var categories = { ...this.state.categories };
        categories.category_expand_open = [-1];
        this.setState({ categories });
        this.setState({ expanding: [-1] });

        var compositions = { ...this.state.compositions };
        compositions.composition_expand_open = [-1];
        this.setState({ compositions });
        this.setState({ expanding: [-1] });


        await this.productVariantFetch(rowData);
    }
    tableInputVariantsSelectField(cellValue, rowData, nothing, cellFeild) {//brand select field

        if (rowData.status == "inactive")
            return (
                <Select
                    disabled="disabled"
                    required
                    multi
                    value={rowData.variants}
                />
            );

        return (
            <Select

                required
                //  multi
                onChange={this.ChangeVariants.bind(this, rowData)}
                //    onOpen={this.openVariant.bind(this, rowData)}

                options={this.state.variants.variant_dropdown}
                value={rowData.variants}
            />
        );
    }
    // productVariants-------------------------------------------------------------------------end-not using






    // image ............................................................................start
    expandImage(rowData, event) {

        // var images = { ...this.state.images };
        // images.image_expand_open = [rowData.id];
        // images.image_expand_data = event;
        // this.setState({ images });

        var images = { ...this.state.images };
        images.image_expand_data = rowData.album != null ? rowData.album : "";
        images.image_expand_open = rowData.id;
        images.row_data = rowData;
        this.setState({ images });
        this.setState({ open_image_view: true });

    }
    addNewImage(event) {
        this.setState({ set_img_open: false });

        if (event.target.files && event.target.files[0]) {
            this.setState({ added_new_image: true });

            var products = { ...this.state.products };
            products.p_t_data[this.state.images.row_data.id].image_upload = event.target.files[0];

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ image: e.target.result });

                // products.p_t_data[this.state.images.row_data.id].album = e.target.result;
                var images = { ...this.state.images };
                images.image_expand_data = e.target.result;

                this.setState({ images });
                this.setState({ products });
            };
            reader.readAsDataURL(event.target.files[0]);

        }
    }
    tableImageFileField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        if (rowData.status == "inactive")
            return (
                <div class="input-group" >
                    <img src={cellValue} style={{ width: '210px', height: '35px' }} />


                </div>
            );
        // if (sortorder == true)
        //     return (
        //         <input value={cellValue} readOnly className='filter text-filter form-control readonly-bg  ' onClick={() => sortorder = false} onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );

        if (cellValue == "" || cellValue == null) {
            return (<div class="input-group no-image">

                <a class="add-image" onClick={this.expandImage.bind(this, rowData, cellValue)}>Add Image </a>


            </div>);
        }
        return (
            <div class="input-group">
                <img src={cellValue} style={{ width: '210px', height: '35px' }} onClick={this.expandImage.bind(this, rowData, cellValue)} />

                {/* <div >
                    {this.state.expanding != -1 && this.state.images.image_expand_open != -1 && rowData.id == this.state.expanding && cellFeild == "album" ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={() => (this.setState({ expanding: [-1] }), this.state.images.image_expand_open = [-1])}>expand_less</i> : null}
                    {this.state.expanding != -1 && this.state.images.image_expand_open != -1 && rowData.id != this.state.expanding && cellFeild == "album" ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.expandImage.bind(this, rowData, cellValue)} >expand_more</i> : null}
                    {this.state.images.image_expand_open == -1 ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.expandImage.bind(this, rowData, cellValue)}>expand_more</i> : null}

                </div> */}
            </div>
            // <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }





    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }
    handleBrandChangeValue(event) { //BrandRowExpand returning values

        for (var i = 0; i < this.state.brands.brands_dropdown.length; i++) {
            if (event.refId == this.state.brands.brands_dropdown[i].refId) {

                var brands = { ...this.state.brands };
                brands.brand_expand_data = event;
                brands.brands_dropdown[i] = event;
                this.setState({ brands });
                var products = { ...this.state.products };
                products.p_t_data[this.state.brands.brand_expand_open].brandname = event.name;
                var b_update_data = {
                    _id: event.refId,
                    refId: event.refId,
                    name: event.name,
                    slug: event.slug,
                    tags: event.tags
                };


                products.p_t_data[this.state.brands.brand_expand_open].brand = b_update_data;
                // console.log("mod", products.p_t_data[this.state.brands.brand_expand_open]);
                this.setState({ products });

                break;
            }
        }

    }
    handleAddBrandChangeValue(event, value) {
        var brands = { ...this.state.brands };
        var products = { ...this.state.products };
        if (value == "1") {
            var len = event.length;
            var data = event[len - 1];
            var brand = {
                name: data.name,
                refId: data.refId,
                slug: data.slug,
                tags: data.tags,
            }
            // console.log("pranav", brand);
            products.p_t_data[brands.brand_expand_open].brand = brand;
            products.p_t_data[brands.brand_expand_open].brandname = data.name;
            this.setState({ products });

        }
        brands.brands_dropdown = event;
        // brands.brand_expand_open=[-1];
        // this.setState({expanding:[-1]});
        this.setState({ brands });




    }
    handleCategoryChangeValue(event) {
        // console.log(event);
        var products = { ...this.state.products };
        products.p_t_data[event.rowData_id].category[event.id].value = event.name;
        products.p_t_data[event.rowData_id].category[event.id].label = event.name;
        products.p_t_data[event.rowData_id].category[event.id].name = event.name;
        products.p_t_data[event.rowData_id].category[event.id].slug = event.slug;
        products.p_t_data[event.rowData_id].category[event.id].status = event.status;
        this.setState({ products });

        for (var i = 0; i < this.state.categories.category_dropdown.length; i++) {
            if (this.state.categories.category_dropdown[i].refId == event.refId) {
                var categories = { ...this.state.categories };
                categories.category_dropdown[i].name = event.name;
                categories.category_dropdown[i].label = event.name;
                categories.category_dropdown[i].value = event.name;
                categories.category_dropdown[i].slug = event.slug;
                categories.category_dropdown[i].status = event.status;
                this.setState({ categories });

                break;
            }
        }


    }
    async handleCompositionChangeValue(event, compositionnameqty) {
        await RestApi.setToken();
        console.log("comp", event)
        var products = { ...this.state.products };
        products.p_t_data[this.state.compositions.composition_expand_open].composition = event;
        products.p_t_data[this.state.compositions.composition_expand_open].compositionnameqty = compositionnameqty;

        var comp_arr = [];
        for (var i = 0; i < event.length; i++) {
            var store_comp = {
                chemical: event[i].chemical,
                quantity: event[i].quantity,
            };
            comp_arr.push(store_comp);
        }
        if (products.p_t_data[this.state.compositions.composition_expand_open].refId != null) {


            var composition = {
                composition: comp_arr,
            }

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.compositions.composition_expand_open].refId), RestApi.getPatchMethod(composition)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end

            var time = {
                time: Math.round(new Date().getTime())
            };
            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.compositions.composition_expand_open].refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("promotion status update", json);
                    });
                }
                else
                    this.props.history.replace('/login');
            }).catch(function (error) { console.log(error); });//end


        }

        this.setState({ products });
        // this.setState({ expanding: [-1] });
    }
    expandComponent(row) {
        // console.log("expand", row)
        // if (this.state.brands.brand_expand_open != -1 && this.state.brands.id == row.id && this.state.brands.view == true){
        //     // console.log("row_expand1", this.state.brands);
        //     return ( 
        //              <BrandRowExpand data={this.state.brands} onChangeValue={this.handleBrandChangeValue} onCancel={() => this.setState({ expanding: [-1] })} />
        //     );
        // }
        // else if (this.state.brands.brand_expand_open != -1 && this.state.brands.id == row.id && this.state.brands.add == true) {

        //     return (<AddBrandRowExpand data={this.state.brands} onChangeValue={this.handleAddBrandChangeValue} onCancel={() => this.setState({ expanding: [-1] })} />
        //     );
        // }
        //else 
        if (this.state.promotions.promotion_expand_open != -1 && this.state.promotions.id == row.id && this.state.promotions.add_newProm_active == true) {
            return <AddPromotionRowExpand data={this.state.promotions} onChangeValue={this.onSaveNewPromotion} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.promotions.promotion_expand_open != -1 && this.state.promotions.id == row.id && this.state.promotions.viewProm_active == true) {
            return <PromotionRowExpand data={this.state.promotions} onChangeValue={this.handleViewPromotionChangeValue} onStatusChange={this.promotionStateChangeFromPromotionRowExpand.bind(this)} onRemove={this.removePromotion.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} />
        }

        else if (this.state.categories.category_expand_open != -1 && this.state.categories.id == row.id && this.state.expanding != -1 && this.state.categories.view == true && this.state.categories.category_expand_data != null) {
            // console.log("identtify", this.state.categories);
            return <CategoryRowExpand data={this.state.categories} onChangeValue={this.handleCategroyChangeValue} unsavedData={(data) => this.setState({ unsaved_category: data })} saved={(data) => this.state.saved = data} onCancel={() => this.setState({ expanding: [-1] })} />
            //  <CategoryRowExpand data={this.state.categories} onChangeValue={this.handleCategoryChangeValue} />
        }
        else if (this.state.categories.category_expand_open != -1 && this.state.categories.id == row.id && this.state.expanding != -1 && this.state.categories.add == true) {
            // console.log("identtify", this.state.categories);
            return <AddCategoryRowExpand data={this.state.categories} onChangeValue={this.handleCategoryAddChangeValue} onCancel={() => this.setState({ expanding: [-1] })} />

            //  <CategoryRowExpand data={this.state.categories} onChangeValue={this.handleCategoryChangeValue} />
        }
        else if (this.state.compositions.composition_expand_open != -1) {
            // console.log(this.state.compositions);
            return <CompositionRowExpand data={this.state.compositions} onChangeValue={this.handleCompositionChangeValue} onCancel={() => this.setState({ expanding: [-1] })} />

        }
        // else if (this.state.variants.variant_expand_open != -1) {
        //     // console.log("df");
        //     return <VariantRowExpand data={this.state.variants} />
        //         // <div>variant.....</div>


        // }
        else if (this.state.manufacturers.manufacture_expand_open != -1 && this.state.expanding != -1 && this.state.manufacturers.view == true && this.state.manufacturers.id == row.id) {
            return <ManufactureExpand data={this.state.manufacturers.manufacture_expand_data} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.manufacturers.manufacture_expand_open != -1 && this.state.expanding != -1 && this.state.manufacturers.add == true && this.state.manufacturers.id == row.id) {
            return <AddManufactureRowExpand onChangeValue={this.handleAddProductChangeValue.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.skus.sku_expand_open != -1 && this.state.expanding != -1 && this.state.skus.add == true && this.state.skus.id == row.id) {
            return <AddSkusRowExpand data={this.state.skus} products={this.state.products.p_t_data} onChangeValue={this.handleAddSkusChangeValue.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.skus.sku_expand_open != -1 && this.state.expanding != -1 && this.state.skus.view == true && this.state.skus.id == row.id) {
            return <ViewSkusRowExpand data={this.state.skus} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.uoms.uom_expand_open != -1 && this.state.expanding != -1 && this.state.uoms.view == true && this.state.uoms.id == row.id) {
            return <ViewUomsRowExpand data={this.state.uoms} onChangeValue={this.onChangeUomUpdate.bind(this)} product={this.state.products.p_t_data[row.id]} onCancel={() => this.setState({ expanding: [-1] })} />
        }
        else if (this.state.uoms.uom_expand_open != -1 && this.state.expanding != -1 && this.state.uoms.add == true && this.state.uoms.id == row.id) {
            return <AddUomsRowExpand data={this.state.uoms} onCancel={() => this.setState({ expanding: [-1] })} />
        }

        else if (this.state.images.image_expand_open != -1) {
            // console.log(this.state.images.image_expand_data);
            return (<div class="pull-right" >
                <FlatButton label="Choose file" labelPosition="before">
                    <input type="file" onChange={this.addNewImage} />
                </FlatButton>
                <img src={this.state.images.image_expand_data} style={{ width: '400px', height: '300px' }} />

            </div>


            )
        }
        else {
            return (
                <div>Loading.....</div>
            )
        }

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

    //pagination 
    renderShowsTotal(start, to, total) {
        return (
            <div style={{ color: 'black', float: 'left', }}>
                {start}  -  {to}  of &nbsp;
            </div>
        );
    }
    onToggleDropDown(option) {
        // do your stuff here
        //console.log('toggle dropdown');
        //console.log(option.target.value);
        this.setState({ drop_val: option.target.value });
        // this.props.onSizePerPageList(Number(option.target.value))
    }
    renderSizePerPageDropDown(props) {
        return (
            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control input-sm' size='1' onChange={this.onToggleDropDown}>

                <option value='10'  >10 per page</option>
                <option value='25' selected="selected" >25 per page</option>
                <option value='50'>50 per page</option>
                <option value='100'>100 per page</option>
                <option value='200'>200 per page</option>
            </select>
        );
    }
    //new product add
    async  addNewProductLine(event) {
        this.setState({ expanding: [-1] });
        var products = { ...this.state.products };
        if (this.state.products.add == false) {
            products.add = true;
            this.setState({ products });
            // console.log("firstline", products.p_t_data[0]);
            var p_t_format_store = {
                id: 0,
                name: '',
                form: '',
                promotion_name: '',
                ptr: '',
                mrp: '',
                status: "active"
            };
            var new_product_table = [];
            new_product_table.push(p_t_format_store);

            for (var i = 0; i < products.p_t_data.length; i++) {
                products.p_t_data[i].id = i + 1;
                new_product_table.push(products.p_t_data[i]);
            }
            products.p_t_data = await new_product_table;
            this.setState({ products });

        }
        else {
            this.setState({ open_new_p_cancel: true });

        }
    }

    //cancel 
    async cancelNewProduct(event) {


        var products = { ...this.state.products };
        if (products.add == true) {
            products.add = false;
            products.pm = true;
            this.setState({ products });

            



            var new_p_t_data = [];
            for (var i = 1; i < products.p_t_data.length; i++) {
                products.p_t_data[i].id = i - 1;
                new_p_t_data.push(products.p_t_data[i]);
            }
            if (await new_p_t_data.length != 0) {
                products.p_t_data = await new_p_t_data;
                products.add = false;
                // console.log("nwe",products.p_t_data)
                this.setState({ products });

                products.pm = false;
                this.setState({ products });
            }
            this.setState({ open_new_p_cancel: false });
        }
    }
  

    async    deleteImage() {
        await RestApi.setToken();

        this.setState({ d_image_d_open: false });
        this.setState({ open_image_up: false });


        var products = { ...this.state.products };
        products.p_t_data[this.state.images.image_expand_open].album = "";
        products.p_t_data[this.state.images.image_expand_open].image_upload = null;

        var product_store = {
            album: null,
        }

        if (products.p_t_data[this.state.images.image_expand_open].refId != null) {
            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.images.image_expand_open].refId), RestApi.getPatchMethod(product_store)).then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        // console.log("updated_product----", json);

                    });
                }
                else
                    this.setState({ open_img_upload: false });


            }).catch(err => err);
            var time = {
                time: Math.round(new Date().getTime()),
            };

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.images.image_expand_open].refId), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log(json)
                    });
                }
                else
                    RestApi.isTokenExpried();

            }).catch(function (error) { console.log(error); });//end

        }


        this.setState({ products });

        var images = { ...this.state.images };
        images.image_expand_data = "";
        this.setState({ images });
    }
    async uploadImage() {
        await RestApi.setToken();

        this.setState({ open_image_up: false });
        this.setState({ added_new_image: false });

        var products = { ...this.state.products };
        products.p_t_data[this.state.images.row_data.id].album = this.state.images.image_expand_data;

        this.setState({ open_image_view: false });

        var product_store = {};


        if (products.p_t_data[this.state.images.row_data.id].image_upload != null && products.p_t_data[this.state.images.row_data.id].refId != null) {

            var permalink = {};
            if (products.p_t_data[this.state.images.row_data.id].album != '') {
                var slug = this.createSlug(products.p_t_data[this.state.images.row_data.id]);
                var url = f_img_url + slug + '%2F' + slug;
                permalink.permalink = (f_img_url + slug + '%2F' + slug + '?alt=media')

                product_store.album = permalink;//image link

                fetch(url, RestApi.getPostImageMethod(products.p_t_data[this.state.images.row_data.id].image_upload)).then(res => {
                    if (res.ok) {

                        res.json().then(json => {
                        });
                    }
                    else
                        this.props.history.replace('/login');

                }).catch(err => err);

            }



            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.images.row_data.id].refId), RestApi.getPatchMethod(product_store)).then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        // console.log("updated_product----", json);

                    });
                }
                else
                    this.setState({ open_img_upload: false });


            }).catch(err => err);
            var time = {
                time: Math.round(new Date().getTime()),
            };

            fetch(RestApi.isFetch(products_url + "/" + products.p_t_data[this.state.images.row_data.id].refId), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log(json)
                    });
                }
                else
                    RestApi.isTokenExpried();

            }).catch(function (error) { console.log(error); });//end


        }
        this.setState({ products });


    }
    trClassFormat(rowData, rIndex) {
        return rIndex == 0 && this.state.products.add == true ? 'tr-bg-color' : '';
    }
    render() {

        if (this.state.promotions.viewProm_active == true) {
            this.state.loadingbar = false;
        }
        //dailogs
        const actions2 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ show_activeinactive: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openDialogActiveInactive}

            />,
        ];


        const product_promotion_state = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                Activate
                onClick={() => (this.state.row_status == "Activate" ? this.productPromotionDeactivateStateChange() : this.setState({ pro_state_promo_open: false }))}
            /* onClick={() => this.setState({ pro_state_promo_open: false })} */
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.productPromotionStateChange.bind(this)}

            />,
        ];
        const update_products = [ //dailog actions
            <FlatButton
                disabled={this.state.open_product_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_product_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.open_product_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_product_upload: true }), this.saveProductDetails())}

            />,
        ];
        const save_newproducts = [ //new product actions
            <FlatButton
                disabled={this.state.open_product_upload}
                label="No"
                primary={true}
                onClick={() => this.setState({ open_product_upload: false, open_s_d_new_p: false })}
            />,
            <FlatButton
                disabled={this.state.open_product_upload}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ open_product_upload: true }), this.newProductSave())}

            />,
        ];
        const actions_cancel = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ open_new_p_cancel: false })}
            />,
            <FlatButton

                label="Yes"
                primary={true}
                onClick={this.cancelNewProduct.bind(this)}

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
        const save_cat = [ //dailog actions
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => this.setState({ save_unsaved_category: false })}
            />,
            <FlatButton

                label="Save"
                primary={true}
                onClick={this.handleCategroyChangeValue.bind(this, this.state.unsaved_category)}

            />
        ];

        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,

            sizePerPageDropDown: this.renderSizePerPageDropDown,
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
        // console.log(this.state.products.p_t_data);
        return (
            <div className="was-validated">
                {this.state.products.p_t_data.length == 0 || this.state.manu_f_finsh == false ?
                    //  <div class="spinner"></div>
                    <div class="sk-folding-cube">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                    </div>
                    : null}
                {this.state.products.p_t_data.length != 0 && this.state.manu_f_finsh == true ?
                    <Row className="user-div" >
                        <div style={{ 'overflow-x': 'scroll' }} >
                            <Col xs="12" md="12">
                                <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                    <CardBody className="">

                                        <BootstrapTable data={this.state.products.p_t_data} className="user-table"
                                            trClassName={this.trClassFormat.bind(this)}
                                            expandableRow={this.isExpandableRow}
                                            expandComponent={this.expandComponent}
                                            options={options}
                                            pagination
                                            width="100"
                                            ref="table"
                                            version="4" condensed ref='table'
                                            tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-13.5px', 'margin-right': '-16px', ' margin-top': '-1.99%', cursor: 'pointer' }}

                                        //  tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-2.0%', 'margin-right': '-2.0%', ' margin-top': '-1.99%', cursor: 'pointer' }} 
                                        >

                                            <TableHeaderColumn tdStyle={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }} isKey={true} row='0' dataField='id' editable={false} expandable={false} className="pos" rowSpan='2' width='60' dataAlign='center' dataFormat={this.customActionMenu.bind(this)} >
                                                <div class="product-float-action-fixed">
                                                    <div class="add-margin-top">
                                                        <FloatingActionButton backgroundColor="green" mini={true} zDepth={2} onClick={this.addNewProductLine.bind(this)}>
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

                                            <TableHeaderColumn dataField='form' dataAlign="center" width="220" row="0" >Form
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "form", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "form", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            {/* <TableHeaderColumn dataField='brandname' width="290" expandable={false} dataAlign="center" row="0" >Brand

                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "brandname", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "brandname", "desc")} />
                                                </IconMenu>


                                            </TableHeaderColumn> */}

                                            <TableHeaderColumn dataField='promotion_name' expandable={false} row="0" dataAlign="center" width="320"  >Promotion
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "promotion_name", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "promotion_name", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='ptr' expandable={false} row="0" dataAlign="center" width="150"  >PTR
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "ptr", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "ptr", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='mrp' expandable={false} row="0" dataAlign="center" width="150"  >MRP
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "mrp", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "mrp", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='categoryname' expandable={false} dataAlign="center" width="280" row="0" >Category
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "categoryname", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "categoryname", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='compositionnameqty' expandable={false} dataAlign="center" width="420" row="0"  >Composition
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "compositionnameqty", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "compositionnameqty", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='manufacture_name' expandable={false} dataAlign="center" width="420" row="0"  >Manufacturer
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "manufacture_name", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "manufacture_name", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='uom_name' expandable={false} dataAlign="center" width="410" row="0"  >Uoms
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "uom_name", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "uom_name", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>




                                            <TableHeaderColumn dataField='sku_name' expandable={false} dataAlign="center" width="320" row="0"  >Sku
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "sku_name", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "sku_name", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>


                                            <TableHeaderColumn dataField='album' expandable={false} dataAlign="center" width="220" row="0" >Image  </TableHeaderColumn>



                                            <TableHeaderColumn dataAlign="center" width="220" dataField='name' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Product Name' }} dataFormat={this.tableNameInputField}> </TableHeaderColumn>

                                            <TableHeaderColumn dataField='form' expandable={false} dataAlign="center" width="220" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a form' }} dataFormat={this.tableInputSelectFormField}></TableHeaderColumn>

                                            {/* <TableHeaderColumn dataField='brandname' width="290" expandable={false} dataAlign="center" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a Brand Name' }} dataFormat={this.tableInputSelectBrand}> </TableHeaderColumn> */}

                                            <TableHeaderColumn dataField='promotion_name' dataAlign="center" width="320" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a promotion' }} dataFormat={this.tablePromotionInputField}> </TableHeaderColumn>

                                            <TableHeaderColumn dataField='ptr' dataAlign="center" width="150" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a ptr' }} dataFormat={this.tablePtrInputField}> </TableHeaderColumn>

                                            <TableHeaderColumn dataField='mrp' dataAlign="center" width="150" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a mrp' }} dataFormat={this.tableMrpInputField}> </TableHeaderColumn>

                                            <TableHeaderColumn dataField='categoryname' expandable={false} dataAlign="center" columnClassName="" width="280" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a Category Name' }} dataFormat={this.tableInputCategorySelectField} > </TableHeaderColumn>

                                            <TableHeaderColumn dataField='compositionnameqty' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="420" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a Composition' }} dataFormat={this.tableInputCompositionSelectField} > </TableHeaderColumn>

                                            <TableHeaderColumn dataField='manufacture_name' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="420" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a manufacture' }} dataFormat={this.tableInputManufactureField.bind(this)} > </TableHeaderColumn>


                                            <TableHeaderColumn dataField='uom_name' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="410" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a uom ' }} dataFormat={this.tableInputUomsField.bind(this)} > </TableHeaderColumn>

                                            <TableHeaderColumn dataField='sku_name' expandable={false} dataAlign="center" onChange={() => alert("click")} columnClassName='' width="320" row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a sku ' }} dataFormat={this.tableInputSkusField.bind(this)} > </TableHeaderColumn>


                                            <TableHeaderColumn expandable={false} dataAlign="center" expandable={false} width="220" dataField='album' row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a image' }} dataFormat={this.tableImageFileField}></TableHeaderColumn>
                                        </BootstrapTable>




                                    </CardBody>

                                </Card>
                            </Col>
                        </div>
                    </Row> : null}
                <Loading
                    show={this.state.brands.start}
                    color="red"
                />
                <Loading
                    show={this.state.loadingbar}
                    color="blue"

                />
                <Dialog actions={actions2} modal={false} open={this.state.show_activeinactive} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ show_activeinactive: false })}>
                    Do you want to {this.state.row_status} product '{this.state.productname}' ?
                </Dialog>

                <Dialog actions={product_promotion_state} modal={false} open={this.state.pro_state_promo_open} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }}>

                    {/* onRequestClose={() => (this.state.row_status != "Activate" ? this.setState({ pro_state_promo_open: false, show_activeinactive: true }) : this.productPromotionDeactivateStateChange())}> */}
                    '{this.state.productname}' is associated with Scheme '{this.state.rowData != null ? this.state.rowData.promotion_name : null}'. Do you want to {this.state.row_status} the promotion ?
                </Dialog>



                <Dialog actions={update_products} modal={false} open={this.state.open_save_dialog} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                    {this.state.open_product_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}



                </Dialog>

                <Dialog actions={save_newproducts} modal={false} open={this.state.open_s_d_new_p} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_s_d_new_p: false })}>
                    {this.state.open_product_upload != true ? " Do you want to Save ?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}


                </Dialog>

                <Dialog actions={actions_cancel} modal={false} open={this.state.open_new_p_cancel} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_new_p_cancel: false })}>
                    Do you want to cancel adding '{this.state.products.p_t_data.length != 0 && this.state.products.p_t_data[0].name != "" ? this.state.products.p_t_data[0].name : 'New Product'}' ?
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


                <Dialog actions={save_cat} modal={false} open={this.state.save_unsaved_category} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ save_unsaved_category: false })}>
                    Newly added category is not added to product. Do you want to save & continue?
                </Dialog>

                <Snackbar
                    open={this.state.open}
                    message="Please Fill Required Fields"
                    autoHideDuration={6000}
                    style={{ color: 'white', 'background-color': 'red !important' }}
                    bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
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
                    action="Yes"
                    style={{ color: 'white' }}
                    style={{ top: 0, height: 0, visibility: 'hidden' }}
                    autoHideDuration={1}

                    onRequestClose={() => this.setState({ set_img_open: false })}
                />

                <Snackbar
                    open={this.state.open_sku_error_msg}
                    message="Please add uoms first"
                    autoHideDuration={5000}
                    style={{ color: 'white', 'background-color': 'red !important' }}
                    bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                    style={{ top: 0, height: 0 }}
                    onRequestClose={() => this.setState({ open_sku_error_msg: false })}
                />


            </div>
        )
    }
}

export default ProductView;










