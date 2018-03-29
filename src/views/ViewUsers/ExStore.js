import React, { Component } from 'react';
import PropTypes from 'prop-types';
class ExStore extends Component {
    constructor(props) {
    
        super(props);
        this.users=[];//users data fetched 
        this.last_refId='';
        this.single_user='';
        this.status='';
        this.currentPage=1;
        this.drop_val=25;
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}
export default (new ExStore);
