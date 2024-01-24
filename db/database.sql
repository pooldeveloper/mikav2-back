CREATE DATABASE IF NOT EXISTS mika_db;
use mika_db;

CREATE TABLE universidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

DESCRIBE universidades;

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    examen_id VARCHAR(255) NOT NULL,
    orden INT NOT NULL
);

DESCRIBE cursos;

CREATE TABLE temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universidad_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    orden INT NOT NULL
);

DESCRIBE temas;

CREATE TABLE preguntas (
	id INT AUTO_INCREMENT PRIMARY KEY,
    examen_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    pregunta_img VARCHAR(255) NOT NULL,
    solucion_img VARCHAR(255) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    orden INT NOT NULL,
    numero INT NOT NULL
);

DESCRIBE preguntas;

CREATE TABLE examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    examen_id VARCHAR(255) NOT NULL,
    instrucciones LONGTEXT NOT NULL,
    minutos int NOT NULL
);

DESCRIBE examenes;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

DESCRIBE usuarios;


