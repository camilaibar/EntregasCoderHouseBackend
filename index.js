console.log("Primer log");

const user = {
  name: "Camila",
  surname: "Ibar",
  books: [],
  pets: [],
};

function getFullName() {
  return user.surname + ", " + user.name;
}
function addPets(petName) {
  return user.pets.push(petName);
}
function countPets() {
  return user.pets.length;
}
function addBook(title, authorName) {
  user.books.push({ name: title, author: authorName });
}
function getBookNames() {
  return user.books.map((book) => book.name);
}

addPets("Rocco");
addPets("Boris");

addBook("Book1", "author1");
addBook("Book2", "author2");
addBook("Book3", "author3");

console.log(
  getFullName() +
    " has " +
    countPets() +
    " pets (" +
    user.pets +
    ") and likes the following books: " +
    getBookNames()
);
