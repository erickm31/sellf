import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../ui/button";
import sellfpng from "../../../assets/sellf.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left} onClick={() => navigate("/")}>
        <img className={styles.img} src={sellfpng} alt="Sellf" />
      </div>

      <div className={styles.right}>
        <Button variant="outline" onClick={() => navigate("/")}>
          Entrar
        </Button>
      </div>
    </header>
  );
}