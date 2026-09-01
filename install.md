# Guia Completo — Sellf

## Pré-requisitos

Antes de começar, instale as seguintes ferramentas:

| Ferramenta | Link | Versão recomendada |
|------------|------|--------------------|
| Node.js | https://nodejs.org | 18 ou superior |
| MySQL Server | https://dev.mysql.com/downloads/mysql/ | 8.x |
| MySQL Workbench | https://dev.mysql.com/downloads/workbench/ | Qualquer versão recente |
| Git | https://git-scm.com | Qualquer versão recente |

---

## Passo 1 — Clonar o repositório

Abra o terminal e rode:

```bash
git clone https://github.com/seu-usuario/sellf.git
cd sellf
```

---

## Passo 2 — Configurar o banco de dados

### 2.1 Abra o MySQL Workbench e conecte ao servidor local

### 2.2 Importe o banco de dados

1. Vá em **Server → Data Import**
2. Selecione **Import from Self-Contained File**
3. Clique nos `...` e selecione o arquivo `sellf_backup.sql` fornecido pelo projeto
4. Em **Default Target Schema**, clique em **New** e crie com o nome `bancodedadossellf`
5. Clique em **Start Import**
6. Aguarde a mensagem de sucesso

### 2.3 Verifique a importação

```sql
USE bancodedadossellf;
SHOW TABLES;
```

Deve aparecer as tabelas: `usuario`, `produto`, `anuncio`, `localizacao`, `loja_anunciante`, entre outras.

---

## Passo 3 — Configurar o backend

### 3.1 Acesse a pasta do backend

```bash
cd backend
```

### 3.2 Instale as dependências

```bash
npm install
```

### 3.3 Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com suas informações:

```env
# ─── Banco de Dados ───────────────────────────
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_DO_MYSQL_AQUI
DB_NAME=bancodedadossellf

# ─── JWT ──────────────────────────────────────
# Gere uma chave segura rodando no terminal:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=SUA_CHAVE_SECRETA_AQUI

# ─── Servidor ─────────────────────────────────
PORT=3000
```

Para gerar uma chave JWT segura, rode no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Cole o resultado no campo `JWT_SECRET`.

### 3.4 Crie a pasta de uploads

```bash
mkdir uploads
```

---

## Passo 4 — Configurar o frontend

### 4.1 Acesse a pasta do frontend

```bash
cd ../projeto-sellf
```

### 4.2 Instale as dependências

```bash
npm install
```

---

## Passo 5 — Rodar o projeto

Abra **dois terminais separados**:

### Terminal 1 — Backend

```bash
cd backend
node server.js
```

Saída esperada:
```
Conectado ao MySQL com sucesso!
Servidor rodando na porta 3000
```

### Terminal 2 — Frontend

```bash
cd projeto-sellf
npm run dev
```

Saída esperada:
```
VITE v5.x ready in Xms
➜ Local: http://localhost:5173
```

---

## Passo 6 — Acessar o sistema

Abra o navegador e acesse:

```
http://localhost:5173
```

---

## Estrutura do projeto

```
sellf/
├── backend/
│   ├── uploads/          ← imagens dos produtos (criada no Passo 3.4)
│   ├── .env              ← variáveis de ambiente (criada no Passo 3.3)
│   ├── .env.example      ← modelo do .env
│   ├── package.json
│   └── server.js
└── projeto-sellf/
    └── src/
        ├── components/
        ├── pages/
        └── routes/
```

---

## Conta de administrador

Para acessar o painel administrativo, crie um usuário administrador direto no banco.

**1. Gere o hash da senha no terminal:**

```bash
node -e "const b = require('bcrypt'); b.hash('admin123', 10).then(h => console.log(h))"
```

**2. Insira no banco (substitua o hash gerado):**

```sql
INSERT INTO usuario (nome, cpf, email, senha, data_cadastro, idtipo_usuario, idstatus_usuario, id_localizacao)
VALUES ('Admin', '00000000000', 'admin@sellf.com', 'HASH_GERADO_AQUI', NOW(), 3, 1, 1);
```

**3. Acesse com:**
- E-mail: `admin@sellf.com`
- Senha: `admin123`

---

## Dependências do projeto

### Backend (`backend/package.json`)

| Pacote | Finalidade |
|--------|-----------|
| express | Framework web para criação da API REST |
| mysql2 | Conexão e queries com o banco MySQL |
| bcrypt | Criptografia de senhas com hash |
| jsonwebtoken | Geração e verificação de tokens JWT |
| cookie-parser | Leitura e escrita de cookies no servidor |
| multer | Upload de imagens dos produtos |
| dotenv | Carregamento de variáveis de ambiente |
| cors | Permite requisições do frontend para o backend |

Instalar tudo de uma vez:

```bash
cd backend
npm install express mysql2 bcrypt jsonwebtoken cookie-parser multer dotenv cors
```

### Frontend (`projeto-sellf/package.json`)

| Pacote | Finalidade |
|--------|-----------|
| react | Biblioteca para construção de interfaces |
| react-dom | Renderização do React no navegador |
| react-router-dom | Navegação entre páginas (SPA) |
| axios | Requisições HTTP para o backend |
| vite | Servidor de desenvolvimento e build |

Instalar tudo de uma vez:

```bash
cd projeto-sellf
npm install
```

---

## Solução de problemas

| Erro | Causa | Solução |
|------|-------|---------|
| `Cannot find module` | Dependências não instaladas | Rode `npm install` na pasta correta |
| `Erro ao conectar no MySQL` | Senha incorreta no `.env` | Verifique `DB_PASSWORD` no `.env` |
| `ER_BAD_DB_ERROR` | Banco não importado | Repita o Passo 2 |
| `EADDRINUSE: port 3000` | Porta 3000 em uso | Feche outros programas ou mude `PORT` no `.env` |
| `Cannot GET /` | Frontend não está rodando | Rode `npm run dev` no terminal do frontend |
| Imagens não aparecem | Pasta `uploads/` não existe | Crie com `mkdir backend/uploads` |
| `JWT_SECRET inválido` | Chave não configurada | Gere e cole a chave no `.env` |
| `ER_TRUNCATED_WRONG_VALUE` | Encoding do banco incorreto | Rode o SQL abaixo no Workbench |

**Corrigir encoding do banco (acentos não funcionam):**

```sql
ALTER DATABASE bancodedadossellf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE usuario CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE produto CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE localizacao CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE anuncio CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Ordem de inicialização

Sempre inicie na seguinte ordem para evitar erros de conexão:

```
1. MySQL Server — deve estar em execução
       ↓
2. Backend (node server.js) — porta 3000
       ↓
3. Frontend (npm run dev) — porta 5173
```