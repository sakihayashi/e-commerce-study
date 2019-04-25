var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var passport = require('passport');

var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/users');
var adminRouter = require('./routes/admin/admin');
var productRouter = require('./routes/product/product');
var cartRouter = require('./routes/cart/cart');

var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var MongoStore = require('connect-mongo')(session);
require('dotenv').config();

var Category = require('./routes/models/Category');
var cartMiddleware = require('./routes/cart/utils/cartMiddleware');

//mongodb_uri is important to deploy
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true } )
        .then( () => {
          console.log('MONGODB CONNECTED')
        })
        .catch( err => console.log(`ERROR: ${err}`))


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(methodOverride("_method"));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ url: process.env.MONGODB_URI, autoReconnect: true}),
  cookie: {
    secure: false, 
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())

require('./lib/passport/passport')(passport);

app.use(function(req, res, next) {
  
  res.locals.user = req.user;

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = null
  res.locals.error = req.flash('error');
  
  next();
});
//almost create a global variable to use this object globally
app.use(cartMiddleware);

app.use(function(req, res, next) {

  Category.find({})
          .then( categories => {

            res.locals.categories = categories;
            next();

          })
          .catch( error => {
            return next(error);
          })

});


app.use(expressValidator({
  errorFormatter: function(param, message, value) {
      var namespace = param.split('.');
      var root = namespace.shift();
      var formParam = root;
      while (namespace.length) {
          formParam += '[' + namespace.shift() + ']';
      }
      return {
          param: formParam,
          message: message,
          value: value
      }
  }
}))


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

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

module.exports = app;
