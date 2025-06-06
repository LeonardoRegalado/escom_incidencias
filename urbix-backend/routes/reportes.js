const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Obtener todos los reportes
router.get('/', (req, res) => {
  db.query('SELECT * FROM reportes', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los reportes' });
    res.json(results);
  });
});

// Registrar un nuevo reporte con imagen (usando imagenes_reporte)
router.post('/', upload.single('foto'), (req, res) => {
  const { id_usuario, titulo, descripcion, ubicacion, latitud, longitud } = req.body;
  const imagen = req.file;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'Título y descripción son obligatorios' });
  }

  const sqlReporte = `
    INSERT INTO reportes (id_usuario, titulo, descripcion, ubicacion, latitud, longitud)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Paso 1: Insertar el reporte
  db.query(sqlReporte, [id_usuario || null, titulo, descripcion, ubicacion, latitud, longitud], (err, result) => {
    if (err) {
      console.error("Error al insertar el reporte:", err);
      return res.status(500).json({ error: 'Error al insertar el reporte' });
    }

    const id_reporte = result.insertId;

    // Paso 2: Si hay imagen, insertar en la tabla imagenes_reporte
    if (imagen) {
      const rutaImagen = `uploads/${imagen.filename}`;
      const sqlImagen = `
        INSERT INTO imagenes_reporte (id_reporte, url)
        VALUES (?, ?)
      `;
      db.query(sqlImagen, [id_reporte, rutaImagen], (err2) => {
        if (err2) {
          console.error("Error al guardar la imagen:", err2);
          return res.status(500).json({ error: 'Reporte creado, pero falló al guardar la imagen' });
        }
        return res.status(201).json({ mensaje: 'Reporte e imagen creados exitosamente', id_reporte });
      });
    } else {
      return res.status(201).json({ mensaje: 'Reporte creado sin imagen', id_reporte });
    }
  });
});


// Obtener reporte por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM reportes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el reporte' });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    res.json(results[0]);
  });
});


// Actualizar estado del reporte
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['pendiente', 'en proceso', 'resuelto'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  db.query('UPDATE reportes SET estado = ? WHERE id = ?', [estado, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el reporte' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    res.json({ mensaje: 'Estado del reporte actualizado correctamente' });
  });
});

module.exports = router;
