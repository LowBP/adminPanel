import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//import css 
import 'react-select/dist/react-select.css';

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
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';


// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
// import custom component 
import RestApi from './Fetch/RestApi';


// __MaterialUI
import DatePicker from 'material-ui/DatePicker';


// import custom component
import DiscountRowExpand from './ExpandPromotion/DiscountRowExpand';
import AppRowExpand from './ExpandPromotion/AppRowExpand';
import RewardRowExpand from './ExpandPromotion/RewardRowExpand';
import ProductRowExpand from './ExpandPromotion/ProductRowExpand';

var sortorder = false;
const promotion_url = "promotions";
const productVariant_url = "productVariants";
const products_url = "products";
const variants_array_index_url = "/variants/0";
var f_img_url = 'https://firebasestorage.googleapis.com/v0/b/mediapp-tst.appspot.com/o/promotions%2F';


class PromotionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoHideDuration: 6000,
            autoHideDuration_p_acti: 5000,
            open: false,
            start_save: false,
            expanding: [-1], drop_val: 25, open_img_upload: false, open_promotion_upload: false,
            promotions: {
                p_table_data: [],
                add: false,
                add_type: "",
                p_expand_data: '',
                set_index: true,
                products_dropdown: [],

            },
            images: {
                image_expand_open: [-1],
                image_expand_data: '',

            },

        };



    }
    async findVariant(offer_product_value) {
        var refId = offer_product_value.refId != null ? offer_product_value.refId : offer_product_value._id;

        var promotions = { ...this.state.promotions };

        for (var i = 0; i < promotions.products_dropdown.length; i++) {
            if (refId == promotions.products_dropdown[i].refId) {
                return promotions.products_dropdown[i];
            }
        }
        // alert("product variant not found");

    }
    async activatePromotion(refId, promotion) {
        await RestApi.setToken();

        fetch(RestApi.isFetch(productVariant_url + "/" + refId), RestApi.getPatchMethod(promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    console.log("promotion updated in productVariants", json);
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end


    }
    async activatePromoInProductVariant(refId, promotion) {
        await RestApi.setToken();

        var promotions = { ...this.state.promotions };
        // console.log(refId, promotion);

        for (var i = 0; i < promotions.products_dropdown.length; i++) {
            // console.log(promotions.products_dropdown[i].key);

            if (promotions.products_dropdown[i].key == refId) {
                var refId = promotions.products_dropdown[i]._id != null ? promotions.products_dropdown[i]._id : promotions.products_dropdown[i].refId;
                this.activatePromotion(refId, promotion);
                break;

            }
        }
    }
    async activatePromotionInProducts(refId, promotion, p_v_key) {
        await RestApi.setToken();
        await fetch(RestApi.isFetch(products_url + "/" + refId + variants_array_index_url), RestApi.getPatchMethod(promotion)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    if (promotion.promotion != null)
                        promotion.promotion.code = null;
                    if (p_v_key != null)
                        this.activatePromotion(p_v_key, promotion);
                    // else
                    //     this.activatePromoInProductVariant(refId, promotion);
                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
    }
    getMatchingProducts(data) {
        var refId;
        if (data.key != null)
            refId = data.key;
        else
            refId = data._id != null ? data._id : data.refId;

        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.products_dropdown.length; i++) {
            if (refId == promotions.products_dropdown[i].key) {
                promotions.products_dropdown[i].drop_id = i;
                return promotions.products_dropdown[i];
            }
        }
        alert("not found products");
    }
    async  openDialogAvtiveInactive(data1) {

        await RestApi.setToken();
        console.log(data1);
        this.setState({ deactive_old_p: false });

        var status = "";
        if (this.state.rowData.status == "active") {
            this.state.rowData.status = "inactive";
        }
        else
            this.state.rowData.status = "active";
        console.log(this.state.rowData);



        if (this.state.rowData.type == "Product") {
            if (this.state.rowData.status == "active") {

                console.log(this.state.rowData);

                var product_variant = this.getMatchingProducts(this.state.rowData.offer_product_value);

                console.log("pranav", product_variant, this.state.promotions);
                var promotions = { ...this.state.promotions };

                if (product_variant.promotion != null) {
                    if (promotions.products_dropdown[product_variant.index].promotion != null) {
                        var refId = promotions.products_dropdown[product_variant.index].promotion._id != null ? promotions.products_dropdown[product_variant.index].promotion._id : promotions.products_dropdown[product_variant.index].promotion.refId;
                        await this.setPromotionDeactivate(refId);

                        for (var i = 0; i < promotions.p_table_data.length; i++) {
                            if (promotions.p_table_data[i].refId == refId) {
                                promotions.p_table_data[i].status = "inactive";
                                // this.setState({ promotions });
                                break;

                            }
                        }

                    }
                }

                var update_p_variants_promo = {
                    promotion: {
                        code: this.state.rowData.code,
                        name: this.state.rowData.name,
                        refId: this.state.rowData.refId,
                        _id: this.state.rowData.refId,
                        slug: this.nameToSlugConvert(this.state.rowData.name),
                        id: this.nameToSlugConvert(this.state.rowData.name),
                        tags: product_variant.tags,
                    }
                };


                console.log("pv", promotions.products_dropdown[product_variant.index]);
                promotions.products_dropdown[product_variant.index].promotion = update_p_variants_promo.promotion;
                promotions.p_table_data[this.state.rowData.id].offer_product_value.promotion = update_p_variants_promo.promotion;
                console.log("promotion all----------------", promotions);
                this.setState({ promotions });


                var refId;
                if (this.state.rowData.offer_product_value.key != null)
                    refId = this.state.rowData.offer_product_value.key;
                else
                    refId = this.state.rowData.offer_product_value._id != null ? this.state.rowData.offer_product_value._id : this.state.rowData.offer_product_value.refId;


                await this.activatePromotionInProducts(refId, update_p_variants_promo, product_variant._id);

                //  else {

                //     var refId = product_variant._id != null ? product_variant._id : product_variant.refId;
                //     var promotions = { ...this.state.promotions };

                //     for (var i = 0; i < promotions.products_dropdown.length; i++) {

                //         if (promotions.products_dropdown[i].key == refId) {

                //             if (promotions.products_dropdown[i].promotion != null) {
                //                 var prom_refId = promotions.products_dropdown[i].promotion._id != null ? promotions.products_dropdown[i].promotion._id : promotions.products_dropdown[i].promotion.refId;

                //                 if (prom_refId != this.state.rowData.refId) {
                //                     await this.setPromotionDeactivate(prom_refId);
                //                     for (var i = 0; i < promotions.p_table_data.length; i++) {
                //                         if (promotions.p_table_data[i].refId == prom_refId) {
                //                             promotions.p_table_data[i].status = "inactive";
                //                             this.setState({ promotions });
                //                             break;

                //                         }
                //                     }
                //                 }
                //             }

                //             break;
                //         }


                //     }


                //     var update_p_variants_promo = {
                //         promotion: {
                //             code: this.state.rowData.code,
                //             name: this.state.rowData.name,
                //             refId: this.state.rowData.refId,
                //             _id: this.state.rowData.refId,
                //             slug: this.nameToSlugConvert(this.state.rowData.name),
                //             id: this.nameToSlugConvert(this.state.rowData.name),
                //             tags: product_variant.tags,

                //         }
                //     };

                //     await this.activatePromotionInProducts(refId, update_p_variants_promo);
                // }
                // var promotion = this.state.rowData;
                // var p_to_variant = {
                //     _id: promotion.refId,
                //     refId: promotion.refId,
                //     _id: promotion.name,
                //     tags: promotion.tags,

                // };
                // await this.addPromotionToVariant(p_to_variant, refId);

            }
            else {

                var product_variant = this.getMatchingProducts(this.state.rowData.offer_product_value);
                var refId;
                if (this.state.rowData.offer_product_value.key != null)
                    refId = this.state.rowData.offer_product_value.key;
                else
                    refId = this.state.rowData.offer_product_value._id != null ? this.state.rowData.offer_product_value._id : this.state.rowData.offer_product_value.refId;
                var promotions = { ...this.state.promotions }



                var update_p_variants_promo = {
                    promotion: null
                };

                await this.activatePromotionInProducts(refId, update_p_variants_promo, product_variant._id);

                if (product_variant.promotion != null) {
                    if (promotions.products_dropdown[product_variant.index].promotion != null) {
                        var refId = promotions.products_dropdown[product_variant.index].promotion._id != null ? promotions.products_dropdown[product_variant.index].promotion._id : promotions.products_dropdown[product_variant.index].promotion.refId;
                        await this.setPromotionDeactivate(refId);

                        for (var i = 0; i < promotions.p_table_data.length; i++) {
                            if (promotions.p_table_data[i].refId == refId) {
                                promotions.p_table_data[i].status = "inactive";
                                // this.setState({ promotions });
                                break;

                            }
                        }
                        promotions.products_dropdown[product_variant.index].promotion = update_p_variants_promo.promotion;


                    }
                }

                // else {

                //     var update_p_variants_promo = {
                //         promotion: null
                //     };

                //     await this.activatePromotionInProducts(refId, update_p_variants_promo);

                // }
                this.setState({ promotions });

            }
        }

        var temp_data = {};
        temp_data.status = this.state.rowData.status;

        // console.log(this.state.rowData)
        fetch(RestApi.isFetch(promotion_url + "/" + this.state.rowData.refId), RestApi.getPatchMethod(temp_data)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {

                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
        console.log("last promotion view", this.state.promotions.p_table_data[1]);


        this.setState({ show_activeinactive: false });//close the dialog box
    }
    //save new adding discount
    nameToSlugConvert(name) {
        var slug = "";
        name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
        });
        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        return slug;
    }
    async saveNewDiscountPromotion(promotion) {// add promotion discount-cash----------------------------------------------------------start
        await RestApi.setToken();

        // alert("satart saving");
        console.log(promotion)
        var flag = 0;
        var promotions = { ...this.state.promotions };

        var update_p_object = {
            alias: "schemes",
            groups: { exclude: [""], include: ["medi-app"] },
            id: this.nameToSlugConvert(promotion.name),
            slug: this.nameToSlugConvert(promotion.name),
            status: "inactive",
            tags: ["MediApp", "Scheme", "Promotion", "500"],
            name: promotion.name,
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,
            priority: parseInt(promotion.priority),
            customerLimit: parseInt(promotion.customerLimit),
            offer: {
                order: {
                    amount: {
                        currency: "INR",
                        value: parseFloat(promotion.offeramount)
                    }
                }
            },
            rules: {
                order: {
                    itemTotal: {
                        max: promotion.max != "" ? parseFloat(promotion.max) : null,
                        min: promotion.min != "" ? parseFloat(promotion.min) : null,

                    }
                }
            },
            meta: await this.setMeta(),
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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
        await fetch(RestApi.isFetch(promotion_url), RestApi.getPostMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_discount----", json);
                    promotion.refId = json.name;
                    promotion.add_new = null;
                    promotion.status = "inactive";
                    promotion.meta = update_p_object.meta;

                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });
                    var promotions = { ...this.state.promotions };
                    promotions.add = false;
                    this.setState({ promotions });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);





    }
    //-------------------------------------------------------------------------------------------------------------------------end
    //save new App promotion
    async saveNewAppPromotion(promotion) {//save new promotion----------------------------------------------------------------start
        await RestApi.setToken();

        var update_p_object = {
            alias: "schemes",
            groups: { exclude: [""], include: ["medi-app"] },
            id: this.nameToSlugConvert(promotion.name),
            slug: this.nameToSlugConvert(promotion.name),
            status: "inactive",
            tags: ["MediApp", "Download", "Offer", "Sale", "Free", "Discount", "Scheme", "Promotion", "1000"],
            name: promotion.name,

            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,
            priority: parseInt(promotion.priority),
            customerLimit: parseInt(promotion.customerLimit),
            serialNumber: parseInt(promotion.serialNumber),
            offer: {
                order: {
                    subTotal: parseFloat(promotion.subTotal),
                }
            },
            rules: {
                order: {
                    mrpTotal: {
                        max: promotion.max != "" ? parseFloat(promotion.max) : null,
                        min: promotion.min != "" ? parseFloat(promotion.min) : null,
                    }
                }
            },
            meta: await this.setMeta(),
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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
        await fetch(RestApi.isFetch(promotion_url), RestApi.getPostMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_app----", json);
                    promotion.refId = json.name;
                    promotion.status = "inactive";
                    promotion.add_new = null;
                    promotion.meta = update_p_object.meta;
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });
                    var promotions = { ...this.state.promotions };
                    promotions.add = false;
                    this.setState({ promotions });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);


    }//------------------------------------------------------------------------------------------------------------end
    //reward---------------------------------------------------------------------------------------------------start
    async   saveNewRewardPromotion(promotion) {
        await RestApi.setToken();

        var promotions = { ...this.state.promotions };



        var update_p_object = {
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            category: "points",
            groups: { exclude: [""], include: ["medi-app"] },
            id: this.nameToSlugConvert(promotion.name),
            slug: this.nameToSlugConvert(promotion.name),
            status: "inactive",
            tags: ["MediApp", "Offer", "Sale", "Sale", "Promotion", "Rewards"],
            name: promotion.name,
            offer: {
                wallet: {
                    percentage: parseFloat(promotion.percentage),
                }
            },
            rules: {
                points: {
                    amount: parseFloat(promotion.amount)
                }
            },
            meta: await this.setMeta(),
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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

        await fetch(RestApi.isFetch(promotion_url), RestApi.getPostMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_Rewards----", json);
                    promotion.refId = json.name;
                    promotion.add_new = null;
                    promotion.meta = update_p_object.meta;

                    promotion.status = "inactive";
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });
                    var promotions = { ...this.state.promotions };
                    promotions.add = false;
                    this.setState({ promotions });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);


    }//--------------------------------------------------------------------------------------------------------------------end
    async saveNewProductPromotion(promotion) {
        // alert("found");
        await RestApi.setToken();

        console.log("new promotion view ", promotion);
        var promotions = { ...this.state.promotions };



        var update_p_object = {
            groups: { exclude: [""], include: ["medi-app"] },
            id: this.nameToSlugConvert(promotion.name),
            slug: this.nameToSlugConvert(promotion.name),
            status: "inactive",
            tags: ["MediApp", "Offer", "Sale", "Sale", "Promotion", "Rewards", "Plus"],
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,
            name: promotion.name,

            offer: {
                product: {
                    quantity: parseInt(promotion.offer_product_qty),
                    value: ''
                }
            },
            rules: {
                product: {
                    id: promotion.offer_product_value.id != null ? promotion.offer_product_value.id : promotion.offer_product_value.slug,
                    quantity: parseInt(promotion.rules_product_qty)
                }
            },
            meta: await this.setMeta(),
        };



        var product_variant = promotion.offer_product_value;

        // if (product_variant.promotion != null) {
        //     var refId = product_variant.promotion._id != null ? product_variant.promotion._id : product_variant.promotion.refId;
        //     await this.setPromotionDeactivate(refId);
        // }

        var store_p_value = {
            _id: product_variant.key,
            refId: product_variant.key,
            name: product_variant.name,
            slug: product_variant.slug,
            id: product_variant.slug,
            tags: product_variant.tags,
        };
        update_p_object.offer.product.value = store_p_value;

        // var p_to_variant = {
        //     _id: promotion.refId,
        //     refId: promotion.refId,
        //     name_id: promotion.name,
        //     tags: promotion.tags,

        // }
        // await this.addPromotionToVariant(p_to_variant, product_variant.refId);







        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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
        var refId = product_variant.key;

        await fetch(RestApi.isFetch(promotion_url), RestApi.getPostMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_promotions----", json);
                    promotion.refId = json.name;
                    promotion.add_new = null;
                    promotion.status = "inactive";
                    promotion.meta = update_p_object.meta;

                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });





                    var promotions = { ...this.state.promotions };
                    promotions.add = false;
                    this.setState({ promotions });

                    // var update_p_variants_promo = {
                    //     promotion: {
                    //         code: promotion.code,
                    //         name: promotion.name,
                    //         refId: promotion.refId,
                    //         _id: promotion.refId,
                    //         slug: this.nameToSlugConvert(promotion.name),
                    //         id: this.nameToSlugConvert(promotion.name),
                    //         tags: promotion.tags,
                    //     }
                    // };

                    //        console.log("pV_id",product_variant._id != null ? product_variant._id : product_variant.refId);
                    //  this.activatePromotionInProducts(refId, update_p_variants_promo, product_variant._id != null ? product_variant._id : product_variant.refId);



                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);
        // await fetch(RestApi.isFetch(promotion_url + "/" + promotion.refId, token), RestApi.getPatchMethod(update_p_object)).then(res => {
        //     if (res.ok) {
        //         res.json().then(json => {
        //             console.log("updated_product_promo----", json);
        //             this.setState({ open_save_dialog: false, open_promotion_upload: false });

        //         });
        //     }
        //     else
        //         this.props.history.replace('/login');


        // }).catch(err => err);


    }
    // save all details
    async   openDialogSaveSelect(promotion) {
        console.log(promotion)
        if (promotion.type == "Amount" && this.state.promotions.add == true)
            await this.saveNewDiscountPromotion(promotion);
        else if (promotion.type == "App" && this.state.promotions.add == true)
            await this.saveNewAppPromotion(promotion);
        else if (promotion.type == "Reward" && this.state.promotions.add == true)
            await this.saveNewRewardPromotion(promotion);
        else if (promotion.type == "Product" && this.state.promotions.add == true)
            await this.saveNewProductPromotion(promotion);
        else if (promotion.type == "Amount")
            await this.saveDiscountPromotion(promotion);
        else if (promotion.type == "App")
            await this.saveAppPromotion(promotion);
        else if (promotion.type == "Reward")
            await this.saveRewardPromotion(promotion);
        else if (promotion.type == "Product")
            await this.saveProductPromotion(promotion);

    }
    async savePromotionDetails(rowData) {
        this.setState({ savedata: rowData });
        var promotion = rowData;
        console.log(rowData)

        if (promotion.name_found != true || promotion.code_found != true || promotion.description_found != true) {
            this.setState({ open: true });
            return;
        }

        if (promotion.type == "Amount" && this.state.promotions.add == true) {
            if (this.validateDiscountCash(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "App" && this.state.promotions.add == true) {
            if (this.validateApp(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "Reward" && this.state.promotions.add == true) {
            if (this.validateReward(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "Product" && this.state.promotions.add == true) {
            if (this.validateProduct(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "Amount") {
            if (this.validateDiscountCash(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "App") {
            if (this.validateApp(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "Reward") {
            if (this.validateReward(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }
        else if (promotion.type == "Product") {
            if (this.validateProduct(promotion)) {
                this.setState({ open_save_dialog: true });
            }
        }





    }

    //validation
    // validate app
    validateProduct(promotion) {
        if (promotion.product_found == true && promotion.productqty_found == true && promotion.rule_found == true)
            return true;
        else if (promotion.product_found == null && promotion.productqty_found == null && promotion.rule_found == null)
            return true;
        else {
            this.setState({ open: true });
        }
        return false;

    }
    // validate app
    validateReward(promotion) {
        if (promotion.amount_found == true && promotion.reward_point_found == true)
            return true;
        else if (promotion.amount_found == null && promotion.reward_point_found == null)
            return true;

        else {
            this.setState({ open: true });
        }
        return false;

    }
    // validate app
    validateApp(promotion) {
        if (promotion.subTotal_found == true && promotion.min_found == true && promotion.max_found == true && promotion.priority_found == true && promotion.customerLimit_found == true && promotion.serialNumber_found == true)
            return true;
        else if (promotion.subTotal_found == null && promotion.min_found == null && promotion.max_found == null && promotion.priority_found == null && promotion.customerLimit_found == null && promotion.serialNumber_found == null)
            return true;
        else {
            this.setState({ open: true });
        }
        return false;

    }
    // discount cash validate
    validateDiscountCash(promotion) {
        if (promotion.offeramount_found == true && promotion.min_found == true && promotion.max_found == true && promotion.priority_found == true && promotion.customerLimit_found == true)
            return true;
        else if (promotion.offeramount_found == null && promotion.min_found == null && promotion.max_found == null && promotion.priority_found == null && promotion.customerLimit_found == null)
            return true;
        else {
            this.setState({ open: true });
        }
        return false;
    }





    setDateFormat(cellValue) {
        if (cellValue.search('/') != -1) {
            var arr = [];
            cellValue.split('/').map(data => {
                arr.push(data);
            })
            cellValue = arr[2] + "-" + arr[1] + "-" + arr[0];

        }
        return cellValue;
    }
    async saveDiscountPromotion(promotion) {
        await RestApi.setToken();

        var promotions = { ...this.state.promotions };
        promotion.meta.lastModified.time = Math.round(new Date().getTime());
        var update_p_object = {
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,
            priority: parseInt(promotion.priority),
            customerLimit: parseInt(promotion.customerLimit),
            offer: {
                order: {
                    amount: {
                        currency: "INR",
                        value: parseFloat(promotion.offeramount)
                    }
                }
            },
            rules: {
                order: {
                    itemTotal: {
                        max: promotion.max != "" ? parseFloat(promotion.max) : null,
                        min: promotion.min != "" ? parseFloat(promotion.min) : null,
                    }
                }
            },
            meta: promotion.meta,
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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
        await fetch(RestApi.isFetch(promotion_url + "/" + promotion.refId), RestApi.getPatchMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_discount----", json);
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);


    }
    setMeta() {
        var meta = {
            "created": {
                "source": "cli",
                time: Math.round(new Date().getTime()),
                "user": "S"
            },
            "entity": "promotion",
            "id": "",
            "lastModified": {
                "source": "cli",
                time: Math.round(new Date().getTime()),
                "user": "S"
            }
        };
        return meta;
    }
    async saveAppPromotion(promotion) {
        await RestApi.setToken();

        var promotions = { ...this.state.promotions };
        promotion.meta.lastModified.time = Math.round(new Date().getTime());
        var update_p_object = {
            code: promotion.code,
            id: this.nameToSlugConvert(promotion.name),
            slug: this.nameToSlugConvert(promotion.name),
            name: promotion.name,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,
            priority: parseInt(promotion.priority),
            customerLimit: parseInt(promotion.customerLimit),
            serialNumber: parseInt(promotion.serialNumber) >= 0 ? parseInt(promotion.serialNumber) : 0,
            offer: {
                order: {
                    subTotal: parseFloat(promotion.subTotal),
                }
            },
            rules: {
                order: {
                    mrpTotal: {
                        max: promotion.max != "" ? parseFloat(promotion.max) : null,
                        min: promotion.min != "" ? parseFloat(promotion.min) : null,
                    }
                }
            },
            meta: promotion.meta,
            album: null,
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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
        await fetch(RestApi.isFetch(promotion_url + "/" + promotion.refId), RestApi.getPatchMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_app----", json);
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);


    }
    async  saveRewardPromotion(promotion) {
        await RestApi.setToken();
        var promotions = { ...this.state.promotions };

        promotion.meta.lastModified.time = Math.round(new Date().getTime());

        var update_p_object = {
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            //  autoApply: promotion.autoApply,
            // priority: promotion.priority,
            //customerLimit: promotion.customerLimit,
            //serialNumber:promotion.serialNumber,
            offer: {
                wallet: {
                    percentage: parseFloat(promotion.percentage),
                }
            },
            rules: {
                points: {
                    amount: parseFloat(promotion.amount)
                }
            },
            meta: promotion.meta,
        };
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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

        await fetch(RestApi.isFetch(promotion_url + "/" + promotion.refId), RestApi.getPatchMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_reward----", json);
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);

    }
    async  saveProductPromotion(promotion) {
        await RestApi.setToken();


        promotion.meta.lastModified.time = Math.round(new Date().getTime());

        var update_p_object = {
            code: promotion.code,
            startDate: this.setDateFormat(promotion.startDate),
            endDate: this.setDateFormat(promotion.endDate),
            description: promotion.description,
            autoApply: promotion.autoApply,

            offer: {
                product: {
                    quantity: promotion.offer_product_qty,
                    value: ''
                }
            },
            rules: {
                product: {
                    id: promotion.offer_product_value.id != null ? promotion.offer_product_value.id : promotion.offer_product_value.slug,
                    quantity: promotion.rules_product_qty
                }
            },
            meta: promotion.meta,
        };
        if (promotion.product_change != true) {
            var store_p_value = {
                _id: promotion.offer_product_value._id,
                refId: promotion.offer_product_value.refId,
                name: promotion.offer_product_value.name,
                slug: promotion.offer_product_value.slug,
                id: promotion.offer_product_value.slug,
                tags: promotion.offer_product_value.tags,

            }
            update_p_object.offer.product.value = store_p_value;
        }
        else {
            var product_variant = promotion.offer_product_value;

            if (product_variant.promotion != null) {
                var refId = product_variant.promotion._id != null ? product_variant.promotion._id : product_variant.promotion.refId;
                await this.setPromotionDeactivate(refId);
            }
            var update_p_variants_promo = {
                promotion: null
            };

            await this.activatePromotionInProducts(promotion.old_product_refId, update_p_variants_promo);

            var store_p_value = {
                _id: product_variant.key,
                refId: product_variant.key,
                name: product_variant.name,
                slug: product_variant.slug,
                id: product_variant.slug,
                tags: product_variant.tags,
            };
            update_p_object.offer.product.value = store_p_value;

            // var p_to_variant = {
            //     _id: promotion.refId,
            //     refId: promotion.refId,
            //     name_id: promotion.name,
            //     tags: promotion.tags,

            // }
            // await this.addPromotionToVariant(p_to_variant, product_variant.refId);


            var refId = product_variant.key;

            var update_p_variants_promo = {
                promotion: {
                    code: promotion.code,
                    name: promotion.name,
                    refId: promotion.refId,
                    _id: promotion.refId,
                    slug: this.nameToSlugConvert(promotion.name),
                    id: this.nameToSlugConvert(promotion.name),
                    tags: promotion.tags,
                }
            };

            await this.activatePromotionInProducts(refId, update_p_variants_promo, product_variant._id != null ? product_variant._id : product_variant.refId);



        }
        if (promotion.image_upload != null) {

            var permalink = {};
            if (promotion.album != '') {
                this.setState({ open_img_upload: true });

                var url = f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name);
                permalink.permalink = (f_img_url + this.nameToSlugConvert(promotion.name) + '%2F' + this.nameToSlugConvert(promotion.name) + '?alt=media')

                update_p_object.album = permalink;

                await fetch(url, RestApi.getPostImageMethod(promotion.image_upload)).then(res => {
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

        await fetch(RestApi.isFetch(promotion_url + "/" + promotion.refId), RestApi.getPatchMethod(update_p_object)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("updated_product_promo----", json);
                    this.setState({ open_save_dialog: false, open_promotion_upload: false, start_save: false });

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);

    }

    async addPromotionToVariant(promotion, refId) {
        await RestApi.setToken();

        var promotions = {
            promotion: promotion
        };
        await fetch(RestApi.isFetch(productVariant_url + "/" + refId), RestApi.getPatchMethod(promotions)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("promotion-change-in product_variants", json);

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);
    }
    async setPromotionDeactivate(refId) {
        await RestApi.setToken();

        var status = {
            status: "inactive"
        };
        await fetch(RestApi.isFetch(promotion_url + "/" + refId), RestApi.getPatchMethod(status)).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log("promotion-status change", json);

                });
            }
            else
                this.props.history.replace('/login');


        }).catch(err => err);
    }
    // set promotion table.............................................................................................................start
    async setPromotionByAmount(json) {
        var promotions = { ...this.state.promotions };
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            // console.log("status", data.status);
            var store_prom = {
                name: data.name,
                refId: key,
                code: data.code,
                status: data.status,
                startDate: data.startDate,
                endDate: data.endDate,
                offeramount: data.offer.order.amount.value,
                min: data.rules.order.itemTotal.min != null ? data.rules.order.itemTotal.min : "",
                max: data.rules.order.itemTotal.max != null ? data.rules.order.itemTotal.max : "",
                description: data.description,
                autoApply: data.autoApply,
                priority: data.priority,
                customerLimit: data.customerLimit,
                album: data.album != null ? data.album.permalink : "",
                type: "Amount",
                p_type: "Discount-cash",
                meta: data.meta


            };

            promotions.p_table_data.push(store_prom);

        }
        // if (await promotions.p_table_data.length != 0)
        //     this.setState({ promotions });
    }
    async setPromotionByApp(json) {
        var promotions = { ...this.state.promotions };
        for (var key in json) {
            var data = json[key];
            data.refId = key;

            var store_prom = {
                refId: key,
                name: data.name,
                code: data.code,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                priority: data.priority,
                serialNumber: data.serialNumber,
                subTotal: data.offer.order != null ? data.offer.order.subTotal : "",
                min: data.rules.order.mrpTotal != null ? data.rules.order.mrpTotal.min : "",
                max: data.rules.order.mrpTotal != null ? data.rules.order.mrpTotal.max : "",
                description: data.description,
                autoApply: data.autoApply,
                customerLimit: data.customerLimit,
                album: data.album != null ? data.album.permalink : "",
                type: "App",
                meta: data.meta,
                p_type: "App-offer"

            };

            promotions.p_table_data.push(store_prom);

        }
        // if (await promotions.p_table_data.length != 0)
        //     this.setState({ promotions });
    }
    async setPromotionByReward(json) {
        var promotions = { ...this.state.promotions };
        for (var key in json) {
            var data = json[key];
            data.refId = key;
            var store_prom = {
                name: data.name,
                refId: key,
                code: data.code,
                status: data.status,
                startDate: data.startDate,
                endDate: data.endDate,
                percentage: data.offer.wallet != null ? data.offer.wallet.percentage : "",
                amount: data.rules.points != null ? data.rules.points.amount : "",
                description: data.description,
                album: data.album != null ? data.album.link[0] : "",
                image_link: data.album,
                reward_point: 1,
                meta: data.meta,
                type: "Reward",
                p_type: "Rewards"
            };
            store_prom.reward_point = (store_prom.percentage / (100 / store_prom.amount));

            // store_prom.reward_point=((store_prom.percentage/store_prom.reward_point));

            promotions.p_table_data.push(store_prom);
        }
        if (await promotions.p_table_data.length != 0)
            this.setState({ promotions });
    }
    async setPromotionByProduct(json) {
        var promotions = { ...this.state.promotions };
        for (var key in json) {
            var data = json[key];
            if (data.offer.product.value._id != null || data.offer.product.value.refId != null) {
                data.refId = key;
                data.offer.product.value.label = data.offer.product.value.name;
                data.offer.product.value.value = data.offer.product.value.name;
                var store_prom = {
                    name: data.name,
                    refId: key,
                    code: data.code,
                    status: data.status,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    autoApply: data.autoApply,
                    offer_product_qty: data.offer.product.quantity,
                    offer_product_value: data.offer.product.value,
                    old_product_refId: data.offer.product.value._id != null ? data.offer.product.value._id : data.offer.product.value.refId,
                    offer_product_value_name: data.offer.product.value.name,
                    rules_product_qty: data.rules.product != null ? data.rules.product.quantity : null,
                    description: data.description,
                    album: data.album != null ? data.album.permalink : "",
                    image_link: data.album,
                    tags: data.tags,
                    meta: data.meta,

                    type: "Product",
                    p_type: "Product-offer"
                };

                promotions.p_table_data.push(store_prom);
            }
            else {

            }
        }
        if (await promotions.p_table_data.length != 0)
            this.setState({ promotions });
    }
    async setProductVariants(json) {
        var promotions = { ...this.state.promotions };
        var index = 0;
        for (var key in json) {
            var data = json[key];
            data.refId = key;

            var store_product_v = data.variants[0];
            store_product_v.label = data.name;
            store_product_v.value = data.name;
            store_product_v.key = key;
            store_product_v.index = index++;

            promotions.products_dropdown.push(store_product_v);
        }
        if (await promotions.products_dropdown.length != 0)
            this.setState({ promotions });
    }
    async fetchAmountPromo() {
        await fetch(RestApi.doPromotionFilterByAmount(promotion_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    this.setPromotionByAmount(json);
                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async fetchOfferPromo() {
        await fetch(RestApi.doPromotionFilterByAppOffer(promotion_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    this.setPromotionByApp(json);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async fetchRewards() {
        await fetch(RestApi.doPromotionFilterByRewards(promotion_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    this.setPromotionByReward(json);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    async fetchProductPromotion() {

        await fetch(RestApi.doPromotionFilterByProduct(promotion_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    console.log(json)
                    this.setPromotionByProduct(json);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end
    }

    async fetchProducts() {
        await fetch(RestApi.isFetch(products_url), RestApi.getFetchMethod()).then(response => {//productVariant fetch
            if (response.ok) {
                response.json().then(json => {
                    console.log(json)
                    this.setProductVariants(json);

                });
            }
            else
                this.props.history.replace('/login');
        }).catch(function (error) { console.log(error); });//end

    }
    setIndex() {
        var promotions = { ...this.state.promotions };
        if (promotions.p_table_data.length != 0)
            if (promotions.set_index == true) {
                promotions.set_index = false;
                this.setState({ promotions });
                for (var i = 0; i < promotions.p_table_data.length; i++) {
                    promotions.p_table_data[i].id = i;
                }
                this.setState({ promotions });
            }
    }

    async componentWillMount() {
        await RestApi.setToken();
        await this.fetchAmountPromo();

        await this.fetchOfferPromo();
        await this.fetchRewards();
        await this.fetchProductPromotion();
        await this.fetchProducts();
        await this.setIndex();

    }


    // all react-bootstrap-table fuction will done here------------------------------------------------------start
    customActionMenu(cell, rowData) { //action bar 
        // console.log("found");
        if (rowData.id == 0 && this.state.promotions.add == true)
            return (
                <div>
                    <IconMenu
                        className="wert"
                        iconButtonElement={<IconButton iconClassName="material-icons"
                            className="iconbutton-height" iconStyle={{ color: 'grey' }}>view_module</IconButton>}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    >
                        {/* <MenuItem primaryText="Save"
                            className="menu-style"
                            leftIcon={<IconButton

                                iconClassName="material-icons"
                                iconStyle={{ margin: '0px !important', color: '#263238' }}
                                style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                                save
                </IconButton>}
                            onClick={this.savePromotionDetails.bind(this, this.state.promotions.p_table_data[0])}

                        // onClick={() => this.setState({ open_s_d_new_p: true, new_product: rowData })}
                        /> */}
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
                    {this.state.expanding == rowData.id ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={() => this.setState({ expanding: [-1] })}>expand_less</i> : <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.promotionViewMore.bind(this, rowData)}>expand_more</i>}

                </div>
            );
        var icon_color = "grey";
        if (rowData.status == "inactive") {
            icon_color = "lightgray";
        }
        return (
            <div>
                <IconMenu
                    className="wert"
                    iconButtonElement={<IconButton iconClassName="material-icons"
                        className="iconbutton-height" iconStyle={{ color: icon_color }}>view_module</IconButton>}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {/* <MenuItem primaryText="Save"
                        className="menu-style"
                        disabled={this.state.promotions.add ? true : false}
                        leftIcon={<IconButton
                            disabled={this.state.promotions.add ? true : false}
                            iconClassName="material-icons"
                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                            style={{ 'height': '0px', margin: '0px !important' }} >
                            save
                </IconButton>}
                        // onClick={this.newProductSave.bind(this)}
                        //onClick={() => this.setState({ open_save_dialog: true, savedata: rowData })}
                        onClick={this.savePromotionDetails.bind(this, this.state.promotions.p_table_data[rowData.id])}

                    /> */}


                    {rowData.status == "active" ?
                        <MenuItem primaryText="Deactivate"
                            className="menu-style"
                            leftIcon={<Checkbox
                                checkedIcon={<Visibility />}
                                uncheckedIcon={<VisibilityOff />}
                                defaultChecked


                            />} onClick={() => this.setState({ show_activeinactive: true, rowData: rowData, row_status: "Deactivate", promotionname: rowData.name })} /> : <MenuItem primaryText="Activate"
                                className="menu-style"
                                leftIcon={<Checkbox
                                    checkedIcon={<Visibility />}
                                    uncheckedIcon={<VisibilityOff />}
                                />} onClick={this.activatePromotionCheck.bind(this, rowData)} />



                        /* onCheck={this.create_name_editor.bind(this,row)} */




                    }

                </IconMenu>
                {this.state.expanding == rowData.id ? <i class="material-icons" style={{ 'margin-top': '8px', color: icon_color }} onClick={() => this.setState({ expanding: [-1] })} >expand_less</i> : <i class="material-icons" style={{ 'margin-top': '8px', color: icon_color }} onClick={this.promotionViewMore.bind(this, rowData)}>expand_more</i>}

            </div>



        )

    }

    activatePromotionCheck(rowData) {
        this.setState({ rowData: rowData });


        if (rowData.p_type == "Product-offer") {
            var product_variant = this.getMatchingProducts(rowData.offer_product_value);

            this.setState({ product_details: product_variant });

            if (product_variant.promotion != null) {
                var refId = product_variant.promotion.refId != null ? product_variant.promotion.refId : product_variant.promotion._id;
                if (refId == rowData.refId) {
                    this.setState({ show_activeinactive: true, row_status: "Activate", promotionname: rowData.name });

                }
                else {

                    this.setState({ show_pro_activate_open: true, row_status: "Activate", promotionname: rowData.name });

                }

            } else {
                this.setState({ show_activeinactive: true, row_status: "Activate", promotionname: rowData.name });


            }
            ``
        }

        else
            this.setState({ show_activeinactive: true, row_status: "Activate", promotionname: rowData.name });

    }
    //------------------------------------------end

    // 1) promotion name----------------------------------------------------------------------------------------start
    newPromotionNameChange(rowData, data) {

        data.target.value = data.target.value.trim();

        let found = false;
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            if (i != rowData.id)
                if ((promotions.p_table_data[i].name).trim() == data.target.value) {
                    found = true;
                    break;


                }
        }
        if (found) {
            this.setState({ same_name_found: true });

            rowData.name = data.target.value;

            promotions.p_table_data[rowData.id].name = data.target.value;
            promotions.p_table_data[rowData.id].same_name_found = true;
            // this.state.promotions.add == true ? this.setState({ expanding: [rowData.id] }) : null;

            this.setState({ promotions });
        }
        else {
            this.setState({ same_name_found: false });

            rowData.name = data.target.value;
            promotions.p_table_data[rowData.id].name = data.target.value;
            promotions.p_table_data[rowData.id].same_name_found = false;

            this.setState({ promotions });
            // this.state.promotions.add == true ? this.setState({ expanding: [rowData.id] }) : null;
        }


    }

    tableNameInputField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        var class_import;
        if (rowData.name == "" || rowData.same_name_found == true) {
            class_import = 'filter text-filter form-control invalid-border-clr';
            rowData.name_found = false;

        }
        else {
            rowData.name_found = true;
            class_import = 'filter text-filter form-control valid-border-clr';

        }

        if (rowData.id == 0 && this.state.promotions.add == true)
            return <input defaultValue={cellValue} required title="Please enter only unique Name" className={class_import} onBlur={this.newPromotionNameChange.bind(this, rowData)} />

        if (rowData.add_new != true)
            return (
                <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} required className={class_import} onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else
            return <input defaultValue={cellValue} required title="Please enter only unique Name" className={class_import} onBlur={this.newPromotionNameChange.bind(this, rowData)} />

    }
    // 1) promotion name----------------------------------------------------------------------------------------end

    // type
    tableTypeInputField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    //promotion code ........................................................................................start
    newPromotionCodeChange(rowData, data) {
        console.log(rowData);
        data.target.value = data.target.value.trim();
        data.target.value = this.setCodeFromat(data.target.value);
        let found = false;
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            if (i != rowData.id)
                if ((promotions.p_table_data[i].code).trim() == data.target.value) {
                    found = true;


                }
        }
        if (found) {
            this.setState({ same_code_found: true });


            promotions.p_table_data[rowData.id].code = data.target.value;
            promotions.p_table_data[rowData.id].same_code_found = true;
            // this.state.promotions.add == true ? this.setState({ expanding: [rowData.id] }) : null;

            this.setState({ promotions });
        }
        else {
            this.setState({ same_code_found: false });

            rowData.code = data.target.value;
            promotions.p_table_data[rowData.id].code = data.target.value;
            promotions.p_table_data[rowData.id].same_code_found = false;

            this.setState({ promotions });
            // this.state.promotions.add == true ? this.setState({ expanding: [rowData.id] }) : null;
        }


    }
    setCodeFromat(code) {
        var code_value = "";
        code.split(' ').map(data => {
            code_value += data;
        });
        code_value = code_value.toUpperCase();
        return code_value;
    }

    tableInputCodeField(cellValue, rowData, nothing, cellFeild) {
        // console.log(rowData);
        var class_import;
        if (rowData.code == "" || rowData.same_code_found == true) {
            rowData.code_found = false;
            class_import = 'filter text-filter form-control invalid-border-clr';
        }
        else {
            rowData.code_found = true;

            class_import = 'filter text-filter form-control valid-border-clr';
        }

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} required className={class_import} title="Please enter only unique Code" onClick={() => this.setState({ sortorder: false })} onBlur={(data) => (data.target.value.trim().length != 0 ? rowData[cellFeild] = data.target.value : rowData[cellFeild] = "")} />
            );

        return (
            <input defaultValue={cellValue} title="Please enter only unique Code" required className={class_import} onBlur={this.newPromotionCodeChange.bind(this, rowData)} />
        );
    }
    //promotion code........................................................................................end

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

        if (rowData.add_new != true)
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
        // if (rowData.status == "inactive")
        //     return <DatePicker readOnly className='filter text-filter form-control box-height readonly-bg' required disabled={true} formatDate={(date) => (date.getDate() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} defaultDate={d} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />
        // else
        return <DatePicker className='filter text-filter form-control box-height' required defaultDate={d} formatDate={(date) => (((date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + date.getFullYear())} onChange={(data, event) => rowData[cellFeild] = event.toLocaleDateString()} style={{ 'margin-left': '-40px !important' }} textFieldStyle={{ 'line-height': '2px!important', width: '300px!important', height: '15px!important', 'font-size': '14px!important' }} hintText="" />

    }

    // descriptions-------------------------------------------------------------------------------------start
    updateDescription(rowData, data) {

        var description = data.target.value;

        var promotions = { ...this.state.promotions };
        promotions.p_table_data[rowData.id].description = data.target.value.trim();


        this.setState({ promotions });

    }
    tableInputDescriptionField(cellValue, rowData, nothing, cellFeild) {
        var class_import;
        if (rowData.description == "") {
            rowData.description_found = false;
            class_import = 'filter text-filter form-control invalid-border-clr';
        }
        else {
            rowData.description_found = true;
            class_import = 'filter text-filter form-control valid-border-clr';
        }

        // if (rowData.status == "inactive")
        //     return (
        //         <input value={cellValue} readOnly required className='filter text-filter form-control readonly-bg' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        //     );
        if (this.state.sortorder == true)
            return (
                <input value={cellValue} required className={class_import} onClick={() => this.setState({ sortorder: false })} onBlur={(data) => rowData[cellFeild] = data.target.value} />
            );
        else
            return (
                <input defaultValue={cellValue} title="Please Enter Description" required className={class_import} onBlur={this.updateDescription.bind(this, rowData)} />
            );
    }
    //image ....................................................................................................start
    // image ............................................................................start
    expandImage(rowData, event) {

        var promotions = { ...this.state.promotions };


        var images = { ...this.state.images };
        // images.image_expand_open = rowData.name,
        images.image_expand_data = rowData.album;
        images.row_data = rowData;
        this.setState({ images });
        this.setState({ open_image_view: true });

        // this.setState({ expanding: [rowData.id] });
    }
    tableImageFileField(cellValue, rowData, nothing, cellFeild) {
        // //console.log('row', value, data, sd, r);
        // console.log(cellValue)
        // if (rowData.status == "inactive")
        //     return (
        //         <div class="input-group" >
        //             <img src={cellValue} style={{ width: '220px', height: '35px' }} />


        //         </div>
        //     );
        if (cellValue == "") {
            return (<div class="input-group no-image">

                <a class="add-image" onClick={this.expandImage.bind(this, rowData, cellValue)}>Add Image </a>


            </div>);
        }
        // <div >
        //     {this.state.expanding != -1 && this.state.images.image_expand_open != -1 && rowData.id == this.state.expanding && cellFeild == "album" ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={() => (this.setState({ expanding: [-1] }), this.state.images.image_expand_open = [-1])}>expand_less</i> : null}
        //     {this.state.expanding != -1 && this.state.images.image_expand_open != -1 && rowData.id != this.state.expanding && cellFeild == "album" ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.expandImage.bind(this, rowData, cellValue)} >expand_more</i> : null}
        //     {this.state.images.image_expand_open == -1 ? <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.expandImage.bind(this, rowData, cellValue)}>expand_more</i> : null}

        // </div>
        return (
            <div class="input-group">
                <img src={cellValue} style={{ width: '220px', height: '35px' }} onClick={this.expandImage.bind(this, rowData, cellValue)} />

            </div>

            // <input defaultValue={cellValue} className='filter text-filter form-control  ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    addNewImage(event) {
        this.setState({ set_img_open: false });

        // console.log(this.state.promotions.p_table_data);
        if (event.target.files && event.target.files[0]) {
            this.setState({ added_new_image: true });

            var promotions = { ...this.state.promotions };
            promotions.p_table_data[this.state.images.row_data.id].image_upload = event.target.files[0];

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ image: e.target.result });

                // promotions.p_table_data[this.state.images.row_data.id].album = e.target.result;
                var images = { ...this.state.images };
                images.image_expand_data = e.target.result;

                this.setState({ images });
                this.setState({ promotions });
            };
            reader.readAsDataURL(event.target.files[0]);

        }




    }
    //image..........................................................................................................end

    //more views..................................................................................start
    promotionViewMore(rowData) {
        var images = { ...this.state.images };
        images.image_expand_open = [-1];
        this.setState({ images });
        var promotions = { ...this.state.promotions };


        if (rowData.type == "Amount") {
            promotions.p_expand_data = rowData;
            this.setState({ expanding: [rowData.id] });
            this.setState({ promotions });

        }
        else if (rowData.type == "App") {
            promotions.p_expand_data = rowData;
            this.setState({ expanding: [rowData.id] });
            this.setState({ promotions });

        }
        else if (rowData.type == "Reward") {
            promotions.p_expand_data = rowData;
            this.setState({ expanding: [rowData.id] });
            this.setState({ promotions });
        }
        else {
            promotions.p_expand_data = rowData;
            this.setState({ expanding: [rowData.id] });
            this.setState({ promotions });

        }

    }
    tableMoreViewFileField(cellValue, rowData, nothing, cellFeild) {
        return <i class="material-icons" style={{ 'margin-top': '8px' }} onClick={this.promotionViewMore.bind(this, rowData)}>more_horiz</i>
    }
    updateDiscountChange(rowData) {
        rowData.percentage = ((100 / rowData.amount) * rowData.reward_point);
        rowData.percentage = parseFloat(Math.round(rowData.percentage * 100) / 100).toFixed(2);
        var promotions = { ...this.state.promotions };
        promotions.p_table_data[rowData.id] = rowData;
        promotions.p_expand_data = rowData;
        this.setState({ promotions });
    }
    expandComponent(row) {
        // if (this.state.images.image_expand_open != -1) {
        //     return <div class="pull-right" >
        //         <FlatButton label="Choose file" labelPosition="before">
        //             <input type="file" onChange={this.addNewImage.bind(this)} />
        //         </FlatButton>
        //         <img src={this.state.images.image_expand_data} style={{ width: '400px', height: '300px' }} />

        //     </div>
        // }
        if (this.state.expanding != -1 && this.state.promotions.p_expand_data.type == "Amount" && this.state.promotions.p_expand_data.id == row.id) {
            console.log(row.id)
            return <DiscountRowExpand data={this.state.promotions.p_expand_data} onChangeValue={this.updateDiscountChange.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} onSaveClick={this.savePromotionDetails.bind(this)} />
        }
        else if (this.state.expanding != -1 && this.state.promotions.p_expand_data.type == "App" && this.state.promotions.p_expand_data.id == row.id)
            return <AppRowExpand data={this.state.promotions.p_expand_data} onChangeValue={this.updateDiscountChange.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} onSaveClick={this.savePromotionDetails.bind(this)} />
        else if (this.state.expanding != -1 && this.state.promotions.p_expand_data.type == "Reward" && this.state.promotions.p_expand_data.id == row.id)
            return <RewardRowExpand data={this.state.promotions.p_expand_data} onChangeValue={this.updateDiscountChange.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} onSaveClick={this.savePromotionDetails.bind(this)} />
        else if (this.state.expanding != -1 && this.state.promotions.p_expand_data.type == "Product" && this.state.promotions.p_expand_data.id == row.id)
            return <ProductRowExpand data={this.state.promotions.p_expand_data} product={this.state.promotions.products_dropdown} onChangeValue={this.updateDiscountChange.bind(this)} onCancel={() => this.setState({ expanding: [-1] })} onSaveClick={this.savePromotionDetails.bind(this)} />


    }
    //pagination functions
    renderSizePerPageDropDown(props) {
        return (
            <select id='select' style={{ width: '120px', 'margin-top': '0px' }} name='group' className='table-dropd form-control input-sm' size='1' onChange={this.onToggleDropDown.bind(this)}>

                <option value='10'  >10 per page</option>
                <option value='25' selected="selected" >25 per page</option>
                <option value='50'>50 per page</option>
                <option value='100'>100 per page</option>
                <option value='200'>200 per page</option>
            </select>
        );
    }
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
    //handle expand request---------------------------------------------------------------------------------------start
    isExpandableRow(row) {

        return true;
    }

    // add new promotion
    async addNewAmountPromotion(data) {
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
        var store_prom = {
            name: "",
            id: 0,
            code: "",
            status: "active",
            startDate: today,
            endDate: today,
            offeramount: "",
            min: "",
            max: "",
            description: "",
            autoApply: true,
            priority: 1,
            customerLimit: 1,
            album: "",
            type: "Amount",
            p_type: "Discount-cash",
            add_new: true,



        };

        var new_arr = [];
        new_arr.push(store_prom);
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            promotions.p_table_data[i].id = i + 1;
            new_arr.push(promotions.p_table_data[i]);
        }
        if (await new_arr.length != 0) {
            promotions.p_table_data = await new_arr;
            promotions.add = true;
            promotions.add_type = data;
            promotions.p_expand_data = store_prom;
            this.setState({ expanding: [store_prom.id] });
            this.setState({ promotions });
        }
    }
    async  addNewAppPromotion(data) {
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
        var store_prom = {
            name: "",
            id: 0,
            code: "",
            status: "active",
            startDate: today,
            endDate: today,
            subTotal: "",
            min: "",
            max: "",
            description: "",
            autoApply: true,
            priority: 1,
            customerLimit: 1,
            serialNumber: 0,
            album: "",
            type: "App",
            p_type: "App-offer",
            add_new: true,


        };
        var new_arr = [];
        new_arr.push(store_prom);
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            promotions.p_table_data[i].id = i + 1;
            new_arr.push(promotions.p_table_data[i]);
        }
        if (await new_arr.length != 0) {
            promotions.p_table_data = await new_arr;
            promotions.add = true;
            promotions.add_type = data;
            promotions.p_expand_data = store_prom;
            this.setState({ expanding: [store_prom.id] });
            this.setState({ promotions });
        }
    }
    async  addNewRewardPromotion(data) {
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
        var store_prom = {
            name: "",
            id: 0,
            code: "",
            status: "active",
            startDate: today,
            endDate: today,
            amount: "",
            min: "",
            max: "",
            description: "",

            album: "",
            type: "Reward",
            p_type: "Rewards",
            add_new: true,




        };
        var new_arr = [];
        new_arr.push(store_prom);
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            promotions.p_table_data[i].id = i + 1;
            new_arr.push(promotions.p_table_data[i]);
        }
        if (await new_arr.length != 0) {
            promotions.p_table_data = await new_arr;
            promotions.add = true;
            promotions.add_type = data;
            promotions.p_expand_data = store_prom;
            this.setState({ expanding: [store_prom.id] });
            this.setState({ promotions });
        }
    }
    async addNewProductPromotion(data) {
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
        var store_prom = {
            name: "",
            id: 0,
            code: "",
            status: "active",
            startDate: today,
            endDate: today,
            autoApply: true,
            amount: "",
            offer_product_qty: "",
            offer_product_value: [],
            rules_product_qty: "",
            description: "",
            product_change: true,
            album: "",
            type: "Product",
            p_type: "Product-offer",
            add_new: true,

        };
        // var event = this.state.promotions.products_dropdown[0];
        // var offer_product_value = {
        //     _id: event.refId,
        //     refId: event.refId,
        //     name: event.name,
        //     slug: event.slug != null ? event.slug : event.id,
        //     id: event.slug != null ? event.slug : event.id,
        //     tags: event.tags,
        //     label: event.name,
        //     promotion: event.promotion,
        //     value: event.name,
        // };
        // store_prom.offer_product_value = offer_product_value;
        // store_prom.offer_product_value_name = event.name;

        var new_arr = [];
        new_arr.push(store_prom);
        var promotions = { ...this.state.promotions };
        for (var i = 0; i < promotions.p_table_data.length; i++) {
            promotions.p_table_data[i].id = i + 1;
            new_arr.push(promotions.p_table_data[i]);
        }
        if (await new_arr.length != 0) {
            promotions.p_table_data = await new_arr;
            promotions.add = true;
            promotions.add_type = data;
            promotions.p_expand_data = store_prom;
            this.setState({ expanding: [store_prom.id] });
            this.setState({ promotions });
        }
    }
    addNewPromotionLine(add_option, event) {

        if (add_option == "Amount") {
            this.setState({ open_add_option: false });
            this.addNewAmountPromotion(this, "Amount");

        } else if (add_option == "App") {
            this.setState({ open_add_option: false });

            this.addNewAppPromotion(this, "App");
        }
        else if (add_option == "Reward") {
            this.setState({ open_add_option: false });

            this.addNewRewardPromotion(this, "Reward");

        }
        else if (add_option == "Product") {
            this.setState({ open_add_option: false });

            this.addNewProductPromotion(this, "Product");

        }

    }
    async cancelNewPromotion(event) {
        this.setState({ p_type: "" });

        var promotions = { ...this.state.promotions };
        if (promotions.add == true) {
            promotions.add = false;
            promotions.pm = true;
            this.setState({ promotions });
            this.setState({ expanding: [-1] });
            var new_p_t_data = [];
            for (var i = 1; i < promotions.p_table_data.length; i++) {
                promotions.p_table_data[i].id = i - 1;
                new_p_t_data.push(promotions.p_table_data[i]);
            }
            if (await new_p_t_data.length != 0) {
                promotions.p_table_data = [];

                this.setState({ promotions });

                promotions.p_table_data = await new_p_t_data;
                promotions.add = false;
                // console.log("nwe",products.p_t_data)
                this.setState({ promotions });

                promotions.pm = false;
                this.setState({ promotions });
            }
            this.setState({ open_new_p_cancel: false });
            if (this.state.trying_new_promotion == true) {
                this.setState({ open_add_option: true });
            }
        }
    }

    //open add option
    openAddOption(event) {
        if (this.state.promotions.add == false)
            this.setState({ open_add_option: true, anchorEl: event.currentTarget });
        else {
            this.setState({ open_new_p_cancel: true, trying_new_promotion: true });
            if (this.state.promotions.p_table_data[0].p_type == "Product-offer") {
                this.setState({ p_type: "Product-offer" });
            }
        }
    }
    async deleteImage() {
        await RestApi.setToken();
        this.setState({ d_image_d_open: false });
        this.setState({ open_image_up: false });
        var promotions = { ...this.state.promotions };
        promotions.p_table_data[this.state.images.row_data.id].album = "";
        promotions.p_table_data[this.state.images.row_data.id].image_upload = null;

        if (promotions.p_table_data[this.state.images.row_data.id].refId != null) {
            promotions.p_table_data[this.state.images.row_data.id].meta.lastModified.time = Math.round(new Date().getTime());
            var update_p_object = {
                meta: promotions.p_table_data[this.state.images.row_data.id].meta,
                album: null,
            };


            fetch(RestApi.isFetch(promotion_url + "/" + promotions.p_table_data[this.state.images.row_data.id].refId), RestApi.getPatchMethod(update_p_object)).then(res => {
                if (res.ok) {
                    res.json().then(json => {


                    });
                }
                else
                    this.props.history.replace('/login');


            }).catch(err => err);

        }
        this.setState({ promotions });
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
        promotions.p_table_data[this.state.images.row_data.id].album = this.state.images.image_expand_data;

        this.setState({ open_image_view: false });

        if (promotions.p_table_data[this.state.images.row_data.id].refId != null) {
            promotions.p_table_data[this.state.images.row_data.id].meta.lastModified.time = Math.round(new Date().getTime());
            var update_p_object = {
                meta: promotions.p_table_data[this.state.images.row_data.id].meta,
            };

            if (promotions.p_table_data[this.state.images.row_data.id].image_upload != null) {

                var permalink = {};
                if (promotions.p_table_data[this.state.images.row_data.id].album != '') {
                    // this.setState({ open_img_upload: true });

                    var url = f_img_url + this.nameToSlugConvert(promotions.p_table_data[this.state.images.row_data.id].name) + '%2F' + this.nameToSlugConvert(promotions.p_table_data[this.state.images.row_data.id].name);
                    permalink.permalink = (f_img_url + this.nameToSlugConvert(promotions.p_table_data[this.state.images.row_data.id].name) + '%2F' + this.nameToSlugConvert(promotions.p_table_data[this.state.images.row_data.id].name) + '?alt=media')

                    update_p_object.album = permalink;

                    fetch(url, RestApi.getPostImageMethod(promotions.p_table_data[this.state.images.row_data.id].image_upload)).then(res => {
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
            fetch(RestApi.isFetch(promotion_url + "/" + promotions.p_table_data[this.state.images.row_data.id].refId), RestApi.getPatchMethod(update_p_object)).then(res => {
                if (res.ok) {
                    res.json().then(json => {


                    });
                }
                else
                    this.props.history.replace('/login');


            }).catch(err => err);

        }





        this.setState({ promotions });

    }
    render() {


        const options = {

            expandBy: 'column',  // Currently, available value is row and column, default is row,

            expanding: this.state.expanding,

            sizePerPageDropDown: this.renderSizePerPageDropDown.bind(this),
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
        const actions1 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ show_activeinactive: false, deactive_old_p: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openDialogAvtiveInactive.bind(this, this.state.rowData)}

            />,
        ];
        const actions2 = [ //dailog actions
            <FlatButton
                label="No"
                disabled={this.state.start_save}
                primary={true}
                onClick={() => this.setState({ open_promotion_upload: false, open_save_dialog: false })}
            />,
            <FlatButton
                disabled={this.state.start_save}
                label="Yes"
                primary={true}
                onClick={() => (this.setState({ start_save: true, open_promotion_upload: true }), this.openDialogSaveSelect(this.state.savedata))}

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
                onClick={this.cancelNewPromotion.bind(this)}

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
            <div className="">
                {this.state.promotions.p_table_data.length == 0 ?
                    //  <div class="spinner"></div>
                    <div class="sk-folding-cube">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                    </div>
                    : null}
                {this.state.promotions.p_table_data != 0 ?
                    <Row className="user-div" >
                        <div style={{ 'overflow-x': 'scroll' }} >
                            <Col xs="12" md="12">
                                <Card className="card-bottom-margin box-shadow" style={{ 'margin-bottom': '6px' }} >

                                    <CardBody className="">

                                        <BootstrapTable data={this.state.promotions.p_table_data} className="user-table"
                                            expandableRow={this.isExpandableRow.bind(this)}
                                            expandComponent={this.expandComponent.bind(this)}
                                            options={options}
                                            pagination
                                            ref="table"
                                            width="30"
                                            version="4" condensed ref='table'
                                            tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-13.5px', 'margin-right': '-16px', ' margin-top': '-1.99%', cursor: 'pointer' }}

                                        //  tableStyle={{ 'table-layout': 'fixed', 'margin-left': '-2.0%', 'margin-right': '-2.0%', ' margin-top': '-1.99%', cursor: 'pointer' }} 
                                        >

                                            <TableHeaderColumn isKey={true} row='0' dataField='id' tdStyle={{ position: 'absolute', 'z-index': '15', 'background-color': '#fff' }} editable={false} expandable={false} className="" rowSpan='2' width='80' dataAlign='center' dataFormat={this.customActionMenu.bind(this)}  >
                                                <div class="float-action-fixed-left">
                                                    <FloatingActionButton backgroundColor="green" className="add-mrg-top" mini={true} zDepth={2} onClick={this.openAddOption.bind(this)}>
                                                        <i class="material-icons">library_add</i>

                                                        {/* <IconMenu   
                                                    className="wert"
                                                    disabled={this.state.promotions.add}
                                                    iconButtonElement={<IconButton iconClassName="material-icons"
                                                        disabled={this.state.promotions.add}

                                                        className="iconbutton-height" iconStyle={{ color: 'green' }}>add_box</IconButton>}
                                                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                                    targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}

                                                   >
                                                    <MenuItem primaryText="Discount"
                                                        className="menu-style"
                                                        leftIcon={<IconButton

                                                            iconClassName="material-icons"
                                                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                                                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                                                            add
                                                          </IconButton>}

                                                        onClick={this.addNewPromotionLine.bind(this, "Amount")}
                                                    />
                                                    <MenuItem primaryText="App Offer"
                                                        className="menu-style"
                                                        leftIcon={<IconButton

                                                            iconClassName="material-icons"
                                                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                                                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                                                            add
                                                            </IconButton>}
                                                        onClick={this.addNewPromotionLine.bind(this, "App")}

                                                    />
                                                    <MenuItem primaryText="Rewards"
                                                        className="menu-style"
                                                        leftIcon={<IconButton

                                                            iconClassName="material-icons"
                                                            iconStyle={{ margin: '0px !important', color: '#263238' }}
                                                            style={{ 'height': '0px', margin: '0px !important', color: 'grey' }} >
                                                            add
                                                            </IconButton>}
                                                        onClick={this.addNewPromotionLine.bind(this, "Reward")}

                                                    />
                                                </IconMenu> */}


                                                    </FloatingActionButton>
                                                </div>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='name' expandable={false} row="0" dataAlign="center" width="250"  > Name
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

                                            <TableHeaderColumn dataField='p_type' expandable={false} row="0" dataAlign="center" width="150"  > Type
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "p_type", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "p_type", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='code' dataAlign="center" width="190" row="0" >Code
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "code", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "code", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='startDate' dataAlign="center" width="170" row="0" >Start Date
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "startDate", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "startDate", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='endDate' dataAlign="center" width="170" row="0" >End Date
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "endDate", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "endDate", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='description' dataAlign="center" width="400" row="0" >Description
                                            <IconMenu className="pull-right"
                                                    iconStyle={{ padding: '0px !important' }} iconButtonElement={<i class="material-icons pull-right" title="Sort ASC/DESC" style={{ cursor: 'pointer' }}>sort</i>}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem primaryText="ASC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "description", "asc")} />
                                                    <MenuItem primaryText="DESC" // save menu 
                                                        className="menuitem-style"
                                                        onClick={this.sorthandleBtnClick.bind(this, "description", "desc")} />
                                                </IconMenu>
                                            </TableHeaderColumn>

                                            <TableHeaderColumn dataField='album' expandable={false} dataAlign="center" width="200" row="0" >Image  </TableHeaderColumn>

                                            <TableHeaderColumn dataAlign="center" width="280" dataField='name' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a  Name' }} dataFormat={this.tableNameInputField.bind(this)}> </TableHeaderColumn>
                                            <TableHeaderColumn dataAlign="center" width="180" dataField='p_type' row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a  Type' }} dataFormat={this.tableTypeInputField.bind(this)}> </TableHeaderColumn>

                                            <TableHeaderColumn dataField='code' expandable={false} dataAlign="center" width="240" expandable={false} row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a code' }} dataFormat={this.tableInputCodeField.bind(this)}></TableHeaderColumn>

                                            <TableHeaderColumn dataAlign='center' dataField='startDate' width="190" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Start Date' }} dataFormat={this.tableInputStartDateField.bind(this)} > </TableHeaderColumn>

                                            <TableHeaderColumn dataAlign='center' dataField='endDate' width="190" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a End Date' }} dataFormat={this.tableInputEndDateField.bind(this)} > </TableHeaderColumn>

                                            <TableHeaderColumn dataAlign='center' dataField='description' width="420" row="1" expandable={false} filter={{ type: 'TextFilter', placeholder: 'Please enter a Description' }} dataFormat={this.tableInputDescriptionField.bind(this)} > </TableHeaderColumn>

                                            <TableHeaderColumn expandable={false} dataAlign="center" expandable={false} width="230" dataField='album' row="1" filter={{ type: 'TextFilter', placeholder: 'Please enter a image' }} dataFormat={this.tableImageFileField.bind(this)}></TableHeaderColumn>




                                        </BootstrapTable>




                                    </CardBody>

                                </Card>
                            </Col>
                        </div>
                    </Row> : null}

                <Popover
                    open={this.state.open_add_option}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    style={{ 'font-size': '12px !important' }}
                    onRequestClose={() => this.setState({ open_add_option: false })}
                >
                    <Menu>

                        <MenuItem primaryText=" Order Offer: Cash " onClick={this.addNewPromotionLine.bind(this, "Amount")} className="menu-style"
                            leftIcon={<i class="material-icons">add</i>} />
                        <MenuItem primaryText="Product Offer" onClick={this.addNewPromotionLine.bind(this, "Product")} className="menu-style"
                            leftIcon={<i class="material-icons">add</i>} />
                        <MenuItem primaryText="App Offer" onClick={this.addNewPromotionLine.bind(this, "App")} className="menu-style"
                            leftIcon={<i class="material-icons">add</i>} />
                        <MenuItem primaryText="Rewards" onClick={this.addNewPromotionLine.bind(this, "Reward")} className="menu-style"
                            leftIcon={<i class="material-icons">add</i>} />

                    </Menu>
                </Popover>

                <Dialog actions={actions1} modal={false} open={this.state.show_activeinactive} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ show_activeinactive: false, deactive_old_p: false })}>

                    {this.state.deactive_old_p == true ? "Promotion \'" + this.state.product_details.promotion.name + "\' will be disassociated  and Current promotion will be associated with product \'" + this.state.product_details.name + "\'. Do you want to continue activating?" : "Do you want to" + this.state.row_status + " the promotion \'" + this.state.promotionname + "\'"}
                </Dialog>

                <Dialog actions={actions2} modal={false} open={this.state.open_save_dialog} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                    {this.state.start_save != true ? " Do you want to Save ?" : null}
                    {this.state.open_promotion_upload == true ?
                        <div>
                            Saving Promotion.....
                            <br />
                            <center> <Spinner name="line-scale-pulse-out-rapid" /></center>


                        </div> : null}

                </Dialog>


                <Dialog actions={actions_cancel} modal={false} open={this.state.open_new_p_cancel} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_new_p_cancel: false })}>
                    {this.state.p_type == "Product-offer" ? "Do you want to continue creating new promotion ? (By default promotion will be Inactive. Please activate it at later point of time)" : "You are in a process of adding new Promotion. Do you want to exit ?"}
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
                    className="sdfdsf"
                    message="Please Fill Required Fields."
                    style={{ color: 'white', 'background-color': 'red !important' }}
                    style={{ top: 0, height: 0 }}
                    bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}

                    autoHideDuration={6000}
                    onRequestClose={() => this.setState({ open: false })}
                />

                <Snackbar
                    open={this.state.same_name_found}
                    message="Same Name Existing"
                    style={{ color: 'white', 'background-color': 'red !important' }}
                    style={{ top: 0, height: 0 }}
                    bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                    autoHideDuration={6000}
                    onRequestClose={() => this.setState({ same_name_found: false })}
                />
                <Snackbar
                    open={this.state.same_code_found}
                    message="Same Code Existing"
                    style={{ color: 'white', 'background-color': 'red !important' }}
                    style={{ top: 0, height: 0 }}
                    bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                    autoHideDuration={6000}
                    onRequestClose={() => this.setState({ same_code_found: false })}
                />

                <Snackbar
                    open={this.state.show_pro_activate_open}
                    message="There is a different promotion associated with the promotion."
                    action="Yes"
                    bodyStyle={{ 'font-weight': 'bold' }}

                    style={{ color: 'white' }}
                    style={{ top: 0, height: 0 }}
                    autoHideDuration={this.state.autoHideDuration_p_acti}
                    onActionClick={() => this.setState({ show_activeinactive: true, deactive_old_p: true, show_pro_activate_open: false })}
                    onRequestClose={() => this.setState({ show_pro_activate_open: false })}
                />

                <Snackbar
                    open={this.state.d_image_d_open}
                    message="Do you want To Remove"
                    action="Yes"
                    bodyStyle={{ 'font-weight': 'bold' }}

                    style={{ color: 'white' }}
                    style={{ top: 0, height: 0 }}
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



                {/* <Dialog actions={actions2} modal={false} open={this.state.show_activeinactive} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ show_activeinactive: false })}>
                    Do you want to {this.state.row_status} the product '{this.state.productname}'
                </Dialog>

                <Dialog actions={actions3} modal={false} open={this.state.open_save_dialog} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_save_dialog: false })}>
                    Do you want to Save?
                    {this.state.open_img_upload != false ?
                        <div>
                            <br />
                            Uploading image.....
                                <Spinner name="wave" color="goldenrod" />
                        </div> : null}

                    {this.state.open_promotion_upload == true ?
                        <div>
                            <br />
                            Saving products.....
                                <Spinner name="wave" color="goldenrod" />
                        </div> : null}

                </Dialog>

                <Dialog actions={actions4} modal={false} open={this.state.open_s_d_new_p} contentStyle={{
                    width: '25%',
                    maxWidth: 'none'
                }} onRequestClose={() => this.setState({ open_s_d_new_p: false })}>
                    Do you want to Save?
                    {this.state.open_img_upload != false ?
                        <div>
                            <br />
                            Uploading image.....
                                <Spinner name="wave" color="goldenrod" />
                        </div> : null}

                    {this.state.open_promotion_upload == true ?
                        <div>
                            <br />
                            Saving products.....
                                <Spinner name="wave" color="goldenrod" />
                        </div> : null}

                </Dialog>

                


                */}
            </div>
        );
    }
}

PromotionView.propTypes = {

};

export default PromotionView;