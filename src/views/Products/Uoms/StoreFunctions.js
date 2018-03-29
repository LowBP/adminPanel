import "babel-polyfill";
import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';//local storage for storing the auth key
export default { 
    async uomsCode() {
        var arr = [];
        var data = ["tablet", "strip", "monocarton", "gm", "tube", "ml", "vial","bottle","pack","1-vial-1-tray","cassette","1-vial-wfi-20ml"];
        for (var i in data) {
            var temp = {};
            temp.label = data[i];
            temp.value = data[i];
            arr.push(temp);
        }
        return (await arr);
    },
    async dimension() {
        var arr = [];
        var data = ["business"];
        for (var i in data) {
            var temp = {};
            temp.label = data[i];
            temp.value = data[i];
            arr.push(temp);
        }
        return (await arr);
    },
    Tags() {
        var tags = ["tablet", "strip", "capsule", "strip", "monocarton", "ointment", "cream"];
        return tags;
    },
   





};