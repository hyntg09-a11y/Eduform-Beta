
import { db } from "../db.js";

export const getDashboard = async (req, res) => {
  try {
    const { idusuario } = req.params;

    // Gráfico
    const [grafico] = await db.query(`
      SELECT 
        c.nombrecarrera AS perfil,
        COUNT(*) AS cantidad
      FROM recomendacincarrera r
      JOIN evaluacionvocacional e ON r.idevaluacion = e.idevaluacion
      JOIN carrera c ON r.idcarrera = c.idcarrera
      WHERE e.idusuario = ?
      GROUP BY c.nombrecarrera
    `, [idusuario]);

    // Historial
    const [historial] = await db.query(`
      SELECT 
        e.fecharealizacion AS fecha,
        c.nombrecarrera AS perfil,
        r.justificacion AS recomendacion
      FROM recomendacincarrera r
      JOIN evaluacionvocacional e ON r.idevaluacion = e.idevaluacion
      JOIN carrera c ON r.idcarrera = c.idcarrera
      WHERE e.idusuario = ?
      ORDER BY e.fecharealizacion DESC
    `, [idusuario]);

    res.json({ grafico, historial });

  } catch (error) {
    console.error("Error cargando dashboard:", error);
    res.status(500).json({ error: "Error cargando dashboard" });
  }
};

