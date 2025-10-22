-- Inserindo dados de exemplo
INSERT INTO usuarios (nome, email, senha)
VALUES 
('Administrador', 'admin@vikings.com', '1234');

INSERT INTO planos (nome, descricao, preco, id_usuario)
VALUES
('Plano Estudante', 'Plano com desconto para estudantes IFNMG', 69.90, 1),
('Plano Trimestral', 'Treino por 3 meses com flexibilidade', 189.90, 1),
('Plano Familiar', 'Treine com sua família e economize', 249.90, 1);

INSERT INTO fotos (titulo, caminho_arquivo, id_usuario)
VALUES
('Foto 1', 'images/foto1.png', 1),
('Foto 2', 'images/foto2.png', 1),
('Foto 3', 'images/foto3.png', 1);
