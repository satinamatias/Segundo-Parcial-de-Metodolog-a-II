const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Biblioteca funcionando ✅' });
});

app.use('/api/libros', require('./routes/libros'));
app.use('/api/socios', require('./routes/socios'));
app.use('/api/prestamos', require('./routes/prestamos')); // ← NUEVA LÍNEA

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;