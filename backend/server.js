require('dotenv').config() // ← Bug 3 resolvido: carrega o .env

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err)
  } else {
    console.log("Conectado ao MySQL ✅")
  }
})

app.get("/", (req, res) => {
  res.send("API rodando 🚀")
})

app.post("/usuarios", (req, res) => {
  const { nome, email, senha, cidade, estado, cpf } = req.body

  
  if (!nome || !email || !senha || !cidade || !estado || !cpf) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  const sqlLocal = `
    INSERT INTO localizacao (cidade, estado, cep)
    VALUES (?, ?, ?)
  `

  db.query(sqlLocal, [cidade, estado, ""], (err, resultLocal) => {
    if (err) {
      console.error("Erro ao inserir localização:", err)
      // Segurança 2 corrigida: não expõe o erro SQL ao cliente
      return res.status(500).json({ error: "Erro ao salvar localização." })
    }

    const id_localizacao = resultLocal.insertId

    const sqlUser = `
      INSERT INTO usuario 
      (nome, cpf, email, senha, data_cadastro, idtipo_usuario, idstatus_usuario, id_localizacao)
      VALUES (?, ?, ?, ?, NOW(), 1, 1, ?)
    `

    db.query(sqlUser, [nome, cpf, email, senha, id_localizacao], (err, resultUser) => {
      if (err) {
        console.error("Erro ao inserir usuário:", err)
        return res.status(500).json({ error: "Erro ao cadastrar usuário." })
      }

      res.status(201).json({ message: "Usuário cadastrado com sucesso!" })
    })
  })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})