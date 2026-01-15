import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

/* =========================
   REGISTRO
========================= */
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // verificar si ya existe
    const [existe] = await db.execute(
      "SELECT idusuario FROM usuario WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error creando cuenta" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Usuario no existe" });
    }

    const usuario = rows[0];

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.idusuario, email: usuario.email },
      "CLAVE_SECRETA",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.idusuario,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: "Error iniciando sesión" });
  }
};

