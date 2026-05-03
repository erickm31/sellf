import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h1>Já tem uma conta?</h1>

        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Senha" />

        <p className={styles.forgot}>Esqueceu sua senha?</p>

        <Button variant="primary">
          Entrar
        </Button>
      </div>

      <div className={styles.right}>
        <div className={styles.rightContent}>
          <h1>Bem-vindo!</h1>

          <Button variant="outline" onClick={() => navigate("/register")}>
            Criar uma conta <span class="material-symbols-outlined">arrow_forward</span>
          </Button>
        </div>
      </div>

    </div>
  );
}