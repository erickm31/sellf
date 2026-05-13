import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Button from "../../ui/button";
import sellfpng from "../../../assets/sellfazul.png";

export default function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (dados) {
      setUsuario(JSON.parse(dados));
    }
  }, []);

      async function handleLogout() {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("usuario");
      setUsuario(null);
      navigate("/");
    }

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
        {usuario ? (
          <>
            <span className={styles.userName}>Olá, {usuario.nome}!</span>

               {usuario.tipo === 3 && (
              <Button variant="destaque" onClick={() => navigate("/admin")}>
                Painel Admin
              </Button>
            )}
            
            <Button variant="outline2" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline2" onClick={() => navigate("/")}>
              Entrar
            </Button>
            <Button variant="destaque" onClick={() => navigate("/register")}>
              Cadastrar
            </Button>
          </>
        )}
      </div>
    </header>
  );
}