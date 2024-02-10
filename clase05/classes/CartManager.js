const fs = require("fs");

class CartManager {
  static cid = 0;
  constructor(path = "./storage/cart.json", cid) {
    this.cid = cid ? cid : CartManager.cid++;
    this.products = [];
    this.path = path;
  }

  getCarts = () => {
    let storage = fs.existsSync(this.path)
      ? JSON.parse(fs.readFileSync(this.path))
      : [];
    return storage;
  };

  getCartByID = (cid) => {
    const storage = this.getCarts() || [];
    return storage.find((item) => item.cid === Number(cid));
  };

  addCart = () => {
    // TODO: Cada vez que corro esta funcion se me reinicia el servidor
    const storage = this.getCarts() || [];
    const newCart = new CartManager();
    storage.push({ cid: newCart.cid, products: newCart.products });

    fs.writeFileSync(this.path, JSON.stringify(storage));
    return newCart || null;
  };

  saveCart = (cart) => {
    const storage = this.getCarts();
    if (storage.find((item) => item.cid === Number(cid))) {
      storage = storage.map((storedCart) =>
        storedCart.cid === cart.cid ? cart : storedCart
      );
    } else {
      storage.push(cart);
    }
    fs.writeFileSync(this.path, JSON.stringify(storage));
    return;
  };

  addProductToCart = (pid, quantity, cid) => {
    let cart = this.getCartByID(Number(cid));
    if (!cart) {
      cart = this.addCart();
    }

    let productInCart = cart.products.find(
      (item) => Number(item.pid) === Number(pid)
    );
    if (productInCart) {
      this.updateProductQuantity(pid, quantity, cid);
    } else {
      // New product
      cart.products.push({ pid: pid, quantity: quantity });
      this.saveCart(cart);
    }
  };

  getProductsFromCart = (cid) => {
    const storage = this.getCarts() || [];
    const cart = storage.find((item) => item.cid === Number(cid));
    return cart.products || [];
  };

  updateProductQuantity = (pid, quantity, cid) => {
    let cart = this.getCartByID(Number(cid));
    // Update quantity
    cart.products = cart.products.map((item) => {
      if (Number(item.pid) === Number(pid)) {
        item.quantity = item.quantity + quantity;
      }
      return item;
    });

    this.saveCart(cart);
  };

  deleteProductsFromCart = (cid) => {};

  deleteProductByIdFromCart = (cid, pid) => {};

  deleteCart = (cid) => {
    const storage = this.getCarts();
    storage = storage.filter((storedCart) => storedCart.cid !== Number(cid));
    fs.writeFileSync(this.path, JSON.stringify(storage));
    return;
  };
}

module.exports = CartManager;
