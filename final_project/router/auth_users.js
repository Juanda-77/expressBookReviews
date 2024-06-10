const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();
const SECRET_KEY = 'your_secret_key'; // Se debe cambiar a una clave segura en un entorno de producción

let users = ["test"]; // Guardar usuarios registrados
let reviews = {}; // Guardar las reseñas de los libros

// Función para validar las credenciales de inicio de sesión
const authenticateUser = (username, password) => {
    // Aquí deberías tener lógica para autenticar al usuario
    // Por ahora, solo se verifica si el usuario existe en la lista de usuarios registrados
    return users.includes(username);
}

// Función para verificar si el usuario ha iniciado sesión
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

// Obtener una reseña de un libro
regd_users.get("/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (!reviews[isbn] || !reviews[isbn][username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Devolver la reseña del libro correspondiente
    return res.status(200).json({ review: reviews[isbn][username] });
});

// Iniciar sesión como usuario registrado y generar un JWT
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticateUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Si las credenciales son válidas, generar un token JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token });
});

// Agregar o modificar una reseña de un libro
regd_users.put("/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!reviews[isbn]) {
        reviews[isbn] = {};
    }

    // Agregar o actualizar la reseña del usuario
    reviews[isbn][username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
});

// Eliminar una reseña de un libro
regd_users.delete("/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (!reviews[isbn] || !reviews[isbn][username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Eliminar la reseña del usuario
    delete reviews[isbn][username];

    return res.status(200).json({ message: "Review deleted successfully" });
});

// Registro de nuevo usuario
regd_users.post("/register", (req, res) => {
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

module.exports.authenticated = regd_users;
module.exports.users = users;
module.exports.reviews = reviews;
