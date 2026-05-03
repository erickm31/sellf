import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/input";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // ← novo
  const [erro, setErro] = useState("");            // ← novo

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    cidade: "",
    estado: ""
  });

  function handleChange(e) {
    setErro("");  // ← limpa o erro ao digitar
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Problema 1 corrigido: recebe (e) e chama e.preventDefault()
  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);  // ← desabilita o botão

    try {
      await axios.post("http://localhost:3000/usuarios", form);
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      // Problema 2 corrigido: exibe a mensagem real do backend
      const mensagem = error.response?.data?.error || "Erro ao cadastrar. Tente novamente.";
      setErro(mensagem);
    } finally {
      setLoading(false);  // ← reabilita o botão sempre
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h1>Bem-vindo!</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Já tenho uma conta →
        </Button>
      </div>

      <div className={styles.right}>
        <h2>Criar Conta</h2>

        {/* Problema 2 corrigido: exibe erro visível na tela */}
        {erro && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "8px" }}>
            {erro}
          </p>
        )}

        <Input name="nome"   type="text"     placeholder="Nome"   onChange={handleChange} />
        <Input name="cpf"    type="text"     placeholder="CPF"    onChange={handleChange} />
        <Input name="email"  type="email"    placeholder="Email"  onChange={handleChange} />
        <Input name="senha"  type="password" placeholder="Senha"  onChange={handleChange} />

        <div className={styles.row}>
          <Input name="cidade" type="text" placeholder="Cidade" onChange={handleChange} />
          <Input name="estado" type="text" placeholder="Estado" onChange={handleChange} />
        </div>

        {/* Problema 1 corrigido: onClick passa o evento para handleSubmit */}
        {/* Problema 3 corrigido: botão desabilitado durante o loading */}
        <Button
          className={styles.registerBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar-se"}
        </Button>
      </div>

    </div>
  );
}