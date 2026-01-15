const API = "http://localhost:3001/api";

export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const guardarEncuesta = (data) =>
  fetch(`${API}/encuestas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(data)
  });

export const obtenerDashboard = () =>
  fetch(`${API}/dashboard`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  }).then(r => r.json());
