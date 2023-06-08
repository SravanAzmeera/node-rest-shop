const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,      //objectid is unique id 
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('product', productSchema);