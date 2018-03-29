import "babel-polyfill";
import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key
import DB from './DB';
export default {
    async productForm() {
        var arr = [];
        var data = ["Capsule", "Powder", "Syrup", "Tablet", "Ointment", "Injection", "Cassette","Tube","Dry Syrup"];
        for (var i in data) {
            var temp = {};
            temp.label = data[i];
            temp.value = data[i];
            arr.push(temp);
        }
        return (await arr);
    },
    async BrandTags() {
        var arr = [];
        var data = ["Healthcare", "Medical", "Pharmaceutical"];
        for (var i in data) {
            var temp = {};
            temp.label = data[i];
            temp.value = data[i];
            arr.push(temp);
        }
        return (await arr);
    },
    promotionTags() {
        var tags = ["MediApp", "Offer", "Sale", "Free", "Scheme", "Promotion", "Plus"];
        return tags;
    },
    async categoryTags() {
        var arr = [];
        var data = ["Healthcare", "Medical", "Pharmaceutical"];
        for (var i in data) {
            var temp = {};
            temp.label = data[i];
            temp.value = data[i];
            arr.push(temp);
        }
        return (await arr);
    }





};