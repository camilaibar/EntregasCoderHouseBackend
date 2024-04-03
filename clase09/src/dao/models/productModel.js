const mongoose = require("mongoose");
const mongoosePaginateV2 = require("mongoose-paginate-v2");

const collectionName = "products";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
  },
});

// Mongoose middlewares
productSchema.plugin(mongoosePaginateV2);

const productModel = mongoose.model(collectionName, productSchema);

module.exports = productModel;
