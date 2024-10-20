const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Unable to register user" });
  }
});

const getBooks = () => {
  return new Promise((resolve, reject) => {
    if (books.length > 0) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks().then((books) => res.send(JSON.stringify(books,null,4))).catch((err) => res.send(err));
});

const getDetails = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("No books found");
    }
  })
};
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  getDetails(req.params.isbn).then((book) => res.send(book)).catch((err) => res.send(err));
});

const getAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (let isbn in books) {
      if (books[isbn].author.replace(/\s+/g, '').toLowerCase() === author) {
        matchingBooks.push(books[isbn]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for the given author");
    }
  })
};

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  getAuthor(req.params.author).then((book) => res.send(book)).catch((err) => res.send(err));
});

const getTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (let isbn in books) {
      if (books[isbn].title.replace(/\s+/g, '').toLowerCase() === title) {
        matchingBooks.push(books[isbn]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for the given title");
    }
  })
};

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  getTitle(req.params.title).then((book) => res.send(book)).catch((err) => res.send(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
