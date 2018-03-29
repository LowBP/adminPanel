
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
import Spinner from 'react-spinkit';

import Snackbar from 'material-ui/Snackbar';

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

const skus_url = "skus";
const meta_url = "/meta/lastModified";


class AddSkusRowExpand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sku_name: '',
            sku_value: [],
            skus: {
                s_t_data: [],
                sku_expand_data: this.props.data.sku_expand_data,
                manufacture_drop_down: this.props.data.manufacture,
                products: this.props.products,
            }
        };
    }
    initializeSku(data) {
        var store_t_sku_data = {
            name: '',
            manufacture_name: '',

        };

        var skus = { ...this.state.skus };
        skus.s_t_data = [store_t_sku_data];
        skus.manufacture_drop_down = data.manufacture;
        skus.sku_expand_data = data.sku_expand_data;
        this.setState({ skus });

    }
    componentWillMount() {
        if (this.props.data != null) {
            this.initializeSku(this.props.data);

        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            this.initializeSku(nextProps.data);

        }
    }
    //save
    async saveSkus(skus) {

      
        await RestApi.setToken();

        this.setState({ open_sku_upload: true });
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
        var slug = "";
        skus.s_t_data[0].name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
        });
        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        var manufacture = skus.s_t_data[0].manufacture;
        var store_sku_object = {
            id: slug,
            slug: slug,
            meta: meta,
            name: skus.s_t_data[0].name,
            status: "active",
            uom: skus.sku_expand_data.uom_t_sku,
            manufacturer: {
                _id: manufacture.refId,
                refId: manufacture.refId,
                name: manufacture.name,
                id: manufacture.id,
                slug: manufacture.id,
                tags: manufacture.tags
            },
        };
        if(skus.sku_expand_data.refId !=null){
        var status = { status: "inactive" };
        var sku_ex_refId;
        if (skus.sku_expand_data.sku != null) {
            if (skus.sku_expand_data.sku.refId != null)
                sku_ex_refId = skus.sku_expand_data.sku.refId;
            else
                sku_ex_refId = skus.sku_expand_data.sku._id;

            await fetch(RestApi.isFetch(skus_url + "/" + sku_ex_refId), RestApi.getPatchMethod(status)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("status_change", json);
                    });
                }
                else
                    this.props.history.replace('/login');

            }).catch(function (error) { console.log(error); });//end

            var time = {
                time: Math.round(new Date().getTime()),
            };
            await fetch(RestApi.isFetch(skus_url + "/" + sku_ex_refId + meta_url), RestApi.getPatchMethod(time)).then(response => {//products fetch
                if (response.ok) {
                    response.json().then(json => {
                        // console.log("status_change", json);
                    });
                }
                else
                    this.props.history.replace('/login');

            }).catch(function (error) { console.log(error); });//end
        }

        await fetch(RestApi.isFetch(skus_url), RestApi.getPostMethod(store_sku_object)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    // console.log(json);
                    store_sku_object.refId = json.name;
                    store_sku_object._id = json.name;
                    this.props.onChangeValue(store_sku_object);
                    this.setState({ start_saving: false });

                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end
        // console.log(store_sku_object);
        this.setState({ save_open: false });
        this.setState({ open_sku_upload: false });
    }
    else
    {
        this.props.onChangeValue(store_sku_object);
        this.setState({ start_saving: false });
        this.setState({ save_open: false });
        this.setState({ open_sku_upload: false });
    }

    }
    async  openSaveData(event) {
        await RestApi.setToken();
        
        var name = "\"" + skus.s_t_data[0].name + "\"";
        this.setState({ open_match_alert: false });

        await fetch(RestApi.doCheckSkusSame(skus_url, name), RestApi.getFetchMethod()).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    var ii;
                    for (var i in json) {
                        ii = i;
                        if (json[i].name != null) {
                            this.setState({ save_open: false });
                            this.setState({ open_match_alert: true });

                        }


                    }
                    if (json[ii] == null)
                        this.saveSkus(skus);


                });
            }
            else
                this.props.history.replace('/login');

        }).catch(function (error) { console.log(error); });//end






    }
    validateSku() {
        var skus = { ...this.state.skus };
        for (var i = 0; i < skus.products.length; i++) {

            if (skus.products[i].sku_name == skus.s_t_data[0].name) {
                this.setState({ open_match_alert: true });
                return;
            }
        }

        if (skus.s_t_data[0].name == '' || skus.s_t_data[0].manufacture == null) {
            this.setState({ open_error_alert: true });
            this.setState({ save_open: false });

        }
        else {
            this.setState({ save_open: true });
        }

    }
    //table input fields
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input value={this.state.sku_name} required className='filter text-filter form-control   ' onChange={(data) => this.setState({ sku_name: data.target.value })} onBlur={(data) => rowData[cellFeild] = this.setCodeFromat(data.target.value)} />
        );
    }
    setCodeFromat(code) {
        var code_value = "";
        code.split(' ').map(data => {
            code_value += data;
        });
        code_value = code_value.toUpperCase();
        this.setState({ sku_name: code_value });
        return code_value;
    }
    onChangeManufactureUpdate(rowData, event) {
        var skus = { ...this.state.skus };
        skus.s_t_data[0].manufacture = event;
        this.setState({ sku_value: event });
        this.setState({ skus });
    }
    tableInputManufactureField(cellValue, rowData, nothing, cellFeild) {
        return (
            <Select
                value={this.state.sku_value}
                options={this.state.skus.manufacture_drop_down}
                clearable={false}
                placeholder="--Select Manufacture--"
                required
                onChange={this.onChangeManufactureUpdate.bind(this, rowData)}
            />

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
                onClick={() => (this.setState({ start_saving: true }), this.saveSkus(this.state.skus))}

            />,
        ];
        // console.log(this.state.skus)
        return (
            <div class="row">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >
                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateSku.bind(this)}></i>

                        <br />
                    </div>
                    <br />
                    <br />

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => (this.props.onCancel())}></i>
                    </div>

                </div>
                <div class="col-lg-11  was-validated">


                    <div style={{ 'margin-left': '2236px' }}>


                        <BootstrapTable width='190' data={this.state.skus.s_t_data} condensed


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
                            <TableHeaderColumn dataAlign='center' dataField='name' isKey expandable={false} dataFormat={this.tableInputNameField.bind(this)} >Name   </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='manufacture_name' expandable={false} dataFormat={this.tableInputManufactureField.bind(this)}>Manufacture  </TableHeaderColumn>


                        </BootstrapTable>
                        <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.setState({ save_open: false })}>
                            {this.state.start_saving != true ? "\'" + this.state.skus.s_t_data[0].name + "\' will be associated for the product. Do you want to continue?" : <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                        </Dialog>
                        <Snackbar
                            open={this.state.open_error_alert}
                            message="Please Fill all required fields"
                            autoHideDuration={4000}
                            style={{ color: 'white', 'background-color': 'red !important' }}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            style={{ top: 0, height: 0 }}
                            onRequestClose={() => this.setState({ open_error_alert: false })}
                        />

                        <Snackbar
                            open={this.state.open_match_alert}
                            message="Same Sku Found"
                            style={{ color: 'white', 'background-color': 'red !important' }}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            style={{ top: 0, height: 0 }}
                            autoHideDuration={8000}
                            onRequestClose={() => this.setState({ open_match_alert: false })}
                        />

                    </div>
                </div>


            </div  >
        );
    }
}

AddSkusRowExpand.propTypes = {

};

export default AddSkusRowExpand;