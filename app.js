const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('express-jwt');

const config = require('./config/config');
const routers = require('./server/routes');

const app = express();

mongoose.connect(config.config.MONGO_URI);
const db = mongoose.connection;
db.once('open', () => {
    console.log('DB CONNECTED!!');
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', routers.login);

module.exports = app;
