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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  res.send(books[req.params.author]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  res.send(books[req.params.title]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
