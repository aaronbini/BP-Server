'use strict';

const express = require('express');
const app = express();
const readings = require('./routes/readings');
const actionItems = require('./routes/actionItems');
const users = require('./routes/users');
const auth = require('./routes/auth');
const google = require('./routes/google-routes');
const errorhandler = require('./errorHandler');
const notFound = require('./notFound');
const path = require('path');
const publicPath = path.resolve( __dirname, '../public' );
const ensureAuth = require('./auth/ensureAuth');

const cors = require('./auth/cors')('*');

module.exports = app
.use(express.static(publicPath))
.use(cors)
.use('/api/auth', auth)
.use('/api/google', google)
.use('/api/readings', ensureAuth, readings)
.use('/api/actionItems', ensureAuth, actionItems)
.use('/api/users', ensureAuth, users)
.use(errorhandler)
.use(notFound);
