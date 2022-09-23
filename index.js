console.log("Primer log");

// Clase 01 - Principios de programación Backend
class User {
  static id = 0;
  constructor(name, surname, books, pets) {
    this.id = User.id++;
    this.name = name;
    this.surname = surname;
    this.books = books;
    this.pets = pets;
  }

  getFullName() {
    return this.surname + ", " + this.name;
  }
  addPets(petName) {
    return this.pets.push(petName);
  }
  countPets() {
    return this.pets.length;
  }
  addBook(title, authorName) {
    this.books.push({ name: title, author: authorName });
  }
  getBookNames() {
    return this.books.map((book) => book.name);
  }
}

const user01 = new User("Camila", "Ibar", [], []);
user01.addPets("Rocco");
user01.addPets("Boris");

user01.addBook("Book1", "author1");
user01.addBook("Book2", "author2");
user01.addBook("Book3", "author3");

console.log(
  user01.getFullName() +
    " has " +
    user01.countPets() +
    " pets (" +
    user01.pets +
    ") and likes the following books: " +
    user01.getBookNames()
);
