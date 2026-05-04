import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import sellfazul from "../../assets/sellfazul.png";
import sellimg from "../../assets/imgSellfteste.png";

export default function Landing() {
  return (
    <div className={styles.container}>
      <Header></Header>
        <section className={`${styles.section} ${styles.section1}`}>
          <img className={styles.logo} src={sellfazul} alt="Sellf" />
          <h1 className={styles.title}>Venda você mesmo!</h1>
          <div><Button variant="destaque">Começar agora</Button></div>
        </section>
        <section className={`${styles.section} ${styles.section2}`}>

        </section>
        <section className={`${styles.section} ${styles.section3}`}>
          <img className={styles.img} src={sellimg} alt="Sellf" />
        </section>
      <Footer></Footer>
    </div>
  );
}