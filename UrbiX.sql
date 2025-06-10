-- Base de datos para UrbiX
CREATE DATABASE IF NOT EXISTS urbix;
USE urbix;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255),
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes
CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255),
    latitud DECIMAL(10,6),
    longitud DECIMAL(10,6),
    estado ENUM('pendiente', 'en proceso', 'resuelto') DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE imagenes_reporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reporte INT NOT NULL,
    url TEXT NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES reportes(id) ON DELETE CASCADE
);

-- Tabla de votos
CREATE TABLE votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reporte INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_reporte) REFERENCES reportes(id) ON DELETE CASCADE
);

-- Tabla de respuestas de administradores
CREATE TABLE respuestas_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reporte INT NOT NULL,
    id_admin INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES reportes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_admin) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de comentarios para tener interaccion Respuesta - Comentarios a las solicitudes 
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reporte INT NOT NULL,
    id_usuario INT NULL, -- puede ser anónimo
    comentario TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES reportes(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

select *from usuarios;	
select *from reportes;
select *from categorias;
SELECT * FROM reportes ORDER BY id DESC;
SELECT * FROM imagenes_reporte ORDER BY id DESC;


-- Tablas nuevas para poder agregar categorias e iconos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    icono VARCHAR(100) -- Puedes guardar el nombre del ícono o un código emoji
);


ALTER TABLE reportes ADD COLUMN id_categoria INT;
ALTER TABLE reportes ADD FOREIGN KEY (id_categoria) REFERENCES categorias(id);

INSERT INTO categorias (nombre, icono) VALUES
('Basura', '🗑️'),
('Fuga de agua', '🚰'),
('Luminaria', '💡'),
('Bache', '🕳️'),
('Ruido', '🔊'),
('Otro', '❓');

