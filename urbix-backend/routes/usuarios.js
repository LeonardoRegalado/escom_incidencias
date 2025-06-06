const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); 

// Crear usuario (signup con bcrypt)
router.post('/', async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(contraseña, saltRounds); // 🔐 Encriptamos

    db.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, rol],
      (err, result) => {
        if (err) {
          console.error('Error al crear usuario:', err);
          return res.status(500).json({ error: 'Error al crear el usuario' });
        }
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', id_usuario: result.insertId });
      }
    );
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.query('SELECT id, nombre, correo, rol, fecha_registro FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los usuarios' });
    res.json(results);
  });
});


// Obtener usuario por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nombre, correo, rol, fecha_registro FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});


// Actualizar usuario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contraseña, rol } = req.body;
  db.query('UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, rol = ? WHERE id = ?', [nombre, correo, contraseña, rol, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el usuario' });
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
});


// Eliminar usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el usuario' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
});

module.exports = router;
