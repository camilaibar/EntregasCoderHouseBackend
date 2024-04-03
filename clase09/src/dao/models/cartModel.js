const mongoose = require("mongoose");
const mongoosePaginateV2 = require("mongoose-paginate-v2");

const collectionName = "carts";

const cartSchema = mongoose.Schema({
  user: { type: String },
  status: { type: Boolean, required: true },
  products: {
    type: [
      {
        pid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
    default: [],
  },
});

// Mongoose middlewares
cartSchema.plugin(mongoosePaginateV2);

cartSchema.pre("find", function () {
  this.populate("products.pid");
});

const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;
