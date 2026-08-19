import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import LocalContextBar from "../../components/ui/LocalContextBar";
import ProductCard from "../../components/ui/ProductCard";
import StoreCard from "../../components/ui/StoreCard";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const FEATURED = [
  { id: 9, image: "https://placehold.co/300x200", title: "Jeep Renegade 2021", price: "89.000,00", location: "Campo Mourão - PR", date: "Hoje", sponsored: true, distance: 4 },
  { id: 10, image: "https://placehold.co/300x200", title: "Apartamento 2 quartos", price: "250.000,00", location: "Campo Mourão - PR", date: "Ontem", sponsored: true, distance: 1 },
  { id: 11, image: "https://placehold.co/300x200", title: "MacBook Air M1", price: "5.800,00", location: "Campo Mourão - PR", date: "Hoje", sponsored: true, distance: 6 },
  { id: 12, image: "https://placehold.co/300x200", title: 'Smart TV Samsung 55"', price: "2.300,00", location: "Peabiru - PR", date: "2 dias", sponsored: true, distance: 11 },
];

const STORES = [
  { name: "TechStore Campo Mourão", rating: 4.9, listingsCount: 87, initial: "T" },
  { name: "Moda Feminina Bella", rating: 4.7, listingsCount: 43, initial: "M" },
  { name: "AutoPeças Paraná", rating: 4.8, listingsCount: 122, initial: "A" },
  { name: "Casa & Lar Decor", rating: 4.6, listingsCount: 58, initial: "C" },
];

const BENEFITS = [
  { icon: "handshake", title: "Negocie diretamente", desc: "Fale direto com o vendedor, sem intermediários e sem taxas." },
  { icon: "location_on", title: "Produtos próximos", desc: "Veja primeiro o que está perto de você, priorizando sua região." },
  { icon: "money_off", title: "Sem comissões", desc: "Seu dinheiro vai todo para quem merece. Zero taxas escondidas." },
  { icon: "campaign", title: "Fácil de anunciar", desc: "Crie seu anúncio em menos de 2 minutos, de qualquer dispositivo." },
];

export default function Home() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/produtos")
      .then(({ data }) => setProdutos(data))
      .catch((err) => console.error("Erro ao buscar produtos:", err))
      .finally(() => setLoadingProdutos(false));
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <LocalContextBar />

      {/* ── 1. Produtos do Banco ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Produtos Próximos</h2>
            <p className={styles.sectionSub}>Anúncios cadastrados na plataforma</p>
          </div>
          <button className={styles.seeAll}>Ver todos →</button>
        </div>

        {loadingProdutos ? (
          <p style={{ color: "#888", padding: "1rem" }}>Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p style={{ color: "#888", padding: "1rem" }}>Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className={styles.productsGrid}>
            {produtos.map((p) => (
              <ProductCard
                key={p.id_produto}
                id={p.id_produto}
                title={p.titulo}
                price={p.preco}
                location={`${p.cidade} - ${p.estado}`}
                image={
                  p.caminho_imagem
                    ? `http://localhost:3000/uploads/${p.caminho_imagem}`
                    : "https://placehold.co/300x200"
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 2. Em Destaque ── */}
      <section className={`${styles.section} ${styles.featuredSection}`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Em Destaque</h2>
            <p className={styles.sectionSub}>Produtos que estão chamando atenção</p>
          </div>
          <span className={styles.sponsoredTag}>Patrocinado</span>
        </div>
        <div className={styles.productsGrid}>
          {FEATURED.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* ── 3. Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>
            <span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>location_on</span>
            Campo Mourão - PR
          </span>
          <h1 className={styles.heroTitle}>Encontre produtos perto de você</h1>
          <p className={styles.heroSub}>Compre e venda na sua região de forma rápida e simples.</p>
          <div className={styles.heroBtns}>
            <Button variant="destaque">Explorar produtos</Button>
            <Button variant="outline2" onClick={() => navigate("/register")}>Criar anúncio</Button>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <MapIllustration />
        </div>
      </section>

      {/* ── 4. Lojas em Destaque ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Lojas em Destaque</h2>
            <p className={styles.sectionSub}>Vendedores com ótima avaliação na sua região</p>
          </div>
          <button className={styles.seeAll}>Ver todas →</button>
        </div>
        <div className={styles.storesGrid}>
          {STORES.map((s) => <StoreCard key={s.name} {...s} />)}
        </div>
      </section>

      {/* ── 5. Benefícios ── */}
      <section className={`${styles.section} ${styles.benefitsSection}`}>
        <h2 className={`${styles.sectionTitle} ${styles.sectionTitleWhite}`}>Por que usar o Sellf?</h2>
        <div className={styles.benefitsGrid}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>{b.icon}</span>
              </div>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. CTA Final ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>Venda para compradores da sua região</h2>
            <p className={styles.ctaSub}>Seu próximo comprador pode estar a 2 km de você.</p>
            <div className={styles.ctaBtns}>
              <Button variant="destaqueamarelo" onClick={() => navigate("/register")}>
                Criar meu anúncio
              </Button>
              <span className={styles.ctaFree}>✓ Gratuito para começar</span>
            </div>
          </div>
          <div className={styles.ctaStats}>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>+2.341</span>
              <span className={styles.ctaStatLabel}>Anúncios próximos</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>+1.000</span>
              <span className={styles.ctaStatLabel}>Vendedores ativos</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>15 km</span>
              <span className={styles.ctaStatLabel}>Raio de alcance</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MapIllustration() {
  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" className={styles.mapSvg}>
      <rect x="20" y="20" width="280" height="240" rx="16" fill="#eef4fb" />
      <line x1="20" y1="90" x2="300" y2="90" stroke="#c8daf0" strokeWidth="8" />
      <line x1="20" y1="150" x2="300" y2="150" stroke="#c8daf0" strokeWidth="8" />
      <line x1="20" y1="210" x2="300" y2="210" stroke="#c8daf0" strokeWidth="8" />
      <line x1="90" y1="20" x2="90" y2="260" stroke="#c8daf0" strokeWidth="8" />
      <line x1="160" y1="20" x2="160" y2="260" stroke="#c8daf0" strokeWidth="8" />
      <line x1="230" y1="20" x2="230" y2="260" stroke="#c8daf0" strokeWidth="8" />
      <circle cx="160" cy="140" r="80" fill="rgba(0,80,157,0.07)" stroke="#00509d" strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="160" cy="140" r="10" fill="#11296b" />
      <circle cx="160" cy="140" r="5" fill="white" />
      <rect x="20" y="20" width="280" height="240" rx="16" fill="none" stroke="#b8d0ea" strokeWidth="1.5" />
    </svg>
  );
}