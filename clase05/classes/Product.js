class Product {
  static pid = 1;
  constructor(
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status,
    pid
  ) {
    this.pid = pid ? pid : Product.pid++;
    this.title = title; //nombre del producto
    this.description = description; //descripción del producto
    this.price = price; //precio
    this.thumbnails = thumbnails; // ruta de imagen
    this.code = code; // código identificador
    this.stock = stock; // número de piezas disponibles
    this.category = category; // categoria de producto
    this.status = status; // estado del producto
  }
}

module.exports = Product;
