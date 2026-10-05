-- ================================================
-- Sellf — Script completo para Supabase (PostgreSQL)
-- Cole no SQL Editor do Supabase e clique em Run
-- ================================================

-- ── Tabelas auxiliares (sem dependências) ────────

CREATE TABLE IF NOT EXISTS status_usuario (
  idstatus_usuario INT PRIMARY KEY,
  status_usuario VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS tipo_usuario (
  idtipo_usuario INT PRIMARY KEY,
  tipo_usuario VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS status_loja (
  idstatus_loja INT PRIMARY KEY,
  status_loja VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS status_anuncio (
  idstatus_anuncio INT PRIMARY KEY,
  status_anuncio VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS condicao_produto (
  id_condicao SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS localizacao (
  id_localizacao SERIAL PRIMARY KEY,
  cidade VARCHAR(100),
  estado VARCHAR(50),
  cep VARCHAR(45),
  bairro VARCHAR(100)
);

-- ── Usuário ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14),
  telefone VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  data_cadastro TIMESTAMP DEFAULT NOW(),
  idtipo_usuario INT NOT NULL REFERENCES tipo_usuario(idtipo_usuario),
  idstatus_usuario INT NOT NULL REFERENCES status_usuario(idstatus_usuario),
  id_localizacao INT NOT NULL REFERENCES localizacao(id_localizacao),
  senha_resetada SMALLINT DEFAULT 0
);

-- ── Loja ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS loja_anunciante (
  id_loja SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  id_usuario INT REFERENCES usuario(id_usuario),
  id_localizacao INT REFERENCES localizacao(id_localizacao),
  idstatus_loja INT NOT NULL REFERENCES status_loja(idstatus_loja)
);

-- ── Produto ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS produto (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo',
  id_loja INT REFERENCES loja_anunciante(id_loja),
  id_categoria INT REFERENCES categoria(id_categoria),
  id_condicao INT REFERENCES condicao_produto(id_condicao)
);

-- ── Imagem ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS imagem_produto (
  id_imagem SERIAL PRIMARY KEY,
  id_produto INT NOT NULL REFERENCES produto(id_produto),
  caminho_imagem VARCHAR(255) NOT NULL,
  imagem_principal SMALLINT DEFAULT 0
);

-- ── Anúncio ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS anuncio (
  id_anuncio SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  id_produto INT UNIQUE REFERENCES produto(id_produto),
  idstatus_anuncio INT NOT NULL REFERENCES status_anuncio(idstatus_anuncio)
);

-- ================================================
-- Dados das tabelas auxiliares
-- ================================================

INSERT INTO status_usuario VALUES (1,'ativo'),(2,'inativo')
ON CONFLICT (idstatus_usuario) DO NOTHING;

INSERT INTO tipo_usuario VALUES (1,'comprador'),(2,'vendedor'),(3,'administrador')
ON CONFLICT (idtipo_usuario) DO NOTHING;

INSERT INTO status_loja VALUES (1,'Ativa'),(2,'Inativa')
ON CONFLICT (idstatus_loja) DO NOTHING;

INSERT INTO status_anuncio VALUES (1,'Ativo'),(2,'Pausado'),(3,'Vendido')
ON CONFLICT (idstatus_anuncio) DO NOTHING;

INSERT INTO condicao_produto (id_condicao, nome) VALUES
  (1,'Novo'),(2,'Semi Novo'),(3,'Bom Estado'),(4,'Regular')
ON CONFLICT (id_condicao) DO NOTHING;

INSERT INTO categoria (id_categoria, nome) VALUES
  (1,'Eletrônicos'),(2,'Veículos'),(3,'Imóveis'),
  (4,'Moda e Vestuário'),(5,'Casa e Jardim'),(6,'Esportes e Lazer'),
  (7,'Brinquedos e Jogos'),(8,'Livros e Papelaria'),(9,'Música e Instrumentos'),
  (10,'Ferramentas e Construção'),(11,'Saúde e Beleza'),
  (12,'Animais de Estimação'),(13,'Outros')
ON CONFLICT (id_categoria) DO NOTHING;

-- ================================================
-- Dados de localização
-- ================================================

INSERT INTO localizacao (id_localizacao, cidade, estado, cep, bairro) VALUES

ON CONFLICT (id_localizacao) DO NOTHING;

-- ================================================
-- Dados de usuários
-- ================================================

INSERT INTO usuario (id_usuario, nome, cpf, telefone, email, senha, data_cadastro, idtipo_usuario, idstatus_usuario, id_localizacao, senha_resetada) VALUES
  
ON CONFLICT (id_usuario) DO NOTHING;

-- ================================================
-- Dados de lojas
-- ================================================

INSERT INTO loja_anunciante (id_loja, nome, id_usuario, id_localizacao, idstatus_loja) VALUES

ON CONFLICT (id_loja) DO NOTHING;

-- ================================================
-- Dados de produtos
-- ================================================

INSERT INTO produto (id_produto, nome, descricao, preco, status, id_loja, id_categoria, id_condicao) VALUES

ON CONFLICT (id_produto) DO NOTHING;

-- ================================================
-- Dados de imagens
-- ================================================

INSERT INTO imagem_produto (id_imagem, id_produto, caminho_imagem, imagem_principal) VALUES

ON CONFLICT (id_imagem) DO NOTHING;

-- ================================================
-- Dados de anúncios
-- ================================================

INSERT INTO anuncio (id_anuncio, titulo, descricao, id_produto, idstatus_anuncio) VALUES


ON CONFLICT (id_anuncio) DO NOTHING;

-- ================================================
-- Ajusta sequences para novos registros funcionarem
-- ================================================

SELECT setval('localizacao_id_localizacao_seq', (SELECT MAX(id_localizacao) FROM localizacao));
SELECT setval('usuario_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuario));
SELECT setval('loja_anunciante_id_loja_seq', (SELECT MAX(id_loja) FROM loja_anunciante));
SELECT setval('produto_id_produto_seq', (SELECT MAX(id_produto) FROM produto));
SELECT setval('imagem_produto_id_imagem_seq', (SELECT MAX(id_imagem) FROM imagem_produto));
SELECT setval('anuncio_id_anuncio_seq', (SELECT MAX(id_anuncio) FROM anuncio));
SELECT setval('categoria_id_categoria_seq', (SELECT MAX(id_categoria) FROM categoria));
SELECT setval('condicao_produto_id_condicao_seq', (SELECT MAX(id_condicao) FROM condicao_produto));