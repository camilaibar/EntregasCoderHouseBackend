const fs = require("fs");

class ProductManager {
  constructor(path = "./storage/products.json") {
    this.products = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path))
      : [];
    this.path = path;
  }

  addProduct = (product) => {
    let avoidDuplicate = this.products.find(
      (item) => item.code === product.code
    );

    if (!avoidDuplicate) {
      this.products.push(product);
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  };

  getProducts = () => this.products;

  getProductById = (pid) => {
    let item = this.products.find((item) => item.pid === pid);

    if (item) return item;
    return "Not found";
  };

  updateProduct = (product) => {
    const { pid, ...updateFields } = product;
    let itemIndex = this.products.findIndex((item) => item.pid === pid);
    if (itemIndex > -1) {
      // Takes the product and override the atributes sent by params
      this.products[itemIndex] = {
        ...this.products[itemIndex],
        ...updateFields,
      };
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  };

  deleteProducts = () => {
    this.products = [];
    fs.unlinkSync(this.path, JSON.stringify(this.products));
  };

  deleteProductById = (pid) => {
    this.products = this.products.filter((item) => item.pid !== pid);
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  };
}

module.exports = ProductManager;
