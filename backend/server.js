require('dotenv').config()

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const bcrypt = require("bcrypt")

const app = express()

app.use(cors())
app.use(express.json())

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

app.post("/usuarios", async (req, res) => {
  console.log("=== REQUISIÇÃO RECEBIDA ===")
  console.log("Body:", req.body)

  const { nome, email, senha, cidade, estado, cpf, idtipo_usuario } = req.body

  if (!nome || !email || !senha || !cidade || !estado || !cpf || !idtipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  // Só permite comprador (1) ou vendedor (2) pelo cadastro
  if (![1, 2].includes(Number(idtipo_usuario))) {
    return res.status(400).json({ error: "Tipo de usuário inválido." })
  }

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." })
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10)

    const sqlLocal = `INSERT INTO localizacao (cidade, estado, cep) VALUES (?, ?, ?)`

    db.query(sqlLocal, [cidade, estado, ""], (err, resultLocal) => {
      if (err) {
        console.error("ERRO NA LOCALIZACAO:", err.message)
        return res.status(500).json({ error: err.message })
      }

      const id_localizacao = resultLocal.insertId
      console.log("Localização criada, id:", id_localizacao)

      const sqlUser = `
        INSERT INTO usuario 
        (nome, cpf, email, senha, data_cadastro, idtipo_usuario, idstatus_usuario, id_localizacao)
        VALUES (?, ?, ?, ?, NOW(), ?, 1, ?)
      `

      // ← idtipo_usuario dinâmico no lugar do 1 fixo
      db.query(sqlUser, [nome, cpf, email, senhaHash, Number(idtipo_usuario), id_localizacao], (err, resultUser) => {
        if (err) {
          console.error("ERRO NO USUARIO:", err.message)
          return res.status(500).json({ error: err.message })
        }

        console.log("Usuário criado, id:", resultUser.insertId)
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" })
      })
    })

  } catch (err) {
    console.error("ERRO NO BCRYPT:", err.message)
    return res.status(500).json({ error: "Erro ao processar senha." })
  }
})

app.post("/login", async (req, res) => {
  console.log("=== LOGIN RECEBIDO ===")
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." })
  }

  const sql = "SELECT * FROM usuario WHERE email = ?"

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("ERRO NO LOGIN:", err.message)
      return res.status(500).json({ error: "Erro interno no servidor." })
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." })
    }

    const usuario = results[0]

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." })
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.idtipo_usuario // ← retorna o tipo também
      }
    })
  })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})