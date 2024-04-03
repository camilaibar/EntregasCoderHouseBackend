const mongoose = require("mongoose");
const cartModel = require("../models/cartModel");

class CartManager {
  addCart = async (user = "") => {
    const result = await cartModel.create({
      user: user,
      products: [],
      status: true,
    });
    return result;
  };

  getAllCarts = async (limit = 0) => {
    const result = await cartModel.find().limit(limit);
    return result;
  };

  getCartById = async (cid) => {
    try {
      const result = await cartModel.find({ _id: cid });
      if (!result) {
        // Cart not found
        return null;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching cart:", error);
      return null; // null due to cart not found
    }
  };

  updateCartById = async (cart) => {
    const { _id: cid, ...updatedFields } = cart;
    let result;
    try {
      result = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $set: updatedFields }
      );
      if (!result) {
        // Cart not found
        return null;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error updating cart:", error);
      return null; // null due to cart not found
    }
  };

  deleteAllCarts = async () => await cartModel.deleteMany();

  deleteCartById = async (cid) => {
    const result = await cartModel.deleteOne({ _id: cid });
    return result.deleteCount; // 0 if not found
  };

  addProductToCart = async (cid, pid, quantity) => {
    const cart = await this.getCartById(cid);
    if (cart === null) return null; // invalid cart id

    // Convert the received pid to ObjectId to compare it to saved one
    const productId = new mongoose.Types.ObjectId(pid);

    // Search for product on cart
    const productInCartIndex =
      cart.products.length === 0
        ? -1
        : cart.products.findIndex((item) => item.pid.equals(productId));

    // Product is not in cart (result of findIndex is -1), add new
    if (productInCartIndex === -1)
      cart.products.push({
        pid: pid,
        quantity: quantity,
      });
    // Product already on cart, override quantity
    else cart.products[productInCartIndex].quantity = quantity;

    return await this.updateCartById(cart); // null if invalid transaction
  };

  getAllProductsFromCart = async (cid) => {
    let result = await this.getCartById(cid);
    return result.products || null;
  };

  getProductByIdFromCart = (cid, pid) => {
    const cart = this.getAllProductsFromCart(cid);
    if (cart === null) return null; // invalid cart id

    return cart.products.find((item) => item.pid === Number(pid));
  };

  updateProductByIdFromCart = async (cid, pid, productQuantity) => {
    // Get cart
    const cart = await this.getCartById(cid);
    if (!cart)
      cart.product = cart.products.map((item) => {
        if (item.pid === pid) item.quantity = productQuantity;
        return item;
      });

    //Update cart and return result
    return this.updateCartById(cart);
  };

  deleteAllProductsFromCart = async (cid) => {
    // Get cart
    const cart = await this.getCartById(cid);
    if (!cart) cart.products = [];

    //Update cart and return result
    return this.updateCartById(cart);
  };

  deleteProductByIdFromCart = async (cid, pid) => {
    // Get cart
    const cart = await this.getCartById(cid);
    if (!cart) cart.product = cart.products.filter((item) => item.pid !== pid);

    //Update cart and return result
    return this.updateCartById(cart);
  };
}

module.exports = CartManager;
