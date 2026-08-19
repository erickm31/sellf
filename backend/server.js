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

  const {
  nome,
  email,
  senha,
  telefone,
  cidade,
  estado,
  cpf,
  idtipo_usuario
} = req.body

  if (
  !nome ||
  !email ||
  !senha ||
  !telefone ||
  !cidade ||
  !estado ||
  !cpf ||
  !idtipo_usuario
) {
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
    (
      nome,
      cpf,
      telefone,
      email,
      senha,
      data_cadastro,
      idtipo_usuario,
      idstatus_usuario,
      id_localizacao
    )
   VALUES (?, ?, ?, ?, ?, NOW(), ?, 1, ?)`,
  [
    nome,
    cpf,
    telefone,
    email,
    senhaHash,
    Number(idtipo_usuario),
    id_localizacao
  ],
  (err, resultUser) => {

    if (err) {
      console.error("ERRO NO USUARIO:", err.message)

      return res.status(500).json({
        error: "Erro ao cadastrar usuário."
      })
    }

    console.log(
      "Usuário criado, id:",
      resultUser.insertId
    )

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!"
    })
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

    if (usuario.idstatus_usuario == 2) {
  return res.status(403).json({
    error: "Esta conta está desativada."
  });
}

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
// ─── DESATIVAR usuário (em vez de deletar) ────
app.put("/admin/usuarios/:id/desativar", verificarAdmin, (req, res) => {
  const { id } = req.params

  db.query(
    "UPDATE usuario SET idstatus_usuario = 2 WHERE id_usuario = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao desativar usuário." })
      res.json({ message: "Usuário desativado com sucesso!" })
    }
  )
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
// ─── PRODUTOS ────────────────────────────────
app.post("/produtos", verificarToken, (req, res) => {

  const {
    titulo,
    descricao,
    preco,
    id_categoria,
    id_condicao
  } = req.body

  const idUsuario = req.usuario.id

  // Validação
  if (
    !titulo ||
    !descricao ||
    !preco ||
    !id_categoria ||
    !id_condicao
  ) {
    return res.status(400).json({
      error: "Campos obrigatórios não preenchidos."
    })
  }

  // ─────────────────────────────────────────
  // VERIFICA SE O USUÁRIO JÁ POSSUI UMA LOJA
  // ─────────────────────────────────────────

  db.query(
    `
    SELECT id_loja
    FROM loja_anunciante
    WHERE id_usuario = ?
    `,
    [idUsuario],

    (err, lojaResult) => {

      if (err) {
        console.error("ERRO AO BUSCAR LOJA:", err)
        return res.status(500).json({
          error: "Erro ao buscar loja."
        })
      }

      // ─────────────────────────────────────
      // SE JÁ POSSUI LOJA
      // ─────────────────────────────────────

      if (lojaResult.length > 0) {

        const idLoja = lojaResult[0].id_loja

        return criarProduto(idLoja)
      }

      // ─────────────────────────────────────
      // SE NÃO POSSUI LOJA → CRIA AUTOMATICAMENTE
      // ─────────────────────────────────────

      db.query(
        `
        SELECT nome, id_localizacao
        FROM usuario
        WHERE id_usuario = ?
        `,
        [idUsuario],

        (err, usuarioResult) => {

          if (err) {
            console.error("ERRO AO BUSCAR USUÁRIO:", err)
            return res.status(500).json({
              error: "Erro ao buscar dados do usuário."
            })
          }

          if (usuarioResult.length === 0) {
            return res.status(404).json({
              error: "Usuário não encontrado."
            })
          }

          const nomeUsuario = usuarioResult[0].nome
          const idLocalizacao = usuarioResult[0].id_localizacao

          // Cria a loja automaticamente
          db.query(
            `
            INSERT INTO loja_anunciante
            (
              nome,
              id_usuario,
              id_localizacao,
              idstatus_loja
            )
            VALUES (?, ?, ?, 1)
            `,
            [
              `Loja de ${nomeUsuario}`,
              idUsuario,
              idLocalizacao
            ],

            (err, novaLoja) => {

              if (err) {
                console.error("ERRO AO CRIAR LOJA AUTOMÁTICA:", err)
                return res.status(500).json({
                  error: "Erro ao criar loja automaticamente."
                })
              }

              console.log(
                "Loja criada automaticamente. ID:",
                novaLoja.insertId
              )

              criarProduto(novaLoja.insertId)
            }
          )
        }
      )
    }
  )


  // ─────────────────────────────────────────
  // FUNÇÃO PARA CRIAR O PRODUTO
  // ─────────────────────────────────────────

  function criarProduto(idLoja) {

    db.query(
      `
      INSERT INTO produto
      (
        nome,
        descricao,
        preco,
        status,
        id_loja,
        id_categoria,
        id_condicao
      )
      VALUES (?, ?, ?, 'ativo', ?, ?, ?)
      `,
      [
        titulo,
        descricao,
        preco,
        idLoja,
        id_categoria,
        id_condicao
      ],

      (err, produtoResult) => {

        if (err) {
          console.error("ERRO AO CRIAR PRODUTO:", err)

          return res.status(500).json({
            error: "Erro ao criar produto."
          })
        }

        const idProduto = produtoResult.insertId

        console.log(
          "Produto criado. ID:",
          idProduto
        )

        // ───────────────────────────────────
        // CRIA O ANÚNCIO
        // ───────────────────────────────────

        db.query(
          `
          INSERT INTO anuncio
          (
            titulo,
            descricao,
            id_produto,
            idstatus_anuncio
          )
          VALUES (?, ?, ?, 1)
          `,
          [
            titulo,
            descricao,
            idProduto
          ],

          (err, anuncioResult) => {

            if (err) {
              console.error("ERRO AO CRIAR ANÚNCIO:", err)

              return res.status(500).json({
                error: "Erro ao criar anúncio."
              })
            }

            console.log(
              "Anúncio criado. ID:",
              anuncioResult.insertId
            )

            return res.status(201).json({
              message: "Produto cadastrado com sucesso!",
              id_produto: idProduto
            })
          }
        )
      }
    )
  }
})
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})