export function generarRecomendacion(respuestas) {

  let puntajes = {
    Salud: 0,
    Tecnologia: 0,
    Educacion: 0,
    Arte: 0,
    Negocios: 0
  };

  // ===== Reglas vocacionales =====

  if (respuestas.area_interes === "Salud") puntajes.Salud += 3;
  if (respuestas.area_interes === "Tecnología") puntajes.Tecnologia += 3;
  if (respuestas.area_interes === "Educación") puntajes.Educacion += 3;
  if (respuestas.area_interes === "Arte") puntajes.Arte += 3;
  if (respuestas.area_interes === "Negocios") puntajes.Negocios += 3;

  if (respuestas.estilo === "Creativa") puntajes.Arte += 2;
  if (respuestas.estilo === "Analítica") puntajes.Tecnologia += 2;
  if (respuestas.estilo === "Social") puntajes.Educacion += 2;
  if (respuestas.estilo === "Práctica") puntajes.Salud += 2;

  if (respuestas.actividad === "Resolver problemas") puntajes.Tecnologia += 2;
  if (respuestas.actividad === "Ayudar personas") puntajes.Salud += 2;
  if (respuestas.actividad === "Crear cosas") puntajes.Arte += 2;
  if (respuestas.actividad === "Analizar datos") puntajes.Negocios += 2;

  if (respuestas.trabajo === "En equipo") puntajes.Educacion += 1;
  if (respuestas.trabajo === "Individual") puntajes.Tecnologia += 1;
  if (respuestas.trabajo === "Mixto") puntajes.Negocios += 1;

  // ===== Selección del perfil ganador =====

  let perfil = Object.keys(puntajes).reduce((a, b) =>
    puntajes[a] > puntajes[b] ? a : b
  );

  // ===== Recomendaciones por perfil =====

  const recomendaciones = {
    Salud: "Carreras en el área de la salud: Enfermería, Medicina, Psicología, Fisioterapia.",
    Tecnologia: "Carreras tecnológicas: Ingeniería de Sistemas, Desarrollo de Software, Ciberseguridad.",
    Educacion: "Carreras educativas: Licenciaturas, Pedagogía, Psicología educativa.",
    Arte: "Carreras creativas: Diseño gráfico, Artes visuales, Producción audiovisual.",
    Negocios: "Carreras empresariales: Administración, Contaduría, Economía, Marketing."
  };

  return {
    perfil,
    recomendacion: recomendaciones[perfil]
  };
}
