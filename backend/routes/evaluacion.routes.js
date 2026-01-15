import express from "express";
import { finalizarEvaluacion } from "../controllers/evaluacion.controller.js";

const router = express.Router();

router.post("/evaluacion/finalizar", finalizarEvaluacion);

export default router;
