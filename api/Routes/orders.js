const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const product = require('../models/product')

//handle incoming GET requests to/orders
routes.get('/', (req, res, next) => {
      Order.find()
      .select('Product quantity _id')
      .exec()
      .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
              return {
               product: doc.product,
               quantity: doc.quantity,
               _id: doc._id,
              Request: {
                type: 'GET',
                 url: 'http://localhost:3000/orders/' + doc._id
              } 
             };        
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

routes.post('/', (req, res, next) => {
   product.findById(req.body.productId)
   .then(product => {
     if (!product)  {
      return res.status(404).json({
        message: "Product not found"
      });
     }
    const order = new Order({
      _id: mongoose.Types.objectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    return order.save()
  })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Order cteated',
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });
routes.get('/:orderId', (req, res, next) => {
    res.status(200).json({
      message:  'order details',
      orderId: req.params.orderId
    });
});

routes.delete('/', (req, res, next) => {
    res.status(201).json({
      message:  'order deleted',
      orderId: req.params.orderId
    });
});

module.exports = routes;