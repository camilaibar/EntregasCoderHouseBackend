console.log('Primer log')

const user={
 name:"Camila",
 surname:"Ibar",
 books:[],
 pets:[]
}

function getFullName() = user.surName + ', ' + user.name;
function addPets(petName) = user.pets.push(petName);
function countPets() = user.pets.length();
function addBook(title, authorName) = user.books.push({name:title, author:authorName});
function getBookNames() = user.books;


addPets("Rocco")
addPets("Boris")

addBook("Book1", "author1")
addBook("Book2", "author2")
addBook("Book3", "author3")
console.log(getFullName() + " has " + countPets() + "pets (" + user.pets + ") and likes the following books: " + getBookNames())
