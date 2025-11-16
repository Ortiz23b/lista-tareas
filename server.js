const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Configurar motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));

// Base de datos SQLite
const db = new sqlite3.Database('tareas.db');

// Crear tabla si no existe
db.run('CREATE TABLE IF NOT EXISTS tareas (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT)');

// Ruta principal
app.get('/', (req, res) => {
  db.all('SELECT * FROM tareas', (err, filas) => {
    res.render('index', { tareas: filas });
  });
});

// Agregar tarea
app.post('/agregar', (req, res) => {
  const descripcion = req.body.descripcion;
  db.run('INSERT INTO tareas (descripcion) VALUES (?)', descripcion, () => {
    res.redirect('/');
  });
});

// Borrar tarea
app.post('/borrar/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tareas WHERE id = ?', id, () => {
    res.redirect('/');
  });
});

// USAR EL PUERTO DE RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
