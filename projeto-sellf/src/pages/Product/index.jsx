import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";

/*
  CONTRATO ESPERADO DA API — GET /produtos/:id
  {
    id_produto: number,
    titulo: string,
    descricao: string,
    preco: number | string,
    categoria: string,
    condicao: string,
    cidade: string,
    estado: string,
    nome_vendedor: string,
    telefone_vendedor: string   // só números, ex: "44999998888"
  }
*/

// Mock usado enquanto o back não está plugado
const MOCK_PRODUCT = {
  id_produto: 1,
  titulo: "iPhone 13 128GB",
  descricao: "iPhone 13 em ótimo estado, sem riscos, bateria com 91% de saúde. Acompanha carregador e caixa original.",
  preco: "3200,00",
  categoria: "Eletrônicos",
  condicao: "Seminovo — usado poucas vezes",
  cidade: "Campo Mourão",
  estado: "PR",
  nome_vendedor: "João Silva",
  telefone_vendedor: "44999998888",
};

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarProduto() {
      try {
        const resposta = await axios.get(`http://localhost:3000/produtos/${id}`);
        if (ativo) setProduto(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar produto, usando mock:", err.message);
        if (ativo) setProduto(MOCK_PRODUCT);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarProduto();
    return () => { ativo = false; };
  }, [id]);

  if (carregando) {
    return (
      <div className={styles.page}>
        <Header />
        <p className={styles.loading}>Carregando produto...</p>
        <Footer />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className={styles.page}>
        <Header />
        <p className={styles.loading}>Produto não encontrado.</p>
        <Footer />
      </div>
    );
  }

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
            <div className={styles.imageBox}>
              <img
                src="https://placehold.co/600x400?text=Sem+imagem"
                alt={produto.titulo}
                className={styles.image}
              />
            </div>

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

          {/* ── Coluna direita: preço, local, contato ── */}
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