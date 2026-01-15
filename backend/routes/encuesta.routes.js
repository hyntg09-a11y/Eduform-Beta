import express from "express";
import { guardarEncuesta } from "../controllers/encuesta.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/encuesta", guardarEncuesta);

export default router;