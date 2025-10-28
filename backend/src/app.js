const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API Biblioteca funcionando',
    environment: process.env.NODE_ENV 
  });
});

app.use('/api/libros', require('./routes/libros'));
app.use('/api/socios', require('./routes/socios'));
app.use('/api/prestamos', require('./routes/prestamos'));

// Error handling
app.use(errorHandler);

// Railway proporciona el puerto automáticamente
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;