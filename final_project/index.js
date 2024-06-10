const express = require('express');
const app = express();
const PORT = 5000;

const { authenticated } = require('./router/auth_users');
const books = require('./router/booksdb.js');

// Simulación de una base de datos de reseñas
let reviews = {};

app.use(express.json());

// Manejar la solicitud PUT para agregar o modificar reseñas
app.put("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.query.username; // Asumiendo que el nombre de usuario se pasa como un query parameter

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!reviews[isbn]) {
        reviews[isbn] = {};
    }

    // Agregar o actualizar la reseña
    reviews[isbn][username] = review;

    // Devolver el mensaje de éxito
    return res.status(200).json({ message: `Review for book with ISBN ${isbn} ${reviews[isbn][username] ? 'updated' : 'added'}` });
});

// Incluir las rutas relacionadas con la autenticación
app.use("/auth", authenticated);

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Missing authorization token" });
    }

    // Aquí puedes agregar la lógica para verificar y autenticar el token de acceso
    // Por ejemplo, puedes utilizar un módulo como jsonwebtoken para verificar la validez del token
    // y extraer la información del usuario

    try {
        // Aquí deberías validar el token y extraer la información del usuario
        // Si el token es válido, puedes adjuntar la información del usuario al objeto de solicitud (req)
        // para que esté disponible para las rutas protegidas

        // Ejemplo de validación de token utilizando jsonwebtoken
        // const decoded = jwt.verify(token, secretKey);
        // req.user = decoded;

        // Llama a next() para pasar al siguiente middleware o ruta
        next();
    } catch (error) {
        // Si hay algún error al verificar el token, devuelve un error de autorización
        console.error("Error validating token:", error);
        return res.status(401).json({ message: "Invalid authorization token" });
    }
});

// Ruta para manejar la solicitud GET para obtener los detalles del libro según el ISBN
app.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        // Aquí puedes agregar la lógica para obtener los detalles del libro según el ISBN
    } catch (error) {
        console.error('Error fetching book details:', error);
        return res.status(500).json({ message: 'Error fetching book details' });
    }
});

// Ruta para manejar la solicitud GET para obtener la lista de libros disponibles en la tienda
app.get('/', function (req, res) {
    // Enviar la lista de libros como JSON
    res.json(books);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
