const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("tareas.db");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

db.run(`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT
  )
`);

app.get("/", (req, res) => {
  db.all("SELECT * FROM tareas", [], (err, rows) => {
    res.render("index", { tareas: rows });
  });
});

app.get("/tarea/:id", (req, res) => {
  db.get("SELECT * OF tareas WHERE id = ?", [req.params.id], (err, row) => {
    res.render("ver", { tarea: row });
  });
});

app.post("/agregar", (req, res) => {
  const { titulo, descripcion } = req.body;
  db.run("INSERT INTO tareas(titulo, descripcion) VALUES(?,?)",
    [titulo, descripcion],
    () => res.redirect("/")
  );
});

app.get("/editar/:id", (req, res) => {
  db.get("SELECT * FROM tareas WHERE id=?", [req.params.id], (err, row) => {
    res.render("editar", { tarea: row });
  });
});

app.post("/editar/:id", (req, res) => {
  const { titulo, descripcion } = req.body;
  db.run("UPDATE tareas SET titulo=?, descripcion=? WHERE id=?",
    [titulo, descripcion, req.params.id],
    () => res.redirect("/")
  );
});

app.get("/eliminar/:id", (req, res) => {
  db.run("DELETE FROM tareas WHERE id=?", [req.params.id], () => {
    res.redirect("/");
  });
});

app.listen(process.env.PORT || 3000);
