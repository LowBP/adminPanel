import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Store from '../../DataHandling/StoreFunctions';

// Class import
import RestApi from '../../Fetch/RestApi';

import Spinner from 'react-spinkit';


//recent installed import invoke
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown, SearchField } from 'dubase-table'; import 'dubase-table/css/react-bootstrap-table.css'
import "babel-polyfill";
import Select from 'react-select';

import Snackbar from 'material-ui/Snackbar';

// Dialog
import Dialog from 'material-ui/Dialog';//dialog box 
import FlatButton from 'material-ui/FlatButton';//flat button

var category_url = "categories";
class AddCategoryRowExpand extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: {
                c_table_data: [],
                tags: [],
            },
            add_to_product_t_data: '',

        };

        this.tableInputNameField = this.tableInputNameField.bind(this);
        this.tableInputTagsField = this.tableInputTagsField.bind(this);
        this.changeTags = this.changeTags.bind(this);

        // save
        this.openSaveData = this.openSaveData.bind(this);

        this.openAddToProduct = this.openAddToProduct.bind(this);

    }
    async categoryInit() {

        var new_cat_object = {
            id: '',
            name: '',
            slug: '',
            tags: [],
            status: { status: "active" },

        }
        var categories = { ...this.state.categories };
        new_cat_object.tags = categories.tags;
        categories.c_table_data = [new_cat_object];
        //  categories.tags = await Store.categoryTags();

        this.setState({ categories });

    }
    async  componentWillMount() {
        this.state.categories.tags = await Store.categoryTags();

        this.categoryInit();


    }
    async  componentWillReceiveProps(nextProps) {
        this.state.categories.tags = await Store.categoryTags();

        this.categoryInit();

    }
    //save..............
    async openSaveData(event) {
        await RestApi.setToken();

        var data = this.state.saveData;
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
            entity: "category"

        };

        var slug = "";
        data.name.split(' ').map((data) => {
            if (data != "") slug += data + "-";
            //  console.log(data);
        });
        slug = slug.substring(0, slug.length - 1);
        slug = slug.toLowerCase();
        var arr = [];
        for (var i in data.tags) {
            arr.push(data.tags[i].value);

        }
        var save_data = {
            name: data.name,
            meta: meta,
            status: data.status,
            id: slug,
            slug: slug,
            tags: arr,

        };
        var cat_to_product_save = {
            name: data.name,
            refId: '',
            _id: '',
            slug: slug,
            tags: arr,
        };
        await fetch(RestApi.isFetch(category_url), RestApi.getPostMethod(save_data)).then(response => {//products fetch
            if (response.ok) {
                response.json().then(json => {
                    cat_to_product_save.refId = json.name;
                    cat_to_product_save._id = json.name;
                    this.props.onChangeValue(cat_to_product_save, false);

                    // this.props.onChangeValue(cat_to_product_save, true);
                    this.setState({ add_to_product_t_data: cat_to_product_save, save_open: false, start_saving: false });



                });
            }
            else
                RestApi.isTokenExpried();

        }).catch(function (error) { console.log(error); });//end


    }
    validateCategory(event) {
        var data = this.state.categories.c_table_data[0];

        if (data.tags.length != 0 && data.name != "") {
            this.setState({ saveData: data, save_open: true })
        }
        else {
            this.setState({ open: true, save_open: false });
        }
    }
    openAddToProduct() {
        this.props.onCancel();
        this.props.onChangeValue(this.state.add_to_product_t_data, true);
        this.setState({ add_to_pr: false });
    }
    tableInputNameField(cellValue, rowData, nothing, cellFeild) {
        return (
            <input defaultValue={cellValue} required className='filter text-filter form-control   ' onBlur={(data) => rowData[cellFeild] = data.target.value} />
        );
    }
    changeTags(rowData, event) {
        var categories = { ...this.state.categories };
        categories.c_table_data[0].tags = event;
        this.setState({ categories });
    }
    tableInputTagsField(cellValue, rowData, nothing, cellFeild) {
        // console.log(rowData)

        var border_clr = rowData.tags != null ? 'green' : 'red';
        return (
            <Select
                style={{ 'border-color': border_clr }}

                onChange={this.changeTags.bind(this, rowData)}
                multi
                options={this.state.categories.tags}
                value={rowData.tags}
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
                onClick={() => (this.setState({ start_saving: true }), this.openSaveData(this))}

            />,
        ];
        const actions1 = [ //dailog actions
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.setState({ add_to_pr: false })}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.openAddToProduct}

            />,
        ];
        return (
            <div class="row was-validated">
                <div class="col-lg-1" style={{ position: 'absolute', 'margin-left': '12px', 'background-color': '#fff', width: '60px', 'z-index': '10', height: "78px" }} >
                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff', }}>
                        <i class="fa fa-save fa-lg mt-2 f-edit" onClick={this.validateCategory.bind(this)}></i>

                        <br />
                    </div>
                    <br />
                    <br />

                    <div style={{ position: 'absolute', 'z-index': '10', 'background-color': '#fff' }}>
                        <i class="fa fa-close fa-lg mt-2 f-edit" onClick={() => (this.props.onCancel())}></i>
                    </div>

                </div>
                <div class="col-lg-11">


                    <div style={{ 'margin-left': '585px' }}>


                        <BootstrapTable width='190' data={this.state.categories.c_table_data} condensed


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
                            <TableHeaderColumn dataAlign='center' dataField='name' isKey expandable={false} dataFormat={this.tableInputNameField} >Name   </TableHeaderColumn>
                            <TableHeaderColumn dataAlign='center' dataField='tags' expandable={false} dataFormat={this.tableInputTagsField}>Tags  </TableHeaderColumn>


                        </BootstrapTable>
                        <Dialog actions={save_action} modal={false} open={this.state.save_open} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.setState({ save_open: false })}>
                            {this.state.start_saving != true ? "Do you want to add category to product ?" :
                                <center> <Spinner name="line-scale-pulse-out-rapid" /></center>}

                        </Dialog>
                        <Dialog actions={actions1} modal={false} open={this.state.add_to_pr} contentStyle={{
                            width: '25%',
                            maxWidth: 'none'
                        }} onRequestClose={() => this.state.add_to_pr = false}>
                            Do you want to add selected product
            </Dialog>
                        <Snackbar
                            open={this.state.open}
                            message="Please Fill Required Fields"
                            autoHideDuration={6000}
                            bodyStyle={{ 'background-color': 'red', 'font-weight': 'bold' }}
                            onRequestClose={() => this.setState({ open: false })}
                        />
                    </div>
                </div>


            </div  >
        );
    }
}
AddCategoryRowExpand.propTypes = {

};

export default AddCategoryRowExpand;