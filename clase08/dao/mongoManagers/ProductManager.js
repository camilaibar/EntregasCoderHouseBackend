const productModel = require("../models/productModel");

class ProductManager {
  addProduct = async (product) => {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = product;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    )
      return null; // Product not created due to invalid data;

    return await productModel.create({
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnail: thumbnail,
    }); // true if product created, false if errored transaction
  };

  getAllProducts = async (limit = 0) => await productModel.find().limit(limit);

  getProductById = async (pid) => {
    const result = await productModel.findOne({ _id: pid });
    return result; // null if cart not found
  };

  updateProductById = async (item) => {
    const { pid, ...updatedFields } = item;
    const result = await productModel.findOneAndUpdate(
      { _id: pid },
      { $set: updatedFields }
    );

    return result; // crash if cart not found
  };

  deleteAllProducts = async () => await productModel.deleteMany();

  deleteProductById = async (pid) => {
    const result = await cartModel.deleteOne({ _id: pid });
    return result.deleteCount; // 0 if not found
  };
}

module.exports = ProductManager;
