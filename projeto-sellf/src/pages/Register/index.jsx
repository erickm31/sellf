import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h1>Bem-vindo!</h1>

        <button 
          className={styles.loginBtn}
          onClick={() => navigate("/")}
        >
          Já tenho uma conta →
        </button>
      </div>

      <div className={styles.right}>
        <h2>Criar Conta</h2>

        <input className={styles.input} type="text" placeholder="Nome" />
        <input className={styles.input} type="text" placeholder="CPF" />
        <input className={styles.input} type="email" placeholder="Email" />
        <input className={styles.input} type="password" placeholder="Senha" />

        <div className={styles.row}>
          <input className={styles.input} type="text" placeholder="Cidade" />
          <input className={styles.input} type="text" placeholder="Estado" />
        </div>

        <button className={styles.registerBtn}>
          Cadastrar-se
        </button>
      </div>

    </div>
  );
}