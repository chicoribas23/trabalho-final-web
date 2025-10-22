-- ==========================
-- BANCO DE DADOS: VIKINGS ACADEMIA
-- ==========================

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE planos (
    id_plano SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2),
    id_usuario INT REFERENCES usuarios(id_usuario)
);

CREATE TABLE fotos (
    id_foto SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    caminho_arquivo VARCHAR(255),
    data_upload DATE DEFAULT CURRENT_DATE,
    id_usuario INT REFERENCES usuarios(id_usuario)
);
