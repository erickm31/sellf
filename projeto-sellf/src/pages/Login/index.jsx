import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ← novos estados para troca de senha
  const [precisaTrocar, setPrecisaTrocar] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroTroca, setErroTroca] = useState("");
  const [loadingTroca, setLoadingTroca] = useState(false);

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!form.email || !form.senha) return setErro("Preencha e-mail e senha.");

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/login",
        form,
        { withCredentials: true }
      );

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // ← verifica se precisa trocar a senha
      if (data.senha_resetada) {
        setUsuarioId(data.usuario.id);
        setPrecisaTrocar(true);
        return;
      }

      navigate("/home");
    } catch (error) {
      setErro(error.response?.data?.error || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTrocarSenha(e) {
    e.preventDefault();
    setErroTroca("");

    if (!novaSenha || !confirmaSenha) {
      return setErroTroca("Preencha os dois campos.");
    }
    if (novaSenha.length < 6) {
      return setErroTroca("A senha deve ter no mínimo 6 caracteres.");
    }
    if (novaSenha !== confirmaSenha) {
      return setErroTroca("As senhas não coincidem.");
    }

    setLoadingTroca(true);
    try {
      await axios.put(
        `http://localhost:3000/usuarios/${usuarioId}/nova-senha`,
        { novaSenha },
        { withCredentials: true }
      );
      navigate("/home");
    } catch (err) {
      setErroTroca(err.response?.data?.error || "Erro ao salvar nova senha.");
    } finally {
      setLoadingTroca(false);
    }
  }

  // ── Tela de troca de senha ──
  if (precisaTrocar) {
    return (
      <div className={styles.page}>
        <div className={styles.formPanel}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Criar nova senha</h1>
            <p className={styles.subtitle}>
              Sua senha foi resetada pelo administrador. Defina uma nova senha para continuar.
            </p>

            <form className={styles.form} onSubmit={handleTrocarSenha} noValidate>
              {erroTroca && (
                <div className={styles.errorBox}>
                  <span className="material-symbols-outlined">error</span>
                  {erroTroca}
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nova senha</label>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={styles.input}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirmar nova senha</label>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock_reset</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={styles.input}
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loadingTroca}>
                {loadingTroca
                  ? <><span className={styles.spinner} />Salvando...</>
                  : <>Salvar nova senha<span className="material-symbols-outlined">arrow_forward</span></>
                }
              </button>
            </form>
          </div>
        </div>

        <div className={styles.brandPanel}>
          <div className={styles.brandInner}>
            <p className={styles.brandTag}>Sellf</p>
            <h2 className={styles.brandTitle}>Segurança em primeiro lugar</h2>
            <p className={styles.brandDesc}>Defina uma senha forte para proteger sua conta.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Tela de login normal ──
  return (
    <div className={styles.page}>
      <div className={styles.formPanel}>
        <button className={styles.backBtn} onClick={() => navigate("/home")}>
          <span className="material-symbols-outlined">arrow_back</span>
          Início
        </button>

        <div className={styles.formBox}>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>Acesse sua conta no Sellf</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {erro && (
              <div className={styles.errorBox}>
                <span className="material-symbols-outlined">error</span>
                {erro}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">E-mail</label>
              <div className={styles.inputWrap}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                <input id="email" name="email" type="email" placeholder="seu@email.com"
                  autoComplete="email" className={styles.input}
                  onChange={handleChange} value={form.email} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="senha">Senha</label>
                <button type="button" className={styles.forgotLink}>Esqueceu a senha?</button>
              </div>
              <div className={styles.inputWrap}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                <input id="senha" name="senha"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password" className={styles.input}
                  onChange={handleChange} value={form.senha} />
                <button type="button" className={styles.eyeBtn}
                  onClick={() => setShowPass(v => !v)} aria-label="Mostrar senha">
                  <span className="material-symbols-outlined">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} />Entrando...</>
                : <>Entrar<span className="material-symbols-outlined">arrow_forward</span></>}
            </button>
          </form>

          <p className={styles.switchText}>
            Não tem conta?{" "}
            <button className={styles.switchLink} onClick={() => navigate("/register")}>
              Criar conta grátis
            </button>
          </p>
        </div>
      </div>

      <div className={styles.brandPanel}>
        <div className={styles.brandInner}>
          <p className={styles.brandTag}>Sellf</p>
          <h2 className={styles.brandTitle}>Produtos da sua região em um só lugar</h2>
          <p className={styles.brandDesc}>Compre e venda localmente. Sem intermediários.</p>
          <Button onClick={() => navigate("/register")} variant="destaqueamarelo">Criar uma Conta</Button>
        </div>
      </div>
    </div>
  );
}