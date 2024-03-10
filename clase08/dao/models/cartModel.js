const mongoose = require("mongoose");

const collectionName = "carts";

const cartSchema = mongoose.Schema({
  user: { type: String },
  status: { type: Boolean, required: true },
  products: {
    type: Array,
    required: true,
    default: [{ pid: 1, quantity: 9 }],
  },
});

const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;
