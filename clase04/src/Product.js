class Product {
  static id = 1;
  constructor(title, description, price, thumbnail, code, stock, id) {
    this.id = id ? id : Product.id++;
    this.title = title; //nombre del producto
    this.description = description; //descripción del producto
    this.price = price; //precio
    this.thumbnail = thumbnail; // ruta de imagen
    this.code = code; //código identificador
    this.stock = stock; //número de piezas disponibles
  }
}

module.exports = Product;
