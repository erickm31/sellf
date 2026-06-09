import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Headerlanding from "../../components/layout/Headerlanding";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!form.email || !form.senha) {
      return setErro("Preencha e-mail e senha.");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/login",
        form,
        { withCredentials: true }
      );

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/home");
    } catch (error) {
      const mensagem = error.response?.data?.error || "Erro ao fazer login.";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h1>Já tem uma conta?</h1>

        {erro && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "8px" }}>
            {erro}
          </p>
        )}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <Input
          name="senha"
          type="password"
          placeholder="Senha"
          onChange={handleChange}
        />

        <p className={styles.forgot}>Esqueceu sua senha?</p>

        <Button
          variant="destaque"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>

      <div className={styles.right}>
        <div className={styles.rightContent}>
          <h1>Bem-vindo!</h1>
          <Button variant="outline" onClick={() => navigate("/register")}>
            Criar uma conta <span className="material-symbols-outlined">arrow_forward</span>
          </Button>
        </div>
      </div>

    </div>
  );
}