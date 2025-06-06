const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');  

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Rutas organizadas
const reportesRoutes = require('./routes/reportes');
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');

app.use('/reportes', reportesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/', loginRoutes);
app.use('/uploads', express.static('uploads'));


// Ruta base
app.get('/', (req, res) => {
  res.send('Bienvenido a UrbiX backend 🎉');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
