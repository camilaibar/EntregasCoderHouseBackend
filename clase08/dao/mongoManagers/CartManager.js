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
    const result = await cartModel.findOne({ _id: cid });
    return result; // null if cart not found
  };

  updateCartById = async (cart) => {
    const { _id: cid, ...updatedFields } = cart;
    const result = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $set: updatedFields }
    );

    return result; // crash if cart not found
  };

  deleteAllCarts = async () => await cartModel.deleteMany();

  deleteCartById = async (cid) => {
    const result = await cartModel.deleteOne({ _id: cid });
    return result.deleteCount; // 0 if not found
  };

  addProductToCart = async (cid, pid, quantity) => {
    const cart = await this.getCartById(cid);
    if (cart === null) return null; // invalid cart id

    // Search for product on cart
    const productInCartIndex =
      cart.products.lenght === 0
        ? 0
        : cart.products.findIndex((item) => item.pid === Number(pid));

    // Product is not in cart, add new
    if (productInCartIndex < 0)
      cart.products.push({
        pid: Number(pid),
        quantity: quantity,
      });
    // Product already on cart, overide quantity
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

  updateProductByIdFromCart = (cid, item) => {
    const { pid, ...updatedFields } = item;
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    // Search for product on cart
    const productInCartIndex = CartManager.cartList[
      cartIndex
    ].products.findIndex((item) => item.pid === Number(pid));

    // Product is not in cart
    if (productInCartIndex < 0) return undefined;

    // Product exists, update it
    CartManager.cartList[cartIndex].products[productInCartIndex] = {
      pid: pid,
      ...updatedFields,
    };

    return updateFileData(); // true if product updated, false if errored transaction
  };

  deleteAllProductsFromCart = (cid) => {
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    CartManager.cartList = CartManager.cartList.filter(
      (cart) => cart.id !== Number(cid)
    );
    if (CartManager.cartList.length === 0) CartManager.id = 0;
    return deleteFileData(); // true if cart's products deleted, false if errored transaction
  };

  deleteProductByIdFromCart = (cid, pid) => {
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    // Eliminate product from cart
    let newList = CartManager.cartList.map((cart) => {
      if (cart.id === Number(cid))
        cart.products = cart.products.filter(
          (product) => product.pid !== Number(pid)
        );
      return cart;
    });

    // Eliminate carts without products
    newList = newList.filter((cart) => cart.products.lenght > 0);

    CartManager.cartList = newList;

    return updateFileData(); // true if product deleted, false if errored transaction
  };
}

module.exports = CartManager;
