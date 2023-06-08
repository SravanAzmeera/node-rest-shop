const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,      //objectid is unique id 
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},     //ref is keyword
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);