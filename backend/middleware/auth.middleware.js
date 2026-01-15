import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ error: "Sin token" });

  const token = auth.split(" ")[1];

  jwt.verify(token, "CLAVE_SECRETA", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    req.usuario = user;
    next();
  });
};

