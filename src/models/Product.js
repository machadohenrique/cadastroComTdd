let mongoose = require("mongoose");

let Product = new mongoose.Schema({
    nameProduct: String,
    price: String,
    description: String,
    productCode: String
})

module.exports = Product;