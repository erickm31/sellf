import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";

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
  const [erro, setErro]       = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    nome: "", cpf: "", email: "", senha: "",
    cidade: "", estado: "", idtipo_usuario: "",
  });

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectTipo(value) {
    setErro("");
    setForm({ ...form, idtipo_usuario: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!form.nome?.trim())            return setErro("Informe seu nome.");
    if (!validarCPF(form.cpf ?? ""))  return setErro("CPF inválido.");
    if (!form.email?.includes("@"))   return setErro("E-mail inválido.");
    if ((form.senha?.length ?? 0) < 6) return setErro("Senha mínima: 6 caracteres.");
    if (!form.cidade?.trim())          return setErro("Informe sua cidade.");
    if (!form.estado?.trim())          return setErro("Informe seu estado.");
    if (!form.idtipo_usuario)          return setErro("Selecione o tipo de conta.");

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/usuarios", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (error) {
      setErro(error.response?.data?.error || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>
            <span className="material-symbols-outlined">check</span>
          </div>
          <h2 className={styles.successTitle}>Conta criada!</h2>
          <p className={styles.successSub}>Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Branding ── */}
      <div className={styles.brandPanel}>
        <div className={styles.brandInner}>
          <p className={styles.brandTag}>Sellf</p>
          <h2 className={styles.brandTitle}>Venda para sua vizinhança</h2>
          <p className={styles.brandDesc}>Anuncie grátis e alcance compradores perto de você.</p>

          <ul className={styles.checkList}>
            {[
              "Conta 100% gratuita",
              "Produtos próximos de você",
              "Negocie sem intermediários",
            ].map(item => (
              <li key={item} className={styles.checkItem}>
                <span className={styles.checkDot} />
                {item}
              </li>
            ))}
          </ul>
          <Button onClick={() => navigate("/")} variant="destaqueamarelo">Já tenho uma Conta</Button>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className={styles.formPanel}>
        <button className={styles.backBtn} onClick={() => navigate("/home")}>
          <span className="material-symbols-outlined">arrow_back</span>
          Início
        </button>

        <div className={styles.formBox}>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Preencha os dados abaixo</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {erro && (
              <div className={styles.errorBox}>
                <span className="material-symbols-outlined">error</span>
                {erro}
              </div>
            )}

            {/* Tipo de conta */}
            <div className={styles.tipoGrid}>
              {[
                { value: "1", label: "Comprador", icon: "shopping_bag" },
                { value: "2", label: "Vendedor",  icon: "storefront"   },
              ].map(t => (
                <button key={t.value} type="button"
                  className={`${styles.tipoCard} ${form.idtipo_usuario === t.value ? styles.tipoSelected : ""}`}
                  onClick={() => selectTipo(t.value)}>
                  <span className="material-symbols-outlined">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Grid de campos */}
            <div className={styles.fieldsGrid}>
              <div className={`${styles.fieldGroup} ${styles.full}`}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
                  <input name="nome" type="text" placeholder="Nome completo"
                    autoComplete="name" className={styles.input}
                    onChange={handleChange} value={form.nome} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>badge</span>
                  <input name="cpf" type="text" placeholder="CPF"
                    autoComplete="off" className={styles.input}
                    onChange={handleChange} value={form.cpf} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                  <input name="email" type="email" placeholder="E-mail"
                    autoComplete="email" className={styles.input}
                    onChange={handleChange} value={form.email} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>location_on</span>
                  <input name="cidade" type="text" placeholder="Cidade"
                    autoComplete="address-level2" className={styles.input}
                    onChange={handleChange} value={form.cidade} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>map</span>
                  <input name="estado" type="text" placeholder="UF"
                    autoComplete="address-level1" className={styles.input}
                    onChange={handleChange} value={form.estado} maxLength={2} />
                </div>
              </div>

              <div className={`${styles.fieldGroup} ${styles.full}`}>
                <div className={styles.inputWrap}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                  <input name="senha" type={showPass ? "text" : "password"}
                    placeholder="Senha (mín. 6 caracteres)"
                    autoComplete="new-password" className={styles.input}
                    onChange={handleChange} value={form.senha} />
                  <button type="button" className={styles.eyeBtn}
                    onClick={() => setShowPass(v => !v)} aria-label="Mostrar senha">
                    <span className="material-symbols-outlined">
                      {showPass ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} />Cadastrando...</>
                : <>Cadastrar-se<span className="material-symbols-outlined">arrow_forward</span></>}
            </button>
          </form>

          <p className={styles.switchText}>
            Já tem conta?{" "}
            <button className={styles.switchLink} onClick={() => navigate("/")}>
              Fazer login
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}