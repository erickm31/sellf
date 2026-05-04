import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";

function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(limpo[10]);
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    cidade: "",
    estado: "",
    idtipo_usuario: "" // ← novo
  });

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!validarCPF(form.cpf)) {
      return setErro("CPF inválido. Verifique o número digitado.");
    }

    // Validação do tipo de usuário
    if (!form.idtipo_usuario) {
      return setErro("Selecione o tipo de conta.");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/usuarios", form);
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      const mensagem = error.response?.data?.error || "Erro ao cadastrar. Tente novamente.";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <div className={styles.leftContent}>
          <h1>Bem-vindo!</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <span className="material-symbols-outlined">arrow_back</span> Já tenho uma conta
          </Button>
        </div>
      </div>

      <div className={styles.right}>
        <h2>Criar Conta</h2>

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

        <select
          name="idtipo_usuario"
          onChange={handleChange}
          value={form.idtipo_usuario}
          className={styles.select}
        >
          <option value="">Tipo de conta...</option>
          <option value="1">Comprador</option>
          <option value="2">Vendedor</option>
        </select>

        <Button
          variant="destaque"
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