import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../ui/button";
import sellfpng from "../../../assets/sellfazul.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left} onClick={() => navigate("/")}>
        <img className={styles.img} src={sellfpng} alt="Sellf" />
          <div className={styles.setinhas}>
            <h2 className={styles.h2}>Explorar
              <span className={`material-symbols-outlined ${styles.span}`}>
                keyboard_arrow_right
              </span>
            </h2>
            <h2 className={styles.h2}>Nossas Vendas
              <span className={`material-symbols-outlined ${styles.span}`}>
                keyboard_arrow_right
              </span>
            </h2>
            <h2 className={styles.h2}>Como Funciona
              <span className={`material-symbols-outlined ${styles.span}`}>
                keyboard_arrow_right
              </span>
            </h2>
          </div>
      </div>

      <div className={styles.right}>
        <Button variant="outline2" onClick={() => navigate("/")}>
          Entrar
        </Button>
        <Button variant="destaque" onClick={() => navigate("/register")}>
          Cadastrar
        </Button>
      </div>
    </header>
  );
}