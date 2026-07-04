import styles from "./styles.module.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import LocalContextBar from "../../components/ui/LocalContextBar";
import ProductCard from "../../components/ui/ProductCard";
import StoreCard from "../../components/ui/StoreCard";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

// ── Mock data ──────────────────────────────────────────
const PRODUCTS_NEARBY = [
  { id: 1, image: "https://placehold.co/300x200", title: "iPhone 13 128GB", price: "3.200,00", location: "Campo Mourão - PR", date: "Hoje", distance: 2, isNew: true },
  { id: 2, image: "https://placehold.co/300x200", title: "Notebook Dell i5", price: "2.800,00", location: "Campo Mourão - PR", date: "Ontem", distance: 4 },
  { id: 3, image: "https://placehold.co/300x200", title: "Bicicleta Caloi", price: "650,00", location: "Mamborê - PR", date: "2 dias", distance: 12 },
  { id: 4, image: "https://placehold.co/300x200", title: "Sofá 3 lugares", price: "900,00", location: "Campo Mourão - PR", date: "Hoje", distance: 1 },
  { id: 5, image: "https://placehold.co/300x200", title: "Câmera Canon T7i", price: "2.100,00", location: "Peabiru - PR", date: "3 dias", distance: 9 },
  { id: 6, image: "https://placehold.co/300x200", title: "Playstation 4 Pro", price: "1.500,00", location: "Campo Mourão - PR", date: "Hoje", distance: 3 },
  { id: 7, image: "https://placehold.co/300x200", title: "Violão Giannini", price: "420,00", location: "Campo Mourão - PR", date: "1 semana", distance: 5 },
  { id: 8, image: "https://placehold.co/300x200", title: 'Monitor LG 24"', price: "780,00", location: "Luiziana - PR", date: "2 dias", distance: 14 },
];

const RECENT = [
  { id: 21, image: "https://placehold.co/300x200", title: "Tênis Nike Air Max", price: "380,00", location: "Campo Mourão - PR", date: "há 5 minutos", distance: 3, isNew: true },
  { id: 22, image: "https://placehold.co/300x200", title: "Mesa de Escritório", price: "490,00", location: "Campo Mourão - PR", date: "há 20 minutos", distance: 7 },
  { id: 23, image: "https://placehold.co/300x200", title: "Fone Sony WH-1000XM4", price: "1.200,00", location: "Peabiru - PR", date: "há 1 hora", distance: 10 },
  { id: 24, image: "https://placehold.co/300x200", title: "Ar-condicionado 9000 BTU", price: "1.350,00", location: "Campo Mourão - PR", date: "há 2 horas", distance: 2 },
];

const FEATURED = [
  { id: 9, image: "https://placehold.co/300x200", title: "Jeep Renegade 2021", price: "89.000,00", location: "Campo Mourão - PR", date: "Hoje", sponsored: true, distance: 4 },
  { id: 10, image: "https://placehold.co/300x200", title: "Apartamento 2 quartos", price: "250.000,00", location: "Campo Mourão - PR", date: "Ontem", sponsored: true, distance: 1 },
  { id: 11, image: "https://placehold.co/300x200", title: "MacBook Air M1", price: "5.800,00", location: "Campo Mourão - PR", date: "Hoje", sponsored: true, distance: 6 },
  { id: 12, image: "https://placehold.co/300x200", title: 'Smart TV Samsung 55"', price: "2.300,00", location: "Peabiru - PR", date: "2 dias", sponsored: true, distance: 11 },
];

const YOU_MAY_LIKE = [
  { id: 31, image: "https://placehold.co/300x200", title: "Kindle Paperwhite", price: "430,00", location: "Campo Mourão - PR", date: "3 dias", distance: 2 },
  { id: 32, image: "https://placehold.co/300x200", title: "Mochila Samsonite", price: "280,00", location: "Campo Mourão - PR", date: "4 dias", distance: 5 },
  { id: 33, image: "https://placehold.co/300x200", title: "Drone DJI Mini 2", price: "2.500,00", location: "Peabiru - PR", date: "1 semana", distance: 9 },
  { id: 34, image: "https://placehold.co/300x200", title: "Cafeteira Nespresso", price: "320,00", location: "Campo Mourão - PR", date: "2 dias", distance: 3 },
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
// ──────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Header />
      <LocalContextBar />

      {/* ── 1. Produtos Próximos ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Produtos Próximos</h2>
            <p className={styles.sectionSub}>Anúncios a até 15 km de Campo Mourão</p>
          </div>
          <button className={styles.seeAll}>Ver todos →</button>
        </div>
        <div className={styles.productsGrid}>
          {PRODUCTS_NEARBY.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
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

      {/* ── 3. Hero Compacto ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>
            <span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>location_on</span>
            Campo Mourão - PR
          </span>
          <h1 className={styles.heroTitle}>Encontre produtos perto de você</h1>
          <p className={styles.heroSub}>Compre e venda na sua região de forma rápida e simples. Sem intermediários.</p>
          <div className={styles.heroBtns}>
            <Button variant="destaque">Explorar produtos</Button>
            <Button variant="outline2" onClick={() => navigate("/register")}>Criar anúncio</Button>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <MapIllustration />
        </div>
      </section>

      {/* ── 4. Recém Publicados ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Recém Publicados</h2>
            <p className={styles.sectionSub}>Chegaram agora na sua região</p>
          </div>
          <span className={styles.livePill}>
            <span className={styles.liveDot} />
            Ao vivo
          </span>
        </div>
        <div className={styles.productsGrid}>
          {RECENT.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* ── 5. Você Pode Gostar ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Você Pode Gostar</h2>
            <p className={styles.sectionSub}>Baseado em produtos populares na sua região</p>
          </div>
          <button className={styles.seeAll}>Ver todos →</button>
        </div>
        <div className={styles.productsGrid}>
          {YOU_MAY_LIKE.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* ── 6. Lojas em Destaque ── */}
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

      {/* ── 7. Benefícios ── */}
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

      {/* ── 8. CTA Final ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>Venda para compradores da sua região</h2>
            <p className={styles.ctaSub}>Milhares de pessoas procuram produtos próximos todos os dias. Seu próximo comprador pode estar a 2 km de você.</p>
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

// ── Ilustração do Hero (SVG inline leve) ──
function MapIllustration() {
  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" className={styles.mapSvg}>
      {/* Fundo do mapa */}
      <rect x="20" y="20" width="280" height="240" rx="16" fill="#eef4fb" />

      {/* Ruas horizontais */}
      <line x1="20" y1="90" x2="300" y2="90" stroke="#c8daf0" strokeWidth="8" />
      <line x1="20" y1="150" x2="300" y2="150" stroke="#c8daf0" strokeWidth="8" />
      <line x1="20" y1="210" x2="300" y2="210" stroke="#c8daf0" strokeWidth="8" />

      {/* Ruas verticais */}
      <line x1="90" y1="20" x2="90" y2="260" stroke="#c8daf0" strokeWidth="8" />
      <line x1="160" y1="20" x2="160" y2="260" stroke="#c8daf0" strokeWidth="8" />
      <line x1="230" y1="20" x2="230" y2="260" stroke="#c8daf0" strokeWidth="8" />

      {/* Blocos de quadras */}
      <rect x="28" y="28" width="54" height="54" rx="6" fill="#dde8f5" />
      <rect x="98" y="28" width="54" height="54" rx="6" fill="#dde8f5" />
      <rect x="168" y="28" width="54" height="54" rx="6" fill="#dde8f5" />
      <rect x="238" y="28" width="54" height="54" rx="6" fill="#dde8f5" />
      <rect x="28" y="98" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="98" y="98" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="168" y="98" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="238" y="98" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="28" y="158" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="98" y="158" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="168" y="158" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="238" y="158" width="54" height="44" rx="6" fill="#dde8f5" />
      <rect x="28" y="218" width="54" height="34" rx="6" fill="#dde8f5" />
      <rect x="98" y="218" width="54" height="34" rx="6" fill="#dde8f5" />
      <rect x="168" y="218" width="54" height="34" rx="6" fill="#dde8f5" />
      <rect x="238" y="218" width="54" height="34" rx="6" fill="#dde8f5" />

      {/* Raio de busca */}
      <circle cx="160" cy="140" r="80" fill="rgba(0,80,157,0.07)" stroke="#00509d" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Pin central (usuário) */}
      <circle cx="160" cy="140" r="10" fill="#11296b" />
      <circle cx="160" cy="140" r="5" fill="white" />
      <line x1="160" y1="150" x2="160" y2="160" stroke="#11296b" strokeWidth="2.5" />

      {/* Pins de produtos */}
      <g>
        <circle cx="115" cy="105" r="12" fill="#00509d" />
        <text x="115" y="109" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R$</text>
        <line x1="115" y1="117" x2="115" y2="124" stroke="#00509d" strokeWidth="2" />
      </g>
      <g>
        <circle cx="205" cy="118" r="12" fill="#00509d" />
        <text x="205" y="122" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R$</text>
        <line x1="205" y1="130" x2="205" y2="137" stroke="#00509d" strokeWidth="2" />
      </g>
      <g>
        <circle cx="130" cy="175" r="12" fill="#ffcb05" />
        <text x="130" y="179" textAnchor="middle" fill="#11296b" fontSize="10" fontWeight="bold">R$</text>
        <line x1="130" y1="187" x2="130" y2="194" stroke="#ffcb05" strokeWidth="2" />
      </g>
      <g>
        <circle cx="200" cy="170" r="12" fill="#00509d" />
        <text x="200" y="174" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R$</text>
        <line x1="200" y1="182" x2="200" y2="189" stroke="#00509d" strokeWidth="2" />
      </g>

      {/* Borda do card do mapa */}
      <rect x="20" y="20" width="280" height="240" rx="16" fill="none" stroke="#b8d0ea" strokeWidth="1.5" />
    </svg>
  );
}