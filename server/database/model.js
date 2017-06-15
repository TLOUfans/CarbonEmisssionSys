'use strict';
let  mongoose = require("mongoose");

module.exports = function getModel(modelName){
    let db = mongoose.createConnection("mongodb://127.0.0.1:27017/CarbonEmissionDB");
    let schema = require(`./schema/${modelName}`);
    schema.statics.findByPage = async function(index,size,queryParams,sortParams){
        const startNum = (index - 1 ) * size;
        return{
            count    : await this.count(queryParams).catch(err => {return err}),
            records  : await this.find(queryParams).skip(startNum).limit(size).sort(sortParams).catch(err => {return err})
        }
    }
    return db.model(modelName,schema);
};
