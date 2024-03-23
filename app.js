const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const MongoDB = require('./services/mongodb.service');

MongoDB.connectToMongoDB();

const app = express();
const ipAddress = '192.168.56.1'; // Replace with your IP address
const port = 4000; // או כל מספר פורט אחר שאינו תפוס


app.set('ip', ipAddress);
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', authenticationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), app.get('ip'), function() {
  console.log(`Server listening on http://${app.get('ip')}:${app.get('port')}`);
});

module.exports = app;
