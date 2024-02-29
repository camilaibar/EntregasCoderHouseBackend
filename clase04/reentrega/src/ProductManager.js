const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "products.txt");

const getFileData = () => {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, "utf-8");
    if (data.trim() === "" || JSON.parse(data)?.length === 0) return false; // File exist but does not have an array inside

    // File exists with a non empty array inside
    data = JSON.parse(data);

    // update ID for new product generation
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
    fs.writeFileSync(filePath, JSON.stringify(ProductManager.productList)) ===
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

class ProductManager {
  static productList = getFileData().list || [];
  static id = getFileData().id || 0;
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = ProductManager.id++;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
    // Code must be different from others
    if (
      ProductManager.productList.filter((item) => item.code === code).length ===
      0
    ) {
      ProductManager.productList.push(
        new ProductManager(title, description, price, thumbnail, code, stock)
      );

      return updateFileData(); // true if product created, false if errored transaction
    }
    return false; // Product not created due to repeated code
  };

  getAllProducts = () => {
    return ProductManager.productList;
  };

  getProductById = (id) => {
    const result = ProductManager.productList.filter(
      (item) => item.id === Number(id)
    );
    return result.length !== 0 ? result : "Not found";
  };

  updateProductById = (item) => {
    const { id, ...updatedFields } = item;
    const result = ProductManager.productList.filter(
      (item) => item.id === Number(id)
    );
    if (result.length !== 0) {
      ProductManager.productList = ProductManager.productList.map((item) =>
        item.id === Number(id) ? { ...item, ...updatedFields } : item
      );
      return updateFileData(); // true if product updated, false if errored transaction
    }
    return false; // Product not updated due to non existing id
  };

  deleteAllProducts = () => {
    ProductManager.productList = [];
    ProductManager.id = 0;
    return deleteFileData(); // true if products deleted, false if errored transaction
  };

  deleteProductById = (id) => {
    const filteredProducts = ProductManager.productList.filter(
      (item) => item.id !== Number(id)
    );
    // Code must be different from others
    if (filteredProducts.length !== ProductManager.productList.length) {
      ProductManager.productList = filteredProducts;
      return updateFileData(); // true if product deleted, false if errored transaction
    }
    return false; // Product not deleted due to non existing id
  };
}

module.exports = ProductManager;
