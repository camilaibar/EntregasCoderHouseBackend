/* Entrega clase 3 - Manejo de archivos en JavaScript & Administrador de paquetes NPM

Manejo de archivos en Javascript

Consigna
- Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
- La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
- Debe guardar objetos con el siguiente formato:
    - id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
    - title (nombre del producto)
    - description (descripción del producto)
    - price (precio)
    - thumbnail (ruta de imagen)
    - code (código identificador)
    - stock (número de piezas disponibles)
- Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
- Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
- Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
- Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
- Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.


*/
const fs = require("fs");

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

class ProductManager {
  constructor(path) {
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

  getProductById = (id) => {
    let item = this.products.find((item) => item.id === id);

    if (item) return item;
    return "Not found";
  };

  updateProduct = (product) => {
    const { id, ...updateFields } = product;
    let itemIndex = this.products.findIndex((item) => item.id === id);
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

  deleteProductById = (id) => {
    this.products = this.products.filter((item) => item.id !== id);
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  };
}

const productManager = new ProductManager("./products.txt");

// Create items from scratch
/*productManager.addProduct(
  new Product("Producto 001", "Description Producto 001", 10, "", "00001", 100)
);
productManager.addProduct(
  new Product("Producto 002", "Description Producto 002", 10, "", "00002", 100)
);
productManager.addProduct(
  new Product("Producto 003", "Description Producto 003", 10, "", "00003", 100)
);*/

// Tests
console.log(
  "This are my products:",
  JSON.stringify(productManager.getProducts())
);
console.log(
  "Get first product:",
  JSON.stringify(productManager.getProductById(1))
);
console.log(
  "Get second product:",
  JSON.stringify(productManager.getProductById(2))
);
console.log(
  "Get third product:",
  JSON.stringify(productManager.getProductById(3))
);

// Delete file
//productManager.deleteProducts();
