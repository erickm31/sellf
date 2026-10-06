import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/button";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [imagemAtiva, setImagemAtiva] = useState(0); // ← índice da foto selecionada

  useEffect(() => {
    let ativo = true;
    async function carregarProduto() {
      try {
        const resposta = await axios.get(`http://localhost:3000/produtos/${id}`);
        if (ativo) setProduto(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarProduto();
    return () => { ativo = false; };
  }, [id]);

  if (carregando) return (
    <div className={styles.page}><Header /><p className={styles.loading}>Carregando produto...</p><Footer /></div>
  );

  if (!produto) return (
    <div className={styles.page}><Header /><p className={styles.loading}>Produto não encontrado.</p><Footer /></div>
  );

  const imagens = produto.imagens || [];
  const imagemExibida = imagens.length > 0
    ? imagens[imagemAtiva]?.caminho_imagem
    : null;

  const linkWhatsapp = `https://wa.me/55${produto.telefone_vendedor}?text=${encodeURIComponent(
    `Olá! Vi seu anúncio "${produto.titulo}" no Sellf e tenho interesse.`
  )}`;

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <button className={styles.voltarBtn} onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
          Voltar
        </button>

        <div className={styles.layout}>
          {/* ── Coluna esquerda: imagem + detalhes ── */}
          <div className={styles.colMain}>

            {/* Imagem principal */}
            <div className={styles.imageBox}>
              {imagemExibida ? (
                <img src={imagemExibida} alt={produto.titulo} className={styles.image} />
              ) : (
                <div className={styles.semImagem}>
                  <span className="material-symbols-outlined">image_not_supported</span>
                  <p>Sem imagem</p>
                </div>
              )}
            </div>

            {/* Miniaturas — só aparece se tiver mais de 1 foto */}
            {imagens.length > 1 && (
              <div className={styles.thumbnailRow}>
                {imagens.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${i === imagemAtiva ? styles.thumbnailAtiva : ""}`}
                    onClick={() => setImagemAtiva(i)}
                  >
                    <img src={img.caminho_imagem} alt={`foto ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">description</span>
                <span>Descrição</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.descricao}>{produto.descricao}</p>
                <div className={styles.tagsRow}>
                  <span className={styles.tag}>{produto.categoria}</span>
                  <span className={styles.tag}>{produto.condicao}</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── Coluna direita ── */}
          <div className={styles.colSide}>
            <section className={styles.card}>
              <div className={styles.cardBody}>
                <h1 className={styles.titulo}>{produto.titulo}</h1>
                <p className={styles.preco}>R$ {produto.preco}</p>
                <div className={styles.metaItem}>
                  <span className="material-symbols-outlined">location_on</span>
                  {produto.cidade} - {produto.estado}
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">storefront</span>
                <span>Vendedor</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.vendedorNome}>{produto.nome_vendedor}</p>
                <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                  <Button variant="destaque" className={styles.whatsappBtn}>
                    <span className="material-symbols-outlined">chat</span>
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}