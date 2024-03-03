const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../storage/carts.txt");

const getFileData = () => {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, "utf-8");
    if (data.trim() === "" || JSON.parse(data)?.length === 0) return false; // File exist but does not have an array inside

    // File exists with a non empty array inside
    data = JSON.parse(data);

    // update ID for new cart generation
    let greaterID = data.reduce(
      (greaterID, current) => (current.id > greaterID.id ? current : greaterID),
      data[0]
    ).id;

    return { list: data, id: greaterID };
  }
  return false; // File does not exist or can not be read
};

const updateFileData = () => {
  return (
    fs.writeFileSync(filePath, JSON.stringify(CartManager.cartList)) ===
    undefined
  );
};

const deleteFileData = () => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false; // File does not exist or can not be read
};

class CartManager {
  static cartList = getFileData().list || [];
  static id = getFileData().id || 0;
  constructor(products) {
    this.id = CartManager.id++;
    this.products = products;
  }

  addCart = () => {
    // Code must be different from others
    const newItemIndex = CartManager.cartList.push(new CartManager([])) - 1;

    updateFileData();
    return CartManager.cartList[newItemIndex]; // return created cart
  };

  getAllCarts = () => {
    return CartManager.cartList;
  };

  getCartById = (cid) => {
    const result = CartManager.cartList.filter(
      (item) => item.id === Number(cid)
    );
    return result.length !== 0 ? result : undefined;
  };

  getCartIndex = (cid) =>
    CartManager.cartList.findIndex((item) => item.id === Number(cid));

  updateCartById = (cart) => {
    const { cid, ...updatedFields } = cart;
    const result = CartManager.cartList.filter(
      (item) => item.id === Number(cid)
    );
    if (result.length !== 0) {
      CartManager.cartList = CartManager.cartList.map((item) =>
        item.id === Number(cid) ? { ...item, ...updatedFields } : item
      );
      return updateFileData(); // true if cart updated, false if errored transaction
    }
    return false; // Cart not updated due to non existing id
  };

  deleteAllCarts = () => {
    CartManager.cartList = [];
    CartManager.id = 0;
    return deleteFileData(); // true if carts deleted, false if errored transaction
  };

  deleteCartById = (cid) => {
    const filteredProducts = CartManager.cartList.filter(
      (item) => item.id !== Number(cid)
    );
    // ID must be different from others
    if (filteredProducts.length !== CartManager.cartList.length) {
      CartManager.cartList = filteredProducts;
      return updateFileData(); // true if cart deleted, false if errored transaction
    }
    return false; // Cart not deleted due to non existing id
  };

  addProductToCart = (cid, pid, quantity) => {
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    // Search for product on cart
    const productInCartIndex = CartManager.cartList[
      cartIndex
    ].products.findIndex((item) => item.pid === Number(pid));

    // Product is not in cart, add new
    if (productInCartIndex < 0)
      CartManager.cartList[cartIndex].products.push({
        pid: Number(pid),
        quantity: quantity,
      });
    // Product already on cart, overide quantity
    else
      CartManager.cartList[cartIndex].products[productInCartIndex].quantity =
        quantity;

    return updateFileData(); // true if product created, false if errored transaction
  };

  getAllProductsFromCart = (cid) => {
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    // Search for product on cart
    return CartManager.cartList[cartIndex].products;
  };

  getProductByIdFromCart = (cid, pid) => {
    const cartIndex = this.getCartIndex(cid);

    // Cart does not exist
    if (cartIndex < 0) return undefined;

    // Search for product on cart
    const productInCartIndex = CartManager.cartList[
      cartIndex
    ].products.findIndex((item) => item.pid === Number(pid));

    // Product is not in cart
    if (productInCartIndex < 0) return undefined;

    // Product exists
    return CartManager.cartList[cartIndex].products[productInCartIndex];
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
