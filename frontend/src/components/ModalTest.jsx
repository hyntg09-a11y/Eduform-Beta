import { useState, useEffect, useRef } from "react";
import { encuestaSocioeconomica, encuestaVocacional } from "./encuestas";
import { generarRecomendacion } from "./motorRecomendacion";

export default function ModalTest({ onClose, onFinish }) {
  const [step, setStep] = useState(1);
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState("");

  const preguntas = step === 1 ? encuestaSocioeconomica : encuestaVocacional;
  const preguntaActual = preguntas[index];

  const total = preguntas.length;
  const progreso = Math.round(((index + 1) / total) * 100);

  const contenedorRef = useRef(null);

  // Scroll automático al cambiar pregunta
  useEffect(() => {
    if (contenedorRef.current) {
      contenedorRef.current.scrollTop = 0;
    }
  }, [index, step]);

  const guardarRespuesta = (valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual.id]: valor
    }));
    setError("");
  };

  const siguiente = () => {
    if (!respuestas[preguntaActual.id]) {
      setError("Debes seleccionar una opción para continuar.");
      return;
    }

    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      if (step === 1) {
        setStep(2);
        setIndex(0);
      } else {
        enviarBackend();
      }
    }
  };

  const atras = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else if (step === 2) {
      setStep(1);
      setIndex(encuestaSocioeconomica.length - 1);
    }
  };

  const enviarBackend = async () => {
    const resultado = generarRecomendacion(respuestas);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.id) {
      alert("Debes iniciar sesión para guardar la evaluación");
      return;
    }

    const payload = {
      idusuario: usuario.id,   // ✅ aquí está la corrección
      respuestas,
      recomendacion: resultado
    };

    try {
      const res = await fetch("http://localhost:3001/api/evaluacion/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.ok) {
        alert(`Perfil recomendado: ${resultado.perfil}\n\n${resultado.recomendacion}`);
        if (onFinish) onFinish();
        onClose();
      } else {
        alert(data.error || "Error guardando la evaluación");
      }

    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };


  return (
    <div className="modal-overlay active">
      <div className="modal-test">

        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{step === 1 ? "Encuesta Socioeconómica" : "Test Vocacional"}</h2>

        {/* Barra de progreso */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progreso}%` }} />
        </div>

        <p className="progress-text">
          Pregunta {index + 1} de {total}
        </p>

        {/* CONTENEDOR CON SCROLL */}
        <div className="test-body" ref={contenedorRef}>

          <div className="question-card">
            <label className="question-title">{preguntaActual.pregunta}</label>

            <select
              value={respuestas[preguntaActual.id] || ""}
              onChange={(e) => guardarRespuesta(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              {preguntaActual.opciones.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            {error && <p className="error-text">{error}</p>}
          </div>

        </div>

        {/* BOTONES */}
        <div className="modal-buttons">
          <button className="btn-cerrar" onClick={atras} disabled={step === 1 && index === 0}>
            Atrás
          </button>

          <button className="btn-azul" onClick={siguiente}>
            {step === 2 && index === total - 1 ? "Finalizar test" : "Siguiente"}
          </button>
        </div>

      </div>
    </div>
  );
}
