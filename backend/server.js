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

  const { nome, email, senha, cidade, estado, cpf } = req.body

  if (!nome || !email || !senha || !cidade || !estado || !cpf) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." })
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10)

    const sqlLocal = `
      INSERT INTO localizacao (cidade, estado, cep)
      VALUES (?, ?, ?)
    `

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
        VALUES (?, ?, ?, ?, NOW(), 1, 1, ?)
      `

      db.query(sqlUser, [nome, cpf, email, senhaHash, id_localizacao], (err, resultUser) => {
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

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})