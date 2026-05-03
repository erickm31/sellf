import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h2>Já tem uma conta?</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />

        <p className={styles.forgot}>Esqueceu sua senha?</p>

        <button className={styles.primaryBtn}>
          Entrar
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.rightContent}>
          <h1>Bem-vindo!</h1>

          <button 
            className={styles.outlineBtn}
            onClick={() => navigate("/register")}
          >
            Criar uma conta →
          </button>
        </div>
      </div>

    </div>
  );
}