const express             = require ('express');
const path                = require ('path');
const cookieParser        = require ('cookie-parser');
const logger              = require ('morgan');
const auth                = require ("./middleware/auth")


require ("dotenv").config ();
require ("./config/database").connect ();

const authRouter          = require ('./routes/auth');

var app                   = express();

app.use (logger ('dev'));
app.use (express.json ());
app.use (express.urlencoded ({ extended: false }));
app.use (cookieParser ());
app.use (express.static (path.join (__dirname, 'public')));

app.use ('/auth', authRouter);

module.exports            = app;
