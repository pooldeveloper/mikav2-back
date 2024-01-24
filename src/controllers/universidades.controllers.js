import { pool } from "../config/db.js"
import {uploadImage} from "../config/cloudinary.js"

export const obtenerUniversidades = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM universidades')
    res.send(rows)
}

export const crearUniversidad = async (req, res) => {
    const { nombre_id, nombre } = req.body

    const [rows] = await pool.query('INSERT INTO universidades (nombre_id, nombre) VALUES (?, ?)', [nombre_id, nombre])

    res.send({
        id: rows.insertId,
        nombre_id,
        nombre
    })
}

export const registrarUsuario = async (req, res) => {
    const { nombre } = req.body

    await pool.query('INSERT INTO usuarios (nombre) VALUES (?)', [nombre])

    res.send({ mensaje: 'Usuario registrado exitosamente' })
}

export const obtenerCursos = async (req, res) => {
    const { id } = req.params

    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE examen_id = ?', [id])

    res.send(rowsCursos)
}

export const crearCursos = async (req, res) => {

    const { examen_id, cursos } = req.body

    for (const curso of cursos) {
        const { nombre_id, nombre, orden } = curso

        await pool.query(
            'INSERT INTO cursos (nombre_id, nombre, examen_id, orden) VALUES (?, ?, ?, ?)',
            [nombre_id, nombre, examen_id, orden]
        );
    }

    res.send({ mensaje: 'Cursos creados exitosamente' })
}

export const crearTemas = async (req, res) => {

    const { universidad_id, curso_id, temas } = req.body

    for (const tema of temas) {
        const { nombre_id, nombre, orden } = tema

        await pool.query(
            'INSERT INTO temas (universidad_id, curso_id, nombre_id, nombre, orden) VALUES (?, ?, ?, ?, ?)',
            [universidad_id, curso_id, nombre_id, nombre, orden]
        );
    }

    res.send({ mensaje: 'Temas creados exitosamente' })
}

export const obtenerTemas = async (req, res) => {
    const { id, curso } = req.params

    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE nombre_id = ?', [curso])

    const [rowsTemas] = await pool.query('SELECT * FROM temas WHERE universidad_id = ? AND curso_id = ?', [id, curso])

    res.send({
        curso_id: curso,
        nombre: rowsCursos[0].nombre,
        temas: rowsTemas
    })
}

export const crearPreguntas = async (req, res) => {

    const { examen_id, curso_id, clave, orden, numero} = req.body

    const preguntaImg = await uploadImage(req.files.pregunta_img.tempFilePath)

    const solucionImg = await uploadImage(req.files.solucion_img.tempFilePath)

    console.log(preguntaImg)
    console.log(solucionImg)

    await pool.query(
        'INSERT INTO preguntas (examen_id, curso_id, pregunta_img, solucion_img, clave, orden, numero) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [examen_id, curso_id, preguntaImg.url, solucionImg.url, clave, orden, numero]
    );

    res.send({mensaje: "Pregunta creada exitosamente"})
}

const funcionObtenerPreguntas = async (id) => {
    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE examen_id = ?', [id])
    const [rowsPreguntas] = await pool.query('SELECT * FROM preguntas WHERE examen_id = ?', [id])

    // Ordenar cursos por su propiedad "orden"
    rowsCursos.sort((a, b) => a.orden - b.orden);

    // Ordenar preguntas por su propiedad "curso_id" y luego por "orden"
    rowsPreguntas.sort((a, b) => {
        if (a.curso_id === b.curso_id) {
            return a.orden - b.orden;
        }
        return rowsCursos.find((curso) => curso.nombre_id === a.curso_id).orden - rowsCursos.find((curso) => curso.nombre_id === b.curso_id).orden;
    });

    const preguntasFinal = [];

    // Iterar sobre los cursos
    for (const curso of rowsCursos) {
        const preguntasCurso = [];

        // Filtrar las preguntas relacionadas con el curso actual
        const preguntasFiltradas = rowsPreguntas.filter((pregunta) => pregunta.curso_id === curso.nombre_id);

        // Agregar las preguntas filtradas al array preguntasCurso
        for (const pregunta of preguntasFiltradas) {
            preguntasCurso.push(pregunta);
        }

        // Crear un objeto para el curso actual en arrayFinal
        const cursoObj = {
            "curso_id": curso.nombre_id,
            "nombre": curso.nombre,
            "preguntas": preguntasCurso
        };

        // Agregar el objeto del curso a arrayFinal
        preguntasFinal.push(cursoObj);
    }

    return preguntasFinal
}

export const obtenerPreguntas = async (req, res) => {
    const { id } = req.params

    const preguntas = await funcionObtenerPreguntas(id)

    res.send(preguntas)
}

export const enviarRespuestas = async (req, res) => {
    const { examen_id, respuestas } = req.body

    const preguntas = await funcionObtenerPreguntas(examen_id)

    // Función para comparar respuestas
    function compararRespuestas(preguntas, respuestas) {
        const estadisticas = {
            score: '',
            solucionario: []
        };

        let correctas = 0
        let nPreguntas = 0

        for (const curso of preguntas) {
            const cursoRespuestas = {
                curso_id: curso.curso_id,
                nombre: curso.nombre,
                preguntas: []
            };

            for (const pregunta of curso.preguntas) {
                nPreguntas++

                const respuestaCorrespondiente = respuestas.find(respuesta => respuesta.id === pregunta.id);

                const claveEnviada = respuestaCorrespondiente ? respuestaCorrespondiente.clave : null;
                const claveCorrecta = pregunta.clave;

                let esCorrecta = null; // Inicialmente establecida como null

                if (claveEnviada === null || claveEnviada === "") {
                    esCorrecta = null; // Respuesta en blanco
                } else if (claveEnviada === claveCorrecta) {
                    esCorrecta = true; // Respuesta correcta
                    correctas++
                } else {
                    esCorrecta = false; // Respuesta incorrecta
                }

                const preguntaRespuesta = {
                    id: pregunta.id,
                    pregunta_img: pregunta.pregunta_img,
                    solucion_img: pregunta.solucion_img,
                    orden: pregunta.orden,
                    numero: pregunta.numero,
                    clave_enviada: claveEnviada,
                    clave_correcta: claveCorrecta,
                    correcta: esCorrecta, // Asignar el valor calculado
                };

                cursoRespuestas.preguntas.push(preguntaRespuesta);
            }
            estadisticas.solucionario.push(cursoRespuestas);
        }

        estadisticas.score = `${correctas}/${nPreguntas}`

        return estadisticas;
    }

    // Llamar a la función y mostrar resultados
    const resultado = compararRespuestas(preguntas, respuestas);

    res.send(resultado);
}

export const crearExamen = async (req, res) => {
    const { nombre, examen_id, instrucciones, minutos } = req.body

    await pool.query('INSERT INTO examenes (nombre, examen_id, instrucciones, minutos) VALUES (?, ?, ?, ?)', [nombre, examen_id, instrucciones, minutos])

    res.send({ mensaje: 'Examen creado exitosamente' })
}

export const obtenerExamen = async (req, res) => {
    const { id } = req.params

    const [rowsExamen] = await pool.query('SELECT * FROM examenes WHERE examen_id = ?' , [id])

    res.send(rowsExamen[0])
}

export const obtenerExamenes = async (req, res) => {
    const { id } = req.params

    const [rowUniversidad] = await pool.query('SELECT * FROM universidades WHERE nombre_id = ?', [id])
    
    const [rowsExamenes] = await pool.query('SELECT * FROM examenes WHERE universidad_id = ?', [id])

    res.send({
        id,
        nombre: rowUniversidad[0].nombre,
        examenes: rowsExamenes
    })
}
