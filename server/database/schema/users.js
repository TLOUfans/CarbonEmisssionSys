'use strict';
let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    code: String,
    name: String,
    password: String,
    regDate: Date,
    updDate: Date
});
