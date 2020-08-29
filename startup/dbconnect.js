const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');
module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    //.then(() => winston.info(`Connected to ${db}...`)); //use this to log 
    .then(() => console.log(`Connected to ${db}...`));
}; 