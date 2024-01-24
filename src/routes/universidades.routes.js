import { Router } from "express";
import {
    obtenerUniversidades, crearUniversidad, obtenerCursos, crearCursos,
    crearTemas, obtenerTemas, crearPreguntas, obtenerPreguntas, enviarRespuestas,
    crearExamen, obtenerExamen, obtenerExamenes, registrarUsuario
} from "../controllers/universidades.controllers.js";

const router = Router();

router.get("/universidades", obtenerUniversidades)
router.get("/cursos/:id", obtenerCursos)
router.get("/temas/:id/:curso", obtenerTemas)
router.get("/preguntas/:id", obtenerPreguntas)
router.get("/examen/:id", obtenerExamen)
router.get("/examenes/:id", obtenerExamenes)



router.post("/crear-universidad", crearUniversidad)
router.post("/crear-cursos", crearCursos)
router.post("/crear-temas", crearTemas)
router.post("/crear-preguntas", crearPreguntas)
router.post("/enviar-respuestas", enviarRespuestas)
router.post("/crear-examen", crearExamen)
router.post("/usuario", registrarUsuario)


export default router;