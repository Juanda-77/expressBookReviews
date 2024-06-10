const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const public_users = express.Router();

// Obtener una reseña de un libro
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Aquí deberías implementar la lógica para obtener la reseña del libro con el ISBN proporcionado
        // Puedes acceder a las reseñas almacenadas en el objeto "reviews" en el archivo auth_users.js
        // y devolver la reseña correspondiente
    } catch (error) {
        console.error('Error fetching book review:', error);
        return res.status(500).json({ message: 'Error fetching book review' });
    }
});


// Obtener la lista de libros disponibles en la tienda
public_users.get('/', async function (req, res) {
    try {
        const formattedBooks = formatBooks(books);
        const orderedBooks = JSON.stringify(formattedBooks, null, 2); // Ordenar y formatear el resultado
        return res.status(200).send(orderedBooks); // Devolver la lista de libros como JSON ordenado
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ message: 'Error fetching books' });
    }
});

// Obtener detalles del libro según el ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        const book = response.data;
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        return res.status(500).json({ message: 'Error fetching book details' });
    }
});

// Obtener detalles del libro por autor usando async-await y Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        const booksByAuthor = response.data.booksbyauthor;
        return res.status(200).json({ "booksbyauthor": booksByAuthor });
    } catch (error) {
        console.error('Error fetching books by author:', error);
        return res.status(500).json({ message: 'Error fetching books by author' });
    }
});

// Obtener detalles del libro por título usando async-await y Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        const book = response.data;
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book details by title:', error);
        return res.status(500).json({ message: 'Error fetching book details by title' });
    }
});

// Obtener reseñas de libros según el ISBN proporcionado
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const response = await axios.get(`http://localhost:5000/review/${isbn}`);
        const reviews = response.data;
        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching book reviews:', error);
        return res.status(500).json({ message: 'Error fetching book reviews' });
    }
});

// Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.includes(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Agregar el nuevo usuario a la lista de usuarios registrados
    users.push(username);
    return res.status(200).json({ message: "User registered successfully" });
});

// Función para formatear los libros antes de enviarlos como respuesta
function formatBooks(books) {
    const formattedBooks = Object.values(books).map((book, index) => {
        return {
            [index + 1]: {
                author: book.author,
                title: book.title,
                reviews: book.reviews
            }
        };
    });
    return formattedBooks;
}

module.exports.general = public_users;

