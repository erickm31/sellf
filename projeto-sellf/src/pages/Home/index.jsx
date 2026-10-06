import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import LocalContextBar from "../../components/ui/localContextBar";
import ProductCard from "../../components/ui/productCard";
import StoreCard from "../../components/ui/storeCard";
import Button from "../../components/ui/button";

import { useNavigate, useSearchParams } from "react-router-dom";

// ============================================================
// LOJAS EM DESTAQUE
// ============================================================

const STORES = [
  {
    name: "TechStore Campo Mourão",
    rating: 4.9,
    listingsCount: 87,
    initial: "T"
  },
  {
    name: "Moda Feminina Bella",
    rating: 4.7,
    listingsCount: 43,
    initial: "M"
  },
  {
    name: "AutoPeças Paraná",
    rating: 4.8,
    listingsCount: 122,
    initial: "A"
  },
  {
    name: "Casa & Lar Decor",
    rating: 4.6,
    listingsCount: 58,
    initial: "C"
  }
];

// ============================================================
// BENEFÍCIOS
// ============================================================

const BENEFITS = [
  {
    icon: "handshake",
    title: "Negocie diretamente",
    desc: "Fale direto com o vendedor, sem intermediários e sem taxas."
  },
  {
    icon: "location_on",
    title: "Produtos próximos",
    desc: "Veja primeiro o que está perto de você, priorizando sua região."
  },
  {
    icon: "money_off",
    title: "Sem comissões",
    desc: "Seu dinheiro vai todo para quem merece. Zero taxas escondidas."
  },
  {
    icon: "campaign",
    title: "Fácil de anunciar",
    desc: "Crie seu anúncio em menos de 2 minutos, de qualquer dispositivo."
  }
];

// ============================================================
// HOME
// ============================================================

export default function Home() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const termoBusca = searchParams.get("q") || "";

  // ============================================================
  // ESTADOS
  // ============================================================

  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  // ============================================================
  // BUSCAR PRODUTOS
  // ============================================================

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoadingProdutos(true);

        const resposta = await axios.get(
          "http://localhost:3000/produtos"
        );

        console.log("Produtos recebidos:", resposta.data);

        setProdutos(resposta.data || []);

      } catch (error) {

        console.error(
          "Erro ao buscar produtos:",
          error
        );

        setProdutos([]);

      } finally {

        setLoadingProdutos(false);

      }
    }

    carregarProdutos();
  }, []);

  // ============================================================
  // BUSCA
  // ============================================================

  const produtosFiltrados = termoBusca
    ? produtos.filter((produto) => {

        const termo = termoBusca.toLowerCase();

        return (
          produto.titulo
            ?.toLowerCase()
            .includes(termo) ||

          produto.cidade
            ?.toLowerCase()
            .includes(termo) ||

          produto.estado
            ?.toLowerCase()
            .includes(termo)
        );

      })
    : produtos;

  const estaBuscando = termoBusca.length > 0;

  // ============================================================
  // PRODUTOS EM DESTAQUE
  // ============================================================

  /*
    Somente produtos cujo anúncio possui:

    destaque = true

    serão exibidos aqui.

    Limitamos a 4 produtos.
  */

  const produtosDestaque = produtos
    .filter((produto) => produto.destaque === true)
    .slice(0, 4);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.page}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Header />

      {/* ======================================================
          BARRA DE LOCALIZAÇÃO
      ====================================================== */}

      <LocalContextBar />

      {/* ======================================================
          RESULTADOS DA BUSCA
      ====================================================== */}

      {estaBuscando && (

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <div>

              <h2 className={styles.sectionTitle}>
                Resultados para "{termoBusca}"
              </h2>

              <p className={styles.sectionSub}>
                {produtosFiltrados.length} produto
                {produtosFiltrados.length !== 1 ? "s" : ""} encontrado
                {produtosFiltrados.length !== 1 ? "s" : ""}
              </p>

            </div>

            <button
              className={styles.seeAll}
              onClick={() => navigate("/home")}
            >
              Limpar busca ✕
            </button>

          </div>

          {/* ==================================================
              CARREGANDO
          ================================================== */}

          {loadingProdutos ? (

            <p
              style={{
                color: "#888",
                padding: "1rem"
              }}
            >
              Carregando produtos...
            </p>

          ) : produtosFiltrados.length === 0 ? (

            <p
              style={{
                color: "#888",
                padding: "1rem"
              }}
            >
              Nenhum produto encontrado para "{termoBusca}".
            </p>

          ) : (

            <div className={styles.productsGrid}>

              {produtosFiltrados.map((produto) => (

                <ProductCard
                  key={produto.id_produto}

                  id={produto.id_produto}

                  title={produto.titulo}

                  price={produto.preco}

                  location={`${produto.cidade || ""} - ${
                    produto.estado || ""
                  }`}

                  image={
                    produto.caminho_imagem ||
                    "https://placehold.co/300x200"
                  }
                />

              ))}

            </div>

          )}

        </section>

      )}

      {/* ======================================================
          HOME NORMAL
      ====================================================== */}

      {!estaBuscando && (

        <>

          {/* ==================================================
              PRODUTOS PRÓXIMOS
          ================================================== */}

          <section className={styles.section}>

            <div className={styles.sectionHeader}>

              <div>

                <h2 className={styles.sectionTitle}>
                  Produtos Próximos
                </h2>

                <p className={styles.sectionSub}>
                  Anúncios cadastrados na plataforma
                </p>

              </div>

              <button
                className={styles.seeAll}
                onClick={() => navigate("/home")}
              >
                Ver todos →
              </button>

            </div>

            {/* ==================================================
                LOADING
            ================================================== */}

            {loadingProdutos ? (

              <p
                style={{
                  color: "#888",
                  padding: "1rem"
                }}
              >
                Carregando produtos...
              </p>

            ) : produtos.length === 0 ? (

              <p
                style={{
                  color: "#888",
                  padding: "1rem"
                }}
              >
                Nenhum produto cadastrado ainda.
              </p>

            ) : (

              <div className={styles.productsGrid}>

                {produtos.map((produto) => (

                  <ProductCard
                    key={produto.id_produto}

                    id={produto.id_produto}

                    title={produto.titulo}

                    price={produto.preco}

                    location={`${produto.cidade || ""} - ${
                      produto.estado || ""
                    }`}

                    image={
                      produto.caminho_imagem ||
                      "https://placehold.co/300x200"
                    }
                  />

                ))}

              </div>

            )}

          </section>

          {/* ==================================================
              EM DESTAQUE
          ================================================== */}

          <section
            className={`${styles.section} ${styles.featuredSection}`}
          >

            <div className={styles.sectionHeader}>

              <div>

                <h2 className={styles.sectionTitle}>
                  Em Destaque
                </h2>

                <p className={styles.sectionSub}>
                  Produtos que estão chamando atenção
                </p>

              </div>

              <span className={styles.sponsoredTag}>
                Patrocinado
              </span>

            </div>

            {/* ==================================================
                CARREGANDO DESTAQUES
            ================================================== */}

            {loadingProdutos ? (

              <p
                style={{
                  color: "#888",
                  padding: "1rem"
                }}
              >
                Carregando produtos em destaque...
              </p>

            ) : produtosDestaque.length === 0 ? (

              <p
                style={{
                  color: "#888",
                  padding: "1rem"
                }}
              >
                Nenhum produto em destaque no momento.
              </p>

            ) : (

              <div className={styles.productsGrid}>

                {produtosDestaque.map((produto) => (

                  <ProductCard
                    key={`destaque-${produto.id_produto}`}

                    id={produto.id_produto}

                    title={produto.titulo}

                    price={produto.preco}

                    location={`${produto.cidade || ""} - ${
                      produto.estado || ""
                    }`}

                    image={
                      produto.caminho_imagem ||
                      "https://placehold.co/300x200"
                    }

                    sponsored={true}
                  />

                ))}

              </div>

            )}

          </section>

          {/* ==================================================
              HERO
          ================================================== */}

          <section className={styles.hero}>

            <div className={styles.heroContent}>

              <span className={styles.heroPill}>

                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "0.95rem"
                  }}
                >
                  location_on
                </span>

                Campo Mourão - PR

              </span>

              <h1 className={styles.heroTitle}>
                Encontre produtos perto de você
              </h1>

              <p className={styles.heroSub}>
                Compre e venda na sua região de forma rápida e simples.
              </p>

              <div className={styles.heroBtns}>

                <Button
                  variant="destaque"
                  onClick={() => navigate("/home")}
                >
                  Explorar produtos
                </Button>

                <Button
                  variant="outline2"
                  onClick={() => navigate("/cadastroProduto")}
                >
                  Criar anúncio
                </Button>

              </div>

            </div>

            <div
              className={styles.heroVisual}
              aria-hidden="true"
            >
              <MapIllustration />
            </div>

          </section>

          {/* ==================================================
              LOJAS EM DESTAQUE
          ================================================== */}

          <section className={styles.section}>

            <div className={styles.sectionHeader}>

              <div>

                <h2 className={styles.sectionTitle}>
                  Lojas em Destaque
                </h2>

                <p className={styles.sectionSub}>
                  Vendedores com ótima avaliação na sua região
                </p>

              </div>

              <button className={styles.seeAll}>
                Ver todas →
              </button>

            </div>

            <div className={styles.storesGrid}>

              {STORES.map((loja) => (

                <StoreCard
                  key={loja.name}
                  {...loja}
                />

              ))}

            </div>

          </section>

          {/* ==================================================
              BENEFÍCIOS
          ================================================== */}

          <section
            className={`${styles.section} ${styles.benefitsSection}`}
          >

            <h2
              className={`${styles.sectionTitle} ${styles.sectionTitleWhite}`}
            >
              Por que usar o Sellf?
            </h2>

            <div className={styles.benefitsGrid}>

              {BENEFITS.map((beneficio) => (

                <div
                  key={beneficio.title}
                  className={styles.benefitCard}
                >

                  <div className={styles.benefitIcon}>

                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "1.75rem"
                      }}
                    >
                      {beneficio.icon}
                    </span>

                  </div>

                  <h3 className={styles.benefitTitle}>
                    {beneficio.title}
                  </h3>

                  <p className={styles.benefitDesc}>
                    {beneficio.desc}
                  </p>

                </div>

              ))}

            </div>

          </section>

          {/* ==================================================
              CTA FINAL
          ================================================== */}

          <section className={styles.ctaSection}>

            <div className={styles.ctaInner}>

              <div className={styles.ctaText}>

                <h2 className={styles.ctaTitle}>
                  Venda para compradores da sua região
                </h2>

                <p className={styles.ctaSub}>
                  Seu próximo comprador pode estar a 2 km de você.
                </p>

                <div className={styles.ctaBtns}>

                  <Button
                    variant="destaqueamarelo"
                    onClick={() => navigate("/cadastroProduto")}
                  >
                    Criar meu anúncio
                  </Button>

                  <span className={styles.ctaFree}>
                    ✓ Gratuito para começar
                  </span>

                </div>

              </div>

              <div className={styles.ctaStats}>

                <div className={styles.ctaStat}>

                  <span className={styles.ctaStatNum}>
                    +2.341
                  </span>

                  <span className={styles.ctaStatLabel}>
                    Anúncios próximos
                  </span>

                </div>

                <div className={styles.ctaStat}>

                  <span className={styles.ctaStatNum}>
                    +1.000
                  </span>

                  <span className={styles.ctaStatLabel}>
                    Vendedores ativos
                  </span>

                </div>

                <div className={styles.ctaStat}>

                  <span className={styles.ctaStatNum}>
                    15 km
                  </span>

                  <span className={styles.ctaStatLabel}>
                    Raio de alcance
                  </span>

                </div>

              </div>

            </div>

          </section>

        </>

      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
}

// ============================================================
// ILUSTRAÇÃO DO MAPA
// ============================================================

function MapIllustration() {

  return (

    <svg
      viewBox="0 0 320 280"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.mapSvg}
    >

      <rect
        x="20"
        y="20"
        width="280"
        height="240"
        rx="16"
        fill="#eef4fb"
      />

      <line
        x1="20"
        y1="90"
        x2="300"
        y2="90"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <line
        x1="20"
        y1="150"
        x2="300"
        y2="150"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <line
        x1="20"
        y1="210"
        x2="300"
        y2="210"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <line
        x1="90"
        y1="20"
        x2="90"
        y2="260"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <line
        x1="160"
        y1="20"
        x2="160"
        y2="260"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <line
        x1="230"
        y1="20"
        x2="230"
        y2="260"
        stroke="#c8daf0"
        strokeWidth="8"
      />

      <circle
        cx="160"
        cy="140"
        r="80"
        fill="rgba(0,80,157,0.07)"
        stroke="#00509d"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      <circle
        cx="160"
        cy="140"
        r="10"
        fill="#11296b"
      />

      <circle
        cx="160"
        cy="140"
        r="5"
        fill="white"
      />

      <rect
        x="20"
        y="20"
        width="280"
        height="240"
        rx="16"
        fill="none"
        stroke="#b8d0ea"
        strokeWidth="1.5"
      />

    </svg>

  );
}
