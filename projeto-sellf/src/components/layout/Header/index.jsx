import { useState } from "react";
import styles from "./styles.module.css";
import sellfpng from "../../../assets/sellf.png";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {/* ── Barra superior ── */}
      <div className={styles.topBar}>
        <div className={styles.leftTop}>
          {/* Logo */}
          <div className={styles.logoArea}>
            <img className={styles.logo} src={sellfpng} alt="Sellf" />
          </div>

          {/* Localização */}
          <button className={styles.location} aria-label="Alterar localização">
            <span className={styles.locationLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                location_on
              </span>
              Entregar para
            </span>
            <span className={styles.locationCity}>Campo Mourão - PR</span>
          </button>

          {/* Busca */}
          <div className={styles.searchWrapper}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Pesquisar produtos, lojas ou categorias"
              aria-label="Buscar"
            />
            <button className={styles.searchBtn} aria-label="Buscar">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        <div className={styles.rightTop}>
          {/* Favoritos */}
          <button className={styles.actionBtn} aria-label="Favoritos">
            <span className={styles.iconWrap}>
              <span className="material-symbols-outlined">favorite</span>
            </span>
            <span className={styles.actionLabel}>Favoritos</span>
          </button>
          {/* Mensagens com badge */}
          <button className={styles.actionBtn} aria-label="Mensagens">
            <span className={styles.iconWrap}>
              <span className="material-symbols-outlined">chat</span>
              <span className={styles.badge}>3</span>
            </span>
            <span className={styles.actionLabel}>Mensagens</span>
          </button>
          {/* Minha Conta com dropdown */}
          <div className={styles.accountWrap}>
            <button
              className={styles.actionBtn}
              onClick={() => setAccountOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={accountOpen}
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className={styles.actionLabel}>
                <span className={styles.accountSmall}>Olá, João</span>
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
                <button className={`${styles.dropItem} ${styles.dropDanger}`}>
                  <span className="material-symbols-outlined">logout</span> Sair
                </button>
              </div>
            )}
          </div>
          <Button variant="destaque" onClick={() => navigate("/register")}>
            Começar agora
          </Button>
        </div>
      </div>

      {/* ── Barra inferior ── */}
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