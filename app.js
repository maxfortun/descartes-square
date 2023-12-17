const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('dsquares');

const options = require('./options');
const oidc = require('@ezsso/express-client').oidc(options);

const dsquares = require('./lib/dsquares');
const apiRouter = require('./routes/api');

const app = express();
app.settings.oidc = oidc;
app.settings.options = options;

const requestId = require('express-request-id');
app.use(requestId());
app.use(function(req, res, next) {
	res.set('x-app', 'descartes-squares');
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/oidc/idpresponse', oidc.idpresponse);
const staticFiles = express.static(path.join(__dirname, 'public'));
app.use('/api', oidc.authorize, dsquares.account, apiRouter);
app.use('/logout', oidc.logout);
app.use(staticFiles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = "Error";
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
