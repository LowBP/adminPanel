import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key
import { browserHistory } from 'react-router';
import firebase from 'firebase';
import "babel-polyfill";


// global declration
var path = 'https://mediapp-tst.firebaseio.com/';
var fetch_data_format = '.json?';
const fetch_method = ({ method: 'GET', headers: { Accept: 'application/json', } });
// filter
const promotion_amount_filter = 'orderBy="offer/order/amount/value"';
const promotion_app_filter = 'orderBy="offer/order/subTotal"';
const promotion_reward_filter = 'orderBy="offer/wallet/percentage"';
const promotion_product_filter = 'orderBy="offer/product/quantity"';
const startAt_zero = '&startAt=0&';
const equalTo = 'equalTo=';
var token;
// promotion
export default {
  //get the token
  async setToken() {
    var new_token;
    if (firebase.auth().currentUser != null) {
      await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
        reactLocalStorage.set('token', idToken);
        new_token = idToken;
      });
    }
    else {
      await firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            reactLocalStorage.set('token', idToken);
            new_token = idToken;


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
    //  var token = 'auth=' + reactLocalStorage.get('token');
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

  doPromotionFilterByAmount(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_amount_filter + startAt_zero + token + '');
  },
  doPromotionFilterByAppOffer(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_app_filter + startAt_zero + token + '');

  },
  doPromotionFilterByRewards(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_reward_filter + startAt_zero + token + '');

  },
  doPromotionFilterByProduct(url) {
    token = this.getToken();

    return (path + url + fetch_data_format + promotion_product_filter + startAt_zero + token + '');;
  },

  isTokenExpried() {

    this.props.history.replace('/login');
  }

};
