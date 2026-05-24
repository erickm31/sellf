import styles from "./styles.module.css";
import sellfpng from "../../../assets/sellf.png";
import Button from "../../ui/button";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Barra superior */}
      <div className={styles.containercima}>
        <div className={styles.logoArea}>
          <img className={styles.img} src={sellfpng} alt="Sellf" />
        </div>

        <div className={styles.location}>
          <span className={styles.locationSmall}>Localização Atual</span>
          <span className={styles.locationCity}>
            Campo Mourão - PR
          </span>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="text"
            placeholder="Pesquisar produtos, lojas ou categorias"
          />

          <button className={styles.searchButton}>
            <span className="material-symbols-outlined">
              search
            </span>
          </button>
        </div>

        <div className={styles.actions}>

          <button>
            <span>Mensagens</span>
          </button>

          <button>
            <span className={styles.smallText}>
              Olá, João
            </span>

            <span className={styles.bigText}>
              Minha Conta
            </span>
          </button>
          
          <Button variant="destaque">
            Começar agora
          </Button>
        </div>
      </div>

      {/* Barra inferior */}
      <div className={styles.containerbaixo}>
        <button className={styles.menuButton}>
          ☰ Categorias
        </button>

        <button>Eletrônicos</button>
        <button>Veículos</button>
        <button>Imóveis</button>
        <button>Moda</button>
        <button>Games</button>
        <button>Serviços</button>
        <button>Produtos Próximos</button>
        <button>Lojas</button>
      </div>
    </header>
  );
}