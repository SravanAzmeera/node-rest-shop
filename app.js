const express = require('express');   //express packeage needed
const app = express();
const morgan = require('morgan')  //morgan is a middleware that logs HTTP requests and errors.a simply function to the request and response lifecycle methods.
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   //importing mongoose modules

 const productRoutes = require('./api/Routes/products');     //extensions
 const orderRoutes = require('./api/Routes/orders');

mongoose.connect(

    `mongodb+srv://sravanazmeera:sravan7093@cluster0.1d0yafy.mongodb.net/`

);
 
//.then(() => console.log('MongoDB Connected...'))
//.catch((err) => console.log(err))

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));   //body-parser middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
         "Origin, x-Requested-With, Content-Type, Accept, Authorization"
         );
         if (req.method === 'OPTIPONS') {
            res.header('Access-Control-Allow', 'PUT, POST, PATCH', 'DELETE, GET');
            return res.status(200).json({});
         }
         next();
});
 
// Routes which should handle requests
 app.use('/products', productRoutes);   //import productRoutes
app.use('/orders', orderRoutes);  //import orderRoutes

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.ststus || 500);
    res.json({
        error: {
            message: error.message
        }
    });
}); 

module.exports = app;