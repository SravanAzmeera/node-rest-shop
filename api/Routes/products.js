const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

routes.get('/', (req, res, next) => {     // => function move to the next line to exicute
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
       const response = {
           count: docs.length,
           products: docs.map(doc => {
            return {
                name: doc.mame,
                price: doc.price,
                _id: doc._id,
                request: {
                   type: 'GET',
                   url: 'http://localhost:3000/products/' + doc._id
                }
                
            };
           })
       };
      // if (docs.length >= 0) {
        res.status(200).json(response);
   //   } else {
    //    res.status(404).json({
      //    message: 'No entries found'
     //   });
    //  }
      })
    .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
      });
    });
});

routes.post('/', (req, res, next) => {     //post method use post the data in database
   const product = new Product({
     _id: new mongoose.Types.ObjectId(),    // id automatical generate
     name: req.body.name,
     price: req.body.price
   });
   product
   .save()
    .then(result => {             // save provided mongoose modules...stored on database
    console.log(result);
    res.status(201).json({             //this data json data and send response string formate
      message: 'Created product successfully',
      CreatedProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url:  'http://localhost:3000/products/' + result._id
        }
      }
    });
   })
     .catch(err => console.log(err));   
});
   
routes.get('/:productId', (req, res, next) => {   //get method database to give the data to client
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
           product: doc,
           requestL: {
              type: 'GET',
              url: 'http://localhost:3000/products'
           }
        });
      } else {  
        res
        .status(404)
        .json({message: 'No valid entry found for provided ID'});
      }
    }) 
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
});
});

routes.patch('/:productId', (req, res, next) => {    //patch method use on update the products
  const id = req.params.productId;  
   const updateOps = {};
   for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
   }
  Product.updateMany({ _id: id }, { $set: updateOps })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'product updated',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});

routes.delete('/:productId', (req, res, next) => {    //delete method use on delete the products
    const id = req.params.productId;
  Product.remove({_id: id })
  .exec() 
  .then(result => {
    res.status(200).json({
      message: 'product deleted',
      request: {
        type: 'POST',
        url: 'http:/localhost:3000/products/',
        body: { name: 'String', price: 'Number' }
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

module.exports = routes;