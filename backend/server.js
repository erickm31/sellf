require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const app = express()

// ============================================================
// SUPABASE
// ============================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

// ============================================================
// EXPRESS
// ============================================================

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
})

// ============================================================
// MIDDLEWARE - TOKEN
// ============================================================

function verificarToken(req, res, next) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = dados
    next()
  } catch {
    return res.status(401).json({ error: "Sessão expirada." })
  }
}

// ============================================================
// MIDDLEWARE - ADMIN
// ============================================================

function verificarAdmin(req, res, next) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    if (Number(dados.tipo) !== 3) return res.status(403).json({ error: "Acesso negado." })
    req.usuario = dados
    next()
  } catch {
    return res.status(401).json({ error: "Sessão expirada." })
  }
}

// ============================================================
// CPF
// ============================================================

function validarCPF(cpf) {
  const limpo = String(cpf).replace(/\D/g, "")
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

// ============================================================
// LOCALIZAÇÃO — busca ou cria (evita duplicatas)
// ============================================================

async function buscarOuCriarLocalizacao(cidade, estado, cep = null, bairro = null) {

  // Verifica se já existe essa cidade + estado
  const { data: existente } = await supabase
    .from("localizacao")
    .select("id_localizacao")
    .eq("cidade", cidade)
    .eq("estado", estado)
    .maybeSingle()

  if (existente) return existente.id_localizacao

  // Não existe — cria nova
  const { data: nova, error } = await supabase
    .from("localizacao")
    .insert({ cidade, estado, cep, bairro })
    .select("id_localizacao")
    .single()

  if (error) throw new Error("Erro ao criar localização.")

  return nova.id_localizacao
}

// ============================================================
// CADASTRO
// ============================================================

app.post("/usuarios", async (req, res) => {
  console.log("=== CADASTRO ===")
  console.log(req.body)

  const { nome, email, senha, telefone, cidade, estado, cpf, idtipo_usuario } = req.body

  if (!nome || !email || !senha || !telefone || !cidade || !estado || !cpf || !idtipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  if (![1, 2].includes(Number(idtipo_usuario))) {
    return res.status(400).json({ error: "Tipo de usuário inválido." })
  }

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." })
  }

  try {

    // Verificar email duplicado
    const { data: emailExistente, error: emailError } = await supabase
      .from("usuario")
      .select("id_usuario")
      .eq("email", email)
      .maybeSingle()

    if (emailError) return res.status(500).json({ error: "Erro ao verificar e-mail." })
    if (emailExistente) return res.status(409).json({ error: "Este e-mail já está cadastrado." })

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // Localização — reutiliza se já existir
    let id_localizacao
    try {
      id_localizacao = await buscarOuCriarLocalizacao(cidade, estado)
    } catch {
      return res.status(500).json({ error: "Erro ao salvar localização." })
    }

    // Criar usuário
    const { data: usuario, error: erroUsuario } = await supabase
      .from("usuario")
      .insert({
        nome,
        cpf,
        telefone,
        email,
        senha: senhaHash,
        idtipo_usuario: Number(idtipo_usuario),
        idstatus_usuario: 1,
        id_localizacao,
        senha_resetada: false
      })
      .select("id_usuario, nome, email, idtipo_usuario")
      .single()

    if (erroUsuario) {
      console.error("ERRO USUARIO:", erroUsuario)
      return res.status(500).json({ error: "Erro ao cadastrar usuário." })
    }

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!", usuario })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno do servidor." })
  }
})

// ============================================================
// LOGIN
// ============================================================

app.post("/login", async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) return res.status(400).json({ error: "E-mail e senha são obrigatórios." })

  try {
    const { data: usuario, error } = await supabase
      .from("usuario")
      .select("id_usuario, nome, email, senha, senha_resetada, idtipo_usuario, idstatus_usuario")
      .eq("email", email)
      .maybeSingle()

    if (error) return res.status(500).json({ error: "Erro interno no servidor." })
    if (!usuario) return res.status(401).json({ error: "E-mail ou senha incorretos." })

    if (Number(usuario.idstatus_usuario) === 2) {
      return res.status(403).json({ error: "Esta conta está desativada." })
    }

    // Senha resetada — redireciona sem verificar senha
    if (usuario.senha_resetada === true) {
      const token = jwt.sign(
        { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario, resetSenha: true },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )
      res.cookie("token", token, {
        httpOnly: true, sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000
      })
      return res.status(200).json({
        senha_resetada: true,
        usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario }
      })
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) return res.status(401).json({ error: "E-mail ou senha incorretos." })

    const token = jwt.sign(
      { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      senha_resetada: false,
      usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.idtipo_usuario }
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno no servidor." })
  }
})

// ============================================================
// SESSÃO
// ============================================================

app.get("/sessao", (req, res) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: "Não autenticado." })
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({
      usuario: { id: dados.id, nome: dados.nome, email: dados.email, tipo: dados.tipo }
    })
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada." })
  }
})

// ============================================================
// LOGOUT
// ============================================================

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  })
  return res.status(200).json({ message: "Logout realizado com sucesso." })
})

// ============================================================
// NOVA SENHA
// ============================================================

app.put("/usuarios/:id/nova-senha", verificarToken, async (req, res) => {
  const { id } = req.params
  const { novaSenha } = req.body

  if (!novaSenha || novaSenha.length < 6) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." })
  }

  if (Number(req.usuario.id) !== Number(id)) {
    return res.status(403).json({ error: "Acesso negado." })
  }

  try {
    const senhaHash = await bcrypt.hash(novaSenha, 10)

    const { error } = await supabase
      .from("usuario")
      .update({ senha: senhaHash, senha_resetada: false })
      .eq("id_usuario", id)

    if (error) return res.status(500).json({ error: "Erro ao salvar nova senha." })

    return res.json({ message: "Senha alterada com sucesso!" })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao processar senha." })
  }
})

// ============================================================
// CRIAR LOJA
// ============================================================

app.post("/lojas", verificarToken, async (req, res) => {
  const { nome, cidade, estado, cep, bairro } = req.body
  const idUsuario = req.usuario.id

  if (!nome || !cidade || !estado) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." })
  }

  try {
    const { data: usuario, error: erroUsuario } = await supabase
      .from("usuario")
      .select("id_usuario, idtipo_usuario")
      .eq("id_usuario", idUsuario)
      .single()

    if (erroUsuario || !usuario) return res.status(404).json({ error: "Usuário não encontrado." })
    if (Number(usuario.idtipo_usuario) !== 2) return res.status(403).json({ error: "Somente vendedores podem criar lojas." })

    const { data: lojaExistente } = await supabase
      .from("loja_anunciante")
      .select("id_loja")
      .eq("id_usuario", idUsuario)
      .maybeSingle()

    if (lojaExistente) return res.status(400).json({ error: "Você já possui uma loja." })

    // Localização — reutiliza se já existir
    let id_localizacao
    try {
      id_localizacao = await buscarOuCriarLocalizacao(cidade, estado, cep || null, bairro || null)
    } catch {
      return res.status(500).json({ error: "Erro ao criar localização." })
    }

    const { data: loja, error: erroLoja } = await supabase
      .from("loja_anunciante")
      .insert({ nome, id_usuario: idUsuario, id_localizacao, idstatus_loja: 1 })
      .select("id_loja")
      .single()

    if (erroLoja) return res.status(500).json({ error: "Erro ao criar loja." })

    return res.status(201).json({ message: "Loja criada com sucesso!", id_loja: loja.id_loja })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno do servidor." })
  }
})

// ============================================================
// ADMIN - LISTAR USUÁRIOS
// ============================================================

app.get("/admin/usuarios", verificarAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select(`
        id_usuario, nome, email, cpf, data_cadastro,
        tipo_usuario:idtipo_usuario ( tipo_usuario ),
        status_usuario:idstatus_usuario ( status_usuario )
      `)
      .order("id_usuario", { ascending: true })

    if (error) return res.status(500).json({ error: "Erro ao buscar usuários." })
    return res.json(data)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao buscar usuários." })
  }
})

// ============================================================
// ADMIN - EDITAR USUÁRIO
// ============================================================

app.put("/admin/usuarios/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params
  const { nome, email, idtipo_usuario, idstatus_usuario } = req.body

  if (!nome || !email || !idtipo_usuario || !idstatus_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  const { error } = await supabase
    .from("usuario")
    .update({ nome, email, idtipo_usuario: Number(idtipo_usuario), idstatus_usuario: Number(idstatus_usuario) })
    .eq("id_usuario", id)

  if (error) return res.status(500).json({ error: "Erro ao atualizar usuário." })
  return res.json({ message: "Usuário atualizado com sucesso!" })
})

// ============================================================
// ADMIN - DESATIVAR
// ============================================================

app.put("/admin/usuarios/:id/desativar", verificarAdmin, async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("usuario")
    .update({ idstatus_usuario: 2 })
    .eq("id_usuario", id)

  if (error) return res.status(500).json({ error: "Erro ao desativar usuário." })
  return res.json({ message: "Usuário desativado com sucesso!" })
})

// ============================================================
// ADMIN - RESETAR SENHA
// ============================================================

app.put("/admin/usuarios/:id/resetar-senha", verificarAdmin, async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("usuario")
    .update({ senha_resetada: true })
    .eq("id_usuario", id)

  if (error) return res.status(500).json({ error: "Erro ao resetar senha." })
  return res.json({ message: "Troca de senha solicitada com sucesso!" })
})

// ============================================================
// PRODUTOS
// ============================================================

app.post("/produtos", verificarToken, upload.array("imagens", 8), async (req, res) => {
  console.log("BODY:", req.body)
  console.log("ARQUIVOS:", req.files?.length || 0)

  const { titulo, descricao, preco, id_categoria, id_condicao } = req.body
  const idUsuario = req.usuario.id

  if (!titulo || !descricao || !preco || !id_categoria || !id_condicao) {
    return res.status(400).json({ error: "Campos obrigatórios não preenchidos." })
  }

  try {
    // Verificar loja
    let { data: loja } = await supabase
      .from("loja_anunciante")
      .select("id_loja")
      .eq("id_usuario", idUsuario)
      .maybeSingle()

    // Criar loja automaticamente se não existir
    if (!loja) {
      const { data: usuario, error: erroUsuario } = await supabase
        .from("usuario")
        .select("nome, id_localizacao")
        .eq("id_usuario", idUsuario)
        .single()

      if (erroUsuario || !usuario) return res.status(404).json({ error: "Usuário não encontrado." })

      const { data: novaLoja, error: erroLoja } = await supabase
        .from("loja_anunciante")
        .insert({
          nome: `Loja de ${usuario.nome}`,
          id_usuario: idUsuario,
          id_localizacao: usuario.id_localizacao,
          idstatus_loja: 1
        })
        .select("id_loja")
        .single()

      if (erroLoja) return res.status(500).json({ error: "Erro ao criar loja automaticamente." })
      loja = novaLoja
    }

    // Criar produto
    const { data: produto, error: erroProduto } = await supabase
      .from("produto")
      .insert({
        nome: titulo,
        descricao,
        preco: Number(preco),
        status: "ativo",
        destaque: false,
        id_loja: loja.id_loja,
        id_categoria: Number(id_categoria),
        id_condicao: Number(id_condicao)
      })
      .select("id_produto")
      .single()

    if (erroProduto) return res.status(500).json({ error: "Erro ao criar produto." })

    const idProduto = produto.id_produto

    // Criar anúncio
    const { data: anuncio, error: erroAnuncio } = await supabase
      .from("anuncio")
      .insert({ titulo, descricao, id_produto: idProduto, idstatus_anuncio: 1 })
      .select("id_anuncio")
      .single()

    if (erroAnuncio) return res.status(500).json({ error: "Erro ao criar anúncio." })

    // Upload de imagens para o Supabase Storage
const imagens = req.files || []
const imagensBanco = []

for (let i = 0; i < imagens.length; i++) {
  const arquivo = imagens[i]

  const extensao = path.extname(arquivo.originalname).toLowerCase()

  const nomeArquivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`

  // "produtos" já é o bucket
  const caminho = `${idProduto}/${nomeArquivo}`

  const { error: erroUpload } = await supabase.storage
    .from("produtos")
    .upload(caminho, arquivo.buffer, {
      contentType: arquivo.mimetype,
      upsert: false
    })

  if (erroUpload) {
    console.error("ERRO UPLOAD:", erroUpload)
    throw erroUpload
  }

  const { data: urlData } = supabase.storage
    .from("produtos")
    .getPublicUrl(caminho)

  if (!urlData?.publicUrl) {
    throw new Error("Não foi possível gerar a URL da imagem.")
  }

  imagensBanco.push({
    id_produto: idProduto,
    caminho_imagem: urlData.publicUrl,
    imagem_principal: i === 0
  })
}

if (imagensBanco.length > 0) {
  const { error: erroImagens } = await supabase
    .from("imagem_produto")
    .insert(imagensBanco)

  if (erroImagens) {
    console.error("ERRO IMAGENS:", erroImagens)
    throw erroImagens
  }
}

  return res.status(201).json({
    message: "Produto cadastrado com sucesso!",
    id_produto: idProduto,
    id_anuncio: anuncio.id_anuncio
  })

  } catch (error) {
    console.error("ERRO CADASTRO PRODUTO:", error)
    return res.status(500).json({ error: "Erro ao cadastrar produto." })
  }
})

// ============================================================
// GET PRODUTOS
// ============================================================

app.get("/produtos", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("produto")
      .select(`
        id_produto,
        nome,
        preco,
        destaque,
        loja_anunciante (
          id_loja,
          localizacao (
            cidade,
            estado
          )
        ),
        imagem_produto (
          caminho_imagem,
          imagem_principal
        )
      `)
      .eq("status", "ativo")
      .order("id_produto", { ascending: false })

    if (error) {
      console.error("ERRO AO BUSCAR PRODUTOS:", error)

      return res.status(500).json({
        error: "Erro ao buscar produtos."
      })
    }

    const produtos = (data || []).map((produto) => {
      const localizacao = produto.loja_anunciante?.localizacao

      const imagemPrincipal = produto.imagem_produto?.find(
        (img) => img.imagem_principal === true
      )

      return {
        id_produto: produto.id_produto,
        titulo: produto.nome,
        preco: produto.preco,

        // NOVO
        destaque: produto.destaque === true,

        cidade: localizacao?.cidade || null,
        estado: localizacao?.estado || null,

        caminho_imagem: imagemPrincipal?.caminho_imagem || null
      }
    })

    return res.json(produtos)

  } catch (error) {
    console.error("ERRO AO BUSCAR PRODUTOS:", error)

    return res.status(500).json({
      error: "Erro ao buscar produtos."
    })
  }
})


// ============================================================
// GET PRODUTO POR ID
// ============================================================

app.get("/produtos/:id", async (req, res) => {
  const { id } = req.params

  try {
    const { data, error } = await supabase
      .from("produto")
      .select(`
        id_produto, nome, descricao, preco,
        categoria:id_categoria ( nome ),
        condicao:id_condicao ( nome ),
        loja_anunciante (
          nome,
          localizacao ( cidade, estado ),
          usuario:id_usuario ( nome, telefone )
        ),
        imagem_produto ( caminho_imagem, imagem_principal )
      `)
      .eq("id_produto", id)
      .single()

    if (error) return res.status(404).json({ error: "Produto não encontrado." })

    const loja = data.loja_anunciante
    const localizacao = loja?.localizacao
    const vendedor = loja?.usuario

    return res.json({
      id_produto: data.id_produto,
      titulo: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      categoria: data.categoria?.nome || null,
      condicao: data.condicao?.nome || null,
      cidade: localizacao?.cidade || null,
      estado: localizacao?.estado || null,
      nome_vendedor: vendedor?.nome || null,
      telefone_vendedor: vendedor?.telefone || null,
      imagens: data.imagem_produto || []
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao buscar produto." })
  }
})

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({ status: "online", servidor: "SELLF API", banco: "Supabase" })
})

// ============================================================
// SERVIDOR
// ============================================================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})