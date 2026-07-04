require('dotenv').config()

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const path = require("path")

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4"
})

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err.message)
  } else {
    console.log("Conectado ao MySQL com sucesso!")
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const nome = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, nome + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// ─── MIDDLEWARES ─────────────────────────────
function verificarToken(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = dados
    next()
  } catch {
    return res.status(401).json({ error: "Sessão expirada." })
  }
}

function verificarAdmin(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    if (dados.tipo !== 3) return res.status(403).json({ error: "Acesso negado." })
    req.usuario = dados
    next()
  } catch {
    return res.status(401).json({ error: "Sessão expirada." })
  }
}

function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, "")
  if (limpo.length !== 11) return false
  if (/^(\d)\1+$/.test(limpo)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(limpo[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(limpo[10])
}

// ─── CADASTRO ───────────────────────────────
app.post("/usuarios", async (req, res) => {
  console.log("=== REQUISIÇÃO RECEBIDA ===")
  console.log("Body:", req.body)

  const { nome, email, senha, cidade, estado, cpf, idtipo_usuario } = req.body

  if (!nome || !email || !senha || !cidade || !estado || !cpf || !idtipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }
  if (![1, 2].includes(Number(idtipo_usuario))) {
    return res.status(400).json({ error: "Tipo de usuário inválido." })
  }
  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." })
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10)

    db.query(
      `INSERT INTO localizacao (cidade, estado, cep) VALUES (?, ?, ?)`,
      [cidade, estado, ""],
      (err, resultLocal) => {
        if (err) {
          console.error("ERRO NA LOCALIZACAO:", err.message)
          return res.status(500).json({ error: "Erro ao salvar localização." })
        }

        const id_localizacao = resultLocal.insertId

        db.query(
          `INSERT INTO usuario 
            (nome, cpf, email, senha, data_cadastro, idtipo_usuario, idstatus_usuario, id_localizacao)
           VALUES (?, ?, ?, ?, NOW(), ?, 1, ?)`,
          [nome, cpf, email, senhaHash, Number(idtipo_usuario), id_localizacao],
          (err, resultUser) => {
            if (err) {
              console.error("ERRO NO USUARIO:", err.message)
              return res.status(500).json({ error: "Erro ao cadastrar usuário." })
            }
            console.log("Usuário criado, id:", resultUser.insertId)
            res.status(201).json({ message: "Usuário cadastrado com sucesso!" })
          }
        )
      }
    )
  } catch (err) {
    console.error("ERRO NO BCRYPT:", err.message)
    return res.status(500).json({ error: "Erro ao processar senha." })
  }
})

// ─── LOGIN ───────────────────────────────────
app.post("/login", async (req, res) => {
  console.log("=== LOGIN RECEBIDO ===")
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." })
  }

  db.query("SELECT * FROM usuario WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("ERRO NO LOGIN:", err.message)
      return res.status(500).json({ error: "Erro interno no servidor." })
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." })
    }

    const usuario = results[0]

    // ← verifica o flag ANTES de checar a senha
    if (usuario.senha_resetada === 1) {
      const token = jwt.sign(
        { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // token curto pois é só para trocar a senha
      )

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 // 1 hora
      })

      return res.status(200).json({
        senha_resetada: true,
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.idtipo_usuario
        }
      })
    }

    // senha normal — só verifica se senha_resetada = 0
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." })
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Login realizado com sucesso!",
      senha_resetada: false,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.idtipo_usuario
      }
    })
  })
})

// ─── SESSÃO ──────────────────────────────────
app.get("/sessao", (req, res) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({
      usuario: {
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        tipo: dados.tipo
      }
    })
  } catch (err) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." })
  }
})

// ─── LOGOUT ──────────────────────────────────
app.post("/logout", (req, res) => {
  res.clearCookie("token")
  res.status(200).json({ message: "Logout realizado com sucesso." })
})

// ─── NOVA SENHA (usuário após reset) ─────────
app.put("/usuarios/:id/nova-senha", async (req, res) => {
  const { id } = req.params
  const { novaSenha } = req.body

  if (!novaSenha || novaSenha.length < 6) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." })
  }

  try {
    const senhaHash = await bcrypt.hash(novaSenha, 10)

    db.query(
      "UPDATE usuario SET senha = ?, senha_resetada = 0 WHERE id_usuario = ?",
      [senhaHash, id],
      (err) => {
        if (err) return res.status(500).json({ error: "Erro ao salvar nova senha." })
        res.json({ message: "Senha alterada com sucesso!" })
      }
    )
  } catch (err) {
    return res.status(500).json({ error: "Erro ao processar senha." })
  }
})

// ─── LOJAS ───────────────────────────────────
app.post("/lojas", verificarToken, (req, res) => {
  const { nome, cidade, estado, cep, bairro } = req.body
  const idUsuario = req.usuario.id

  if (!nome || !cidade || !estado) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." })
  }

  db.query(
    `SELECT idtipo_usuario FROM usuario WHERE id_usuario = ?`,
    [idUsuario],
    (err, usuarioResult) => {
      if (err) return res.status(500).json({ error: "Erro ao verificar usuário." })
      if (usuarioResult.length === 0) return res.status(404).json({ error: "Usuário não encontrado." })
      if (usuarioResult[0].idtipo_usuario !== 2) return res.status(403).json({ error: "Somente vendedores podem criar lojas." })

      db.query(
        `SELECT id_loja FROM loja_anunciante WHERE id_usuario = ?`,
        [idUsuario],
        (err, lojaResult) => {
          if (err) return res.status(500).json({ error: "Erro ao verificar loja." })
          if (lojaResult.length > 0) return res.status(400).json({ error: "Você já possui uma loja." })

          db.query(
            `INSERT INTO localizacao (cidade, estado, cep, bairro) VALUES (?, ?, ?, ?)`,
            [cidade, estado, cep || "", bairro || ""],
            (err, localizacaoResult) => {
              if (err) return res.status(500).json({ error: "Erro ao criar localização." })

              const idLocalizacao = localizacaoResult.insertId

              db.query(
                `INSERT INTO loja_anunciante (nome, id_usuario, id_localizacao, idstatus_loja) VALUES (?, ?, ?, 1)`,
                [nome, idUsuario, idLocalizacao],
                (err, lojaCriada) => {
                  if (err) return res.status(500).json({ error: "Erro ao criar loja." })
                  return res.status(201).json({ message: "Loja criada com sucesso!", id_loja: lojaCriada.insertId })
                }
              )
            }
          )
        }
      )
    }
  )
})

// ─── ADMIN — listar usuários ──────────────────
app.get("/admin/usuarios", verificarAdmin, (req, res) => {
  const sql = `
    SELECT u.id_usuario, u.nome, u.email, u.cpf, u.data_cadastro,
           t.tipo_usuario, s.status_usuario
    FROM usuario u
    JOIN tipo_usuario t ON u.idtipo_usuario = t.idtipo_usuario
    JOIN status_usuario s ON u.idstatus_usuario = s.idstatus_usuario
    ORDER BY u.id_usuario ASC
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuários." })
    res.json(results)
  })
})

// ─── ADMIN — editar usuário ───────────────────
app.put("/admin/usuarios/:id", verificarAdmin, (req, res) => {
  const { id } = req.params
  const { nome, email, idtipo_usuario, idstatus_usuario } = req.body

  if (!nome || !email || !idtipo_usuario || !idstatus_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  db.query(
    `UPDATE usuario SET nome = ?, email = ?, idtipo_usuario = ?, idstatus_usuario = ? WHERE id_usuario = ?`,
    [nome, email, idtipo_usuario, idstatus_usuario, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar usuário." })
      res.json({ message: "Usuário atualizado com sucesso!" })
    }
  )
})

// ─── ADMIN — deletar usuário ──────────────────
app.delete("/admin/usuarios/:id", verificarAdmin, (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM usuario WHERE id_usuario = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar usuário." })
    res.json({ message: "Usuário deletado com sucesso!" })
  })
})

// ─── ADMIN — resetar senha ────────────────────
app.put("/admin/usuarios/:id/resetar-senha", verificarAdmin, (req, res) => {
  const { id } = req.params

  db.query(
    "UPDATE usuario SET senha_resetada = 1 WHERE id_usuario = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao resetar senha." })
      res.json({ message: "Troca de senha solicitada com sucesso!" })
    }
  )
})

// ─── PRODUTOS ────────────────────────────────
app.post("/produtos", verificarToken, upload.array("imagens", 8), (req, res) => {
  const { titulo, descricao, preco, id_categoria, id_condicao } = req.body
  const idUsuario = req.usuario.id

  if (!titulo || !descricao || !preco || !id_categoria || !id_condicao) {
    return res.status(400).json({ error: "Campos obrigatórios não preenchidos." })
  }

  db.query(
    `SELECT id_loja FROM loja_anunciante WHERE id_usuario = ?`,
    [idUsuario],
    (err, lojaResult) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar loja." })
      if (lojaResult.length === 0) return res.status(400).json({ error: "Você precisa criar uma loja primeiro." })

      const idLoja = lojaResult[0].id_loja

      db.query(
        `INSERT INTO produto (nome, descricao, preco, status, id_loja, id_categoria, id_condicao)
         VALUES (?, ?, ?, 'ativo', ?, ?, ?)`,
        [titulo, descricao, preco, idLoja, id_categoria, id_condicao],
        (err, produtoResult) => {
          if (err) return res.status(500).json({ error: "Erro ao criar produto." })

          const idProduto = produtoResult.insertId

          db.query(
            `INSERT INTO anuncio (titulo, descricao, id_produto, idstatus_anuncio) VALUES (?, ?, ?, 1)`,
            [titulo, descricao, idProduto],
            (err) => {
              if (err) return res.status(500).json({ error: "Erro ao criar anúncio." })

              const imagens = req.files || []

              if (imagens.length === 0) {
                return res.status(201).json({ message: "Produto cadastrado com sucesso!" })
              }

              const valores = imagens.map((img, index) => [idProduto, img.filename, index === 0 ? 1 : 0])

              db.query(
                `INSERT INTO imagem_produto (id_produto, caminho_imagem, imagem_principal) VALUES ?`,
                [valores],
                (err) => {
                  if (err) return res.status(500).json({ error: "Erro ao salvar imagens." })
                  res.status(201).json({ message: "Produto cadastrado com sucesso!" })
                }
              )
            }
          )
        }
      )
    }
  )
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})