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

  getAllProducts = async (
    limit = 10,
    page = 1,
    sort = undefined,
    query = undefined
  ) => {
    try {
      const filter = query ? { ...query } : {};
      const options = {
        page,
        limit,
        lean: true,
      };

      if (sort) options.sort = { price: sort === "desc" ? -1 : 1, _id: 1 };

      return await productModel.paginate(filter, options);
    } catch (error) {
      console.error("Error on getAllProducts: ", error.message);
      return undefined;
    }
  };

  getProductById = async (pid) => {
    try {
      const result = await productModel.findOne({ _id: pid });
      if (!result) {
        // Product not found
        return null;
      }
      return result;
    } catch (error) {
      // Handle any potential errors from MongoDB/Mongoose
      console.error("Error fetching product:", error);
      return null; // null due to product not found
    }
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
