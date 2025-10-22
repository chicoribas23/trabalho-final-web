CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Criar tabela de planos
CREATE TABLE IF NOT EXISTS planos (
    id_plano SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2),
    id_usuario INT REFERENCES usuarios(id_usuario)
);

-- Criar tabela de fotos
CREATE TABLE IF NOT EXISTS fotos (
    id_foto SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    caminho_arquivo VARCHAR(255),
    data_upload DATE DEFAULT CURRENT_DATE,
    id_usuario INT REFERENCES usuarios(id_usuario)
);
