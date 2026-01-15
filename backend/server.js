import dashboardRoutes from "./routes/dashboard.routes.js";
import evaluacionRoutes from "./routes/evaluacion.routes.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", evaluacionRoutes);


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
