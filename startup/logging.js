const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.Console({colorize:true , prettyPrint:true}),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  winston.add(new winston.transports.File({filename:'log/logfile.log'})); // add a new storage device (trasport)... 
  winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/project',collection: 'errorlogs', level: 'info'}));  
}



