import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import sellfazul from "../../assets/sellf.png";
import sellimg from "../../assets/imgSellfteste.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header></Header>
        <section className={`${styles.section1}`}>
          <div className={styles.esquerda}>
            <h1 className={styles.title}>A vitrine digital da sua vizinhança! <span className={styles.subtitle}>Compre e Venda localmente com o Sellf</span></h1>
            <p className={styles.p}>
              Explore produtos novos e usados na sua região. Conecte-se diretamente com vendedores locais e negocie com facilidade. Sem intermediários, apenas conexão.
            </p>
            <div><Button variant="destaque" onClick={() => navigate("/register")}>
              Começar agora
            </Button></div>
          </div>
          <div className={styles.direita}>
            <img className={styles.img} src={sellimg} alt="Sellf" />
          </div>
        </section>
        <section className={`${styles.section2}`}>
          <div className={styles.left}>
            <img className={styles.sellf} src={sellfazul} alt="Sellf Azul" />
          </div>
          <div className={styles.right}>
            <div className={styles.card}>
              <h1 className={styles.cardTitle}>+ 1k</h1>
              <h3 className={styles.cardSubtitle}>Vendedores ativos</h3>
            </div>
            <div className={styles.card}>
              <h1 className={styles.cardTitle}>+ 200</h1>
              <h3 className={styles.cardSubtitle}>Compras realizadas</h3>
            </div>
            <div className={styles.card}>
              <h1 className={styles.cardTitle}>+100</h1>
              <h3 className={styles.cardSubtitle}>Produtos anunciados</h3>
            </div>
          </div>
        </section>
        <section className={`${styles.section3}`}>
          
        </section>
      <Footer></Footer>
    </div>
  );
}