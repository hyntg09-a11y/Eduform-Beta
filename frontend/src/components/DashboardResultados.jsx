import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

export default function DashboardResultados({ onClose }) {
  const [grafico, setGrafico] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    
    if (!usuarioStr) {
      console.error("No hay usuario en localStorage");
      setError("No hay sesión iniciada");
      setLoading(false);
      return;
    }

    try {
      const usuario = JSON.parse(usuarioStr);
      console.log("👤 Usuario:", usuario);
      
      // ✅ CORRECCIÓN: Usar "id" en vez de "idusuario"
      const userId = usuario.id;  // ← CAMBIO AQUÍ
      
      if (!userId) {
        console.error("Usuario sin ID:", usuario);
        setError("Datos de usuario inválidos");
        setLoading(false);
        return;
      }

      console.log("🆔 Usando ID:", userId);

      fetch(`http://localhost:3001/api/dashboard/${userId}`)
        .then(res => {
          console.log("📡 Status:", res.status);
          if (!res.ok) {
            throw new Error(`Error del servidor: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("✅ Datos recibidos:", data);
          setGrafico(data.grafico || []);
          setHistorial(data.historial || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ Error:", err);
          setError(err.message);
          setGrafico([]);
          setHistorial([]);
          setLoading(false);
        });

    } catch (parseError) {
      console.error("Error parseando usuario:", parseError);
      setError("Datos de sesión corruptos");
      setLoading(false);
    }
  }, []);

  const COLORS = ["#004aad", "#ffc107", "#28a745", "#dc3545", "#6f42c1"];

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal active dashboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content dashboard-content">

          <button className="close-btn" onClick={onClose}>×</button>

          <h2 className="dashboard-title">Resultados Vocacionales</h2>

          {loading ? (
            <p className="dashboard-loading">Cargando estadísticas...</p>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "#dc3545", fontSize: "18px", marginBottom: "10px" }}>
                ⚠️ Error: {error}
              </p>
              <button 
                onClick={onClose}
                style={{
                  background: "#004aad",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Cerrar
              </button>
            </div>
          ) : grafico.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p className="dashboard-loading">
                No hay resultados registrados aún.
              </p>
              <p style={{ marginTop: "10px", color: "#666" }}>
                Completa el test vocacional para ver tus resultados aquí.
              </p>
            </div>
          ) : (
            <>
              {/* ===== Gráfico de barras ===== */}
              <div className="dashboard-card">
                <h3>Distribución de Perfiles</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={grafico}>
                    <XAxis dataKey="perfil" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#004aad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ===== Gráfico circular ===== */}
              <div className="dashboard-card">
                <h3>Proporción de Perfiles</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={grafico}
                      dataKey="cantidad"
                      nameKey="perfil"
                      outerRadius={100}
                      label
                    >
                      {grafico.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* ===== Historial ===== */}
              <div className="dashboard-card">
                <h3>Historial de Resultados</h3>

                {historial.length === 0 ? (
                  <p>No hay historial disponible</p>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Perfil</th>
                        <th>Recomendación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((item, index) => (
                        <tr key={index}>
                          <td>{new Date(item.fecha).toLocaleString()}</td>
                          <td>{item.recomendacion?.perfil || "N/A"}</td>
                          <td>{item.recomendacion?.recomendacion || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
