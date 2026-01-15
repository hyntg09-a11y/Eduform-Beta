import { db } from "../db.js";

export const finalizarEvaluacion = async (req, res) => {
  try {
    const { idusuario, respuestas, recomendacion } = req.body;

    if (!idusuario || !recomendacion) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // 1. Crear evaluación
    const [result] = await db.execute(
      "INSERT INTO evaluacionvocacional (idusuario, fecharealizacion, puntajetotal) VALUES (?, NOW(), ?)",
      [idusuario, 0]
    );

    const idevaluacion = result.insertId;

    // 2. Guardar respuestas
    for (const idpregunta in respuestas) {
      await db.execute(
        "INSERT INTO respuestasevaluacion (idevaluacion, idpregunta, respuesta) VALUES (?, ?, ?)",
        [idevaluacion, idpregunta, respuestas[idpregunta]]
      );
    }

    // 3. Mapa de perfiles a carreras
    const mapaCarreras = {
      Tecnologia: "Ingeniería de Sistemas",
      Salud: "Enfermería",
      Educacion: "Licenciatura en Educación",
      Arte: "Diseño Gráfico",
      Negocios: "Administración de Empresas"
    };

    const nombreCarrera = mapaCarreras[recomendacion.perfil];

    if (!nombreCarrera) {
      return res.status(400).json({ error: "Perfil no reconocido" });
    }

    // 4. Buscar id de carrera
    const [carrera] = await db.execute(
      "SELECT idcarrera FROM carrera WHERE nombrecarrera = ? LIMIT 1",
      [nombreCarrera]
    );

    if (!carrera.length) {
      return res.status(400).json({ error: "Carrera no encontrada en base de datos" });
    }

    const idcarrera = carrera[0].idcarrera;

    // 5. Guardar recomendación
    await db.execute(
      `INSERT INTO recomendacincarrera 
       (idevaluacion, idcarrera, porcentajeafinidad, justificacion, fecharecomendacion) 
       VALUES (?, ?, ?, ?, NOW())`,
      [idevaluacion, idcarrera, 100, recomendacion.recomendacion]
    );

    res.json({ ok: true });

  } catch (error) {
    console.error("Error finalizando evaluación:", error);
    res.status(500).json({ error: "Error finalizando evaluación" });
  }
};
