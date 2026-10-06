# Guia de Instalação — Sellf

## Pré-requisitos

Antes de começar, instale as seguintes ferramentas:

| Ferramenta | Link | Versão recomendada |
|------------|------|--------------------|
| Node.js | https://nodejs.org | 18 ou superior |
| Git | https://git-scm.com | Qualquer versão recente |

> O projeto usa **Supabase** como banco de dados em nuvem — não é necessário instalar MySQL localmente.

---

## Passo 1 — Clonar o repositório

Abra o terminal e rode:

```bash
git clone https://github.com/seu-usuario/sellf.git
cd sellf
```

---

## Passo 2 — Configurar o Supabase

### 2.1 Criar conta e projeto

1. Acesse https://supabase.com e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name:** sellf
   - **Database Password:** crie uma senha forte e anote
   - **Region:** South America (São Paulo)
4. Clique em **Create new project** e aguarde ~2 minutos

### 2.2 Importar o banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Abra o arquivo `sellf_supabase.sql` fornecido com o projeto
4. Cole o conteúdo completo no editor
5. Clique em **Run**
6. Aguarde a mensagem de sucesso

### 2.3 Desativar o Row Level Security

Ainda no **SQL Editor**, rode o seguinte comando:

```sql
ALTER TABLE localizacao DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE loja_anunciante DISABLE ROW LEVEL SECURITY;
ALTER TABLE produto DISABLE ROW LEVEL SECURITY;
ALTER TABLE imagem_produto DISABLE ROW LEVEL SECURITY;
ALTER TABLE anuncio DISABLE ROW LEVEL SECURITY;
ALTER TABLE categoria DISABLE ROW LEVEL SECURITY;
ALTER TABLE condicao_produto DISABLE ROW LEVEL SECURITY;
ALTER TABLE status_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE status_loja DISABLE ROW LEVEL SECURITY;
ALTER TABLE status_anuncio DISABLE ROW LEVEL SECURITY;
ALTER TABLE tipo_usuario DISABLE ROW LEVEL SECURITY;
```

### 2.4 Criar o bucket de imagens

1. Vá em **Storage** no menu lateral
2. Clique em **New bucket**
3. Preencha:
   - **Name:** `produtos`
   - Marque **Public bucket** ✅
4. Clique em **Save**

### 2.5 Pegar as credenciais

Vá em **Settings → API** e copie:

- **Project URL** → valor de `SUPABASE_URL`
- **service_role** (em Project API keys) → valor de `SUPABASE_SECRET_KEY`

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
# ─── Supabase ─────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SECRET_KEY=SUA_SERVICE_ROLE_KEY_AQUI

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

Para acessar o painel administrativo, crie um usuário administrador diretamente no Supabase.

**1. Gere o hash da senha no terminal:**

```bash
node -e "const b = require('bcrypt'); b.hash('admin123', 10).then(h => console.log(h))"
```

**2. No Supabase, vá em SQL Editor e rode (substitua o hash gerado):**

```sql
-- Primeiro cria a localização
INSERT INTO localizacao (cidade, estado) VALUES ('Campo Mourão', 'PR');

-- Depois cria o admin (use o id_localizacao gerado acima)
INSERT INTO usuario (nome, cpf, email, senha, idtipo_usuario, idstatus_usuario, id_localizacao, senha_resetada)
VALUES ('Admin', '00000000000', 'admin@sellf.com', 'HASH_GERADO_AQUI', 3, 1, 1, false);
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
| @supabase/supabase-js | Conexão com o banco Supabase |
| bcrypt | Criptografia de senhas com hash |
| jsonwebtoken | Geração e verificação de tokens JWT |
| cookie-parser | Leitura e escrita de cookies no servidor |
| multer | Recebimento de imagens no servidor |
| dotenv | Carregamento de variáveis de ambiente |
| cors | Permite requisições do frontend para o backend |

Instalar tudo de uma vez:

```bash
cd backend
npm install express @supabase/supabase-js bcrypt jsonwebtoken cookie-parser multer dotenv cors
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
| `new row violates row-level security` | RLS ativado no Supabase | Rode o SQL do Passo 2.3 |
| `Invalid API key` | Chave do Supabase incorreta | Verifique `SUPABASE_SECRET_KEY` no `.env` — use a **service_role**, não a anon key |
| `EADDRINUSE: port 3000` | Porta 3000 em uso | Feche outros programas ou mude `PORT` no `.env` |
| `Cannot GET /` | Frontend não está rodando | Rode `npm run dev` no terminal do frontend |
| Imagens não aparecem | Bucket não criado ou não é público | Repita o Passo 2.4 |
| `JWT_SECRET inválido` | Chave não configurada | Gere e cole a chave no `.env` |

---

## Ordem de inicialização

Sempre inicie na seguinte ordem para evitar erros de conexão:

```
1. Backend (node server.js) — porta 3000
       ↓
2. Frontend (npm run dev) — porta 5173
```

> O banco de dados fica no Supabase em nuvem — não precisa iniciar nada localmente para o banco.