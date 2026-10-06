import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import sellfpng from "../../../assets/sellf.png";
import Button from "../../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Header() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  async function handleLogout() {
  try {
    await axios.post(
      "http://localhost:3000/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("usuario");
    setUsuario(null);
    setAccountOpen(false);

    navigate("/");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}


  useEffect(() => {
  async function buscarSessao() {
    try {
      const response = await fetch("http://localhost:3000/sessao", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        setUsuario(null);
        return;
      }

      const data = await response.json();
      setUsuario(data.usuario);

    } catch (error) {
      console.error("Erro ao buscar sessão:", error);
      setUsuario(null);
    }
  }

  buscarSessao();
}, []);

  

  function handleBusca(e) {
    e.preventDefault();
    const termo = busca.trim();
    if (termo) {
      navigate(`/home?q=${encodeURIComponent(termo)}`);
    } else {
      navigate("/home");
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.leftTop}>
          <div className={styles.logoArea}>
            <img className={styles.logo} src={sellfpng} alt="Sellf" />
          </div>

          <button className={styles.location} aria-label="Alterar localização">
            <span className={styles.locationLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>location_on</span>
              Entregar para
            </span>
            <span className={styles.locationCity}>Campo Mourão - PR</span>
          </button>

          {/* Busca com submit */}
          <form className={styles.searchWrapper} onSubmit={handleBusca}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Pesquisar produtos, lojas ou categorias"
              aria-label="Buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn} aria-label="Buscar">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>
        </div>

        <div className={styles.rightTop}>
          <button className={styles.actionBtn} aria-label="Favoritos">
            <span className={styles.iconWrap}>
              <span className="material-symbols-outlined">favorite</span>
            </span>
            <span className={styles.actionLabel}>Favoritos</span>
          </button>

          <button className={styles.actionBtn} aria-label="Mensagens">
            <span className={styles.iconWrap}>
              <span className="material-symbols-outlined">chat</span>
              <span className={styles.badge}>3</span>
            </span>
            <span className={styles.actionLabel}>Mensagens</span>
          </button>

          <div className={styles.accountWrap}>
            <button
              className={styles.actionBtn}
              onClick={() => setAccountOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={accountOpen}
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className={styles.actionLabel}>
                <span className={styles.accountSmall}>
                      Olá, {usuario?.nome || "Visitante"}
                </span>
                <span className={styles.accountBig}>Minha Conta ▾</span>
              </span>
            </button>
            {accountOpen && (
              <div className={styles.dropdown}>
                <button className={styles.dropItem}>
                  <span className="material-symbols-outlined">person</span> Perfil
                </button>
                <button className={styles.dropItem}>
                  <span className="material-symbols-outlined">campaign</span> Meus anúncios
                </button>
                <button className={styles.dropItem}>
                  <span className="material-symbols-outlined">favorite</span> Favoritos
                </button>
                <button className={styles.dropItem}>
                  <span className="material-symbols-outlined">settings</span> Configurações
                </button>
                <div className={styles.dropDivider} />
                <button
  className={`${styles.dropItem} ${styles.dropDanger}`}
  onClick={handleLogout}
>
  <span className="material-symbols-outlined">logout</span>
  Sair
</button>

              </div>
            )}
          </div>

          <Button variant="destaque" onClick={() => navigate("/cadastroProduto")}>
            Anunciar
          </Button>
         
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.allCats}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>menu</span>
          Categorias
        </button>
        {["Eletrônicos","Veículos","Imóveis","Moda","Games","Serviços","Produtos Próximos","Lojas"].map((cat) => (
          <button key={cat} className={styles.catLink}>{cat}</button>
        ))}
      </div>
    </header>
  );
}