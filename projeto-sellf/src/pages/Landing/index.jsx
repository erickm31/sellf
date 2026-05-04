import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 👈 ADICIONE ISSO
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import sellfazul from "../../assets/sellf.png";
import sellimg from "../../assets/imgSellfteste.png";
import celular from "../../assets/celular.png";

export default function Landing() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <section id="explorar" className={`${styles.section2}`}>
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
        <section id="como-funciona" className={`${styles.section3}`}>
          <div className={styles.leftbola}>
            <img className={styles.celular} src={celular} alt="" />
          </div>
          <div className={styles.rightbola}>
            <h1 className={styles.h1}>Conectando <span className={styles.pessoas}>pessoas</span></h1>
            <p className={styles.p}>O Sellf nasceu para simplificar a forma como você compra e vende. Em vez de depender de plataformas complexas, aqui você encontra produtos perto de você e fala diretamente com quem está vendendo.
            <br /> <br />
            Sem taxas escondidas, sem burocracia. Apenas uma vitrine digital inteligente que aproxima pessoas e facilita negociações reais, rápidas e locais.</p>
          </div>
        </section>
        <section id="faq" className={styles.section4}>
          <div className={styles.faqContainer}>
            <h1 className={styles.faqTitle}>Perguntas Frequentes</h1>

            <div className={styles.faqItem}>
              <h3>O Sellf intermedia pagamentos?</h3>
              <p>Não. O Sellf é apenas uma vitrine digital. A negociação acontece diretamente entre comprador e vendedor.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>Como entro em contato com o vendedor?</h3>
              <p>Dentro de cada anúncio você terá acesso direto ao contato do vendedor para negociar.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>Posso vender produtos usados?</h3>
              <p>Sim! O Sellf foi criado para facilitar tanto a venda de produtos novos quanto usados.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>Os produtos são da minha região?</h3>
              <p>Sim. O Sellf prioriza anúncios próximos à sua localização para facilitar negociações locais.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>Preciso pagar para usar?</h3>
              <p>Não. O uso básico é gratuito. Existem apenas opções pagas para destacar anúncios.</p>
            </div>

            <div className={styles.faqCTA}>
              <Button variant="destaque" onClick={() => navigate("/register")}>
                Começar agora
              </Button>
            </div>
          </div>
        </section>
        {show && (
          <button
            className={styles.scrollTop}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span class="material-symbols-outlined">arrow_upward</span>
          </button>
        )}

      <Footer></Footer>
    </div>
  );
}