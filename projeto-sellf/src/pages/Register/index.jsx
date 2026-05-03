import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/input";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <h1>Bem-vindo!</h1>

        <Button variant="outline"
          onClick={() => navigate("/")}
        >
          Já tenho uma conta →
        </Button>
      </div>

      <div className={styles.right}>
        <h2>Criar Conta</h2>

        <Input type="text" placeholder="Nome" />
        <Input type="text" placeholder="CPF" />
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Senha" />

        <div className={styles.row}>
          <Input type="text" placeholder="Cidade" />
          <Input type="text" placeholder="Estado" />
        </div>

        <Button className={styles.registerBtn}>
          Cadastrar-se
        </Button>
      </div>

    </div>
  );
}