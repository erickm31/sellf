import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Button from "../../ui/button";
import sellfpng from "../../../assets/sellf.png";

export default function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (dados) {
      setUsuario(JSON.parse(dados));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.left} onClick={() => navigate("/landing")}>
        <img className={styles.img} src={sellfpng} alt="Sellf" />
      </div>

      <div className={styles.right}>
        {usuario ? (
          <div className={styles.userInfo}>
            <span className={styles.userName}>Olá, {usuario.nome}!</span>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => navigate("/")}>
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
}