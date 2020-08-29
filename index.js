const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/logging')();
require('./startup/dbconnect')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
//app.listen(port, () => wins.info(`Listening on port ${port}...`));// use this to log 
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;