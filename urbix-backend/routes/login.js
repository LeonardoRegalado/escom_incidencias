const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(sql, [correo], async (err, results) => {

    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const usuario = results[0];

    // Comparar contraseña enviada con la almacenada
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Aquí podrías generar un token JWT
    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  });
});

module.exports = router;
