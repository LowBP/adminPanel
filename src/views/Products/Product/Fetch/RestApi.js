import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key
import { browserHistory } from 'react-router';
import firebase from 'firebase';
import "babel-polyfill";

// global declration
var path = 'https://mediapp-tst.firebaseio.com/';
var token;
var fetch_data_format = '.json?';
const fetch_method = ({ method: 'GET', headers: { Accept: 'application/json', } });
// filter
const promotion_product_filter = 'orderBy="offer/product/quantity"';
const promotion_product_filter_startAt = '&startAt=0&';

const promotion_offer_product_value = 'orderBy="offer/product/value/_id"&';
const equalTo = 'equalTo=';
const skus_name = 'orderBy="name"&'

// promotion
export default {
  //get the token
  async setToken() {
    var new_token;
    if (firebase.auth().currentUser != null) {
      await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
        reactLocalStorage.set('token', idToken);
        new_token=idToken;
      });
    }
    else {
     await firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            reactLocalStorage.set('token', idToken);
            new_token=idToken;
            

          });
        }
      });
    } 
  
    return await new_token;

  }, getToken() {
    return ('auth=' + reactLocalStorage.get('token'));

  },
  //fetch  related functions
  isFetch(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + token + '');;
  },
  getFetchMethod() {
    return fetch_method;
  },
  getPatchMethod(data) {
    return ({ method: 'PATCH', headers: { Accept: 'application/json', }, body: JSON.stringify(data) });;
  },
  getPostMethod(data) {
    return ({ method: 'POST', headers: { Accept: 'application/json', }, body: JSON.stringify(data) });
  },
  getPostImageMethod(data) {
    return ({ method: 'POST', body: data });
  },

  doPromotionFilter(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_product_filter + promotion_product_filter_startAt + token + '');;
  },
  doProductWisePromoFilter(url, key) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_offer_product_value + equalTo + key + '&' + token + '');
  },
  doCheckSkusSame(url, value) {
    token = this.getToken();

    return path + url + fetch_data_format + skus_name + equalTo + value + '&' + token + '';
  },

  isTokenExpried() {

    this.props.history.replace('/login');
  },
  getRemoveMethod() {
    return ({ method: 'DELETE', });

  }

};