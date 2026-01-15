import { useState } from "react";
import "./eduform.css";

import logo from "./assets/logo.jpeg";
import imagen1 from "./assets/imagen1.jpeg";
import card1 from "./assets/card1.png";
import card2 from "./assets/card2.png";
import card3 from "./assets/card3.png";

import ModalTest from "./components/ModalTest";
import DashboardResultados from "./components/DashboardResultados";

export default function EduformApp() {

  // ========================= MODALES =========================
  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalTest, setModalTest] = useState(false);
  const [modalDashboard, setModalDashboard] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const refrescarDashboard = () => {
    setRefresh(prev => !prev);
  };

  // ========================= REGISTRO =========================
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ========================= LOGIN =========================
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ========================= UTIL =========================
  const cerrarTodo = () => {
    setModalLogin(false);
    setModalRegistro(false);
    setModalTest(false);
    setModalDashboard(false);
  };

  // ========================= REGISTRO BACKEND =========================
  const crearCuenta = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await res.json();

      if (data.ok) {
        alert("Cuenta creada correctamente");
        cerrarTodo();
      } else {
        alert(data.error || "Error creando cuenta");
      }

    } catch (error) {
      alert("Error conectando con el servidor");
    }
  };

  // ========================= LOGIN BACKEND =========================
  const iniciarSesion = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        alert("Sesión iniciada correctamente");
        cerrarTodo();
      } else {
        alert(data.error || "Credenciales incorrectas");
      }

    } catch (error) {
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div className="app-container">

      {/* ========================= HEADER ========================== */}
      <header className="header bg-neutral py-4 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto flex justify-end items-center">
          <img src={logo} alt="Eduform Logo" width="60" height="60" />
        </div>
      </header>

      {/* ========================= HERO ============================ */}
      <section className="bg-neutral py-16 px-6 lg:px-12 hero-section">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 left-text">
            <h1 className="font-headline font-bold text-4xl lg:text-5xl text-primary leading-tight">
              Descubre tu futuro con EDUFORM
            </h1>

            <p className="text-lg text-primary">
              Plataforma gratuita de orientación vocacional personalizada para estudiantes de Colombia.
            </p>

            <div className="submenu-container">
              <button className="btn">Menú Principal</button>

              <div className="submenu">
                <button onClick={() => setModalLogin(true)}>
                  Iniciar sesión
                </button>

                <button onClick={() => setModalTest(true)}>
                  Test vocacional
                </button>

                <button onClick={() => {
                  const usuario = localStorage.getItem("usuario");
                  if (!usuario) {
                    alert("Debes iniciar sesión para ver tus resultados");
                    return;
                  }
                  setModalDashboard(true);
                }}>
                  Ver resultados
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={imagen1}
              alt="student"
              width="325"
              height="200"
              className="w-150 object-contain"
            />
          </div>
        </div>
      </section>

      {/* ========================= FEATURES ======================== */}
      <section className="bg-tertiary py-16 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <article className="card-hover bg-primary rounded">
            <img src={card1} className="card-img" alt="Orientación vocacional" />
            <h3 className="font-headline text-xl text-primary-foreground">
              Orientación Vocacional
            </h3>
            <div className="card-description">
              Identifica tus intereses y habilidades.
            </div>
          </article>

          <article className="card-hover bg-primary rounded">
            <img src={card2} className="card-img" alt="Análisis socioeconómico" />
            <h3 className="font-headline text-xl text-primary-foreground">
              Análisis Socioeconómico
            </h3>
            <div className="card-description">
              Opciones académicas reales según tu contexto.
            </div>
          </article>

          <article className="card-hover bg-primary rounded">
            <img src={card3} className="card-img" alt="Opciones gratuitas" />
            <h3 className="font-headline text-xl text-primary-foreground">
              Opciones Gratuitas
            </h3>
            <div className="card-description">
              Universidades, becas y programas gratuitos.
            </div>
          </article>

        </div>
      </section>

      {/* ========================= FOOTER ========================== */}
      <footer className="footer">
        © {new Date().getFullYear()} EduForm — Todos los derechos reservados.
      </footer>

      {/* ========================= MODAL LOGIN ========================= */}
      {modalLogin && (
        <div className="modal-overlay active" onClick={cerrarTodo}>
          <div className="modal active" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <button className="close-btn" onClick={cerrarTodo}>×</button>

              <h2>Iniciar sesión</h2>
              
              <input
                type="email"
                placeholder="Correo electrónico"
                className="input"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="input"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />

              <button className="btn-azul" onClick={iniciarSesion}>
                Ingresar
              </button>

              <p style={{ marginTop: "12px" }}>
                ¿No tienes cuenta?
                <button
                  style={{ marginLeft: "8px", color: "#0066ff", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    setModalLogin(false);
                    setModalRegistro(true);
                  }}
                > 
                  Crear cuenta
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================= MODAL REGISTRO ========================= */}
      {modalRegistro && (
        <div className="modal-overlay active" onClick={cerrarTodo}>
          <div className="modal active" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <button className="close-btn" onClick={cerrarTodo}>×</button>

              <h2>Crear cuenta</h2>

              <input
                type="text"
                placeholder="Nombre completo"
                className="input"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button className="btn-azul" onClick={crearCuenta}>
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= MODAL TEST ========================= */}
      {modalTest && (
        <ModalTest
          onClose={() => setModalTest(false)}
          onFinish={() => {
            refrescarDashboard();
            setModalTest(false);
            setModalDashboard(true);
          }}
        />
      )}

      {/* ========================= MODAL DASHBOARD ========================= */}
      {modalDashboard && (
        <DashboardResultados
          onClose={() => setModalDashboard(false)}
          key={refresh}
        />
      )}

    </div>
  );
}

/* 
🔧 CAMBIOS REALIZADOS:

1. ❌ ANTES (INCORRECTO):
   - Overlay y modal como elementos hermanos separados
   - El overlay estaba fuera de los modales

2. ✅ AHORA (CORRECTO):
   - Overlay contiene al modal (estructura anidada)
   - stopPropagation en el div.modal para evitar que los clics lleguen al overlay
   - Cada modal (login y registro) tiene su propio overlay

ESTRUCTURA:
<div className="modal-overlay" onClick={cerrarTodo}>  ← Clic aquí cierra
  <div className="modal" onClick={(e) => e.stopPropagation()}>  ← Clic aquí NO cierra
    <div className="modal-content">
      ... formulario ...
    </div>
  </div>
</div>
*/
