import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

export default function CadastroProduto() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [condicao, setCondicao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImagens(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("id_categoria", categoria);
    formData.append("id_condicao", condicao);
    imagens.forEach((img) => formData.append("imagens", img));

    try {
      const resposta = await axios.post(
        "http://localhost:3000/produtos",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert(resposta.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao cadastrar anúncio.");
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.voltarBtn}>← Tela inicial</button>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <span className="material-symbols-outlined">sell</span>
        </div>
        <div>
          <h1 className={styles.pageTitle}>Novo anúncio</h1>
          <p className={styles.pageSubtitle}>Preencha os dados do seu produto para publicar na vitrine</p>
        </div>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.twoCol}>

          {/* ── COLUNA ESQUERDA ── */}
          <div className={styles.colLeft}>
            <p className={styles.colLabel}>Informações do produto</p>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">description</span>
                <span>Detalhes do anúncio</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="titulo">
                    Título do anúncio <span className={styles.required}>*</span>
                  </label>
                  <input id="titulo" className={styles.input} type="text"
                    placeholder="Ex: iPhone 13 Pro 256GB — Azul Sierra"
                    maxLength={80} value={titulo}
                    onChange={(e) => setTitulo(e.target.value)} />
                  <span className={styles.hint}>Seja específico: marca, modelo, cor e capacidade</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="descricao">
                    Descrição <span className={styles.required}>*</span>
                  </label>
                  <textarea id="descricao" className={styles.textarea} rows={4} maxLength={2000}
                    placeholder="Descreva o produto com detalhes..."
                    value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                  <span className={styles.hint}>Quanto mais detalhes, maior a chance de vender</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Categoria <span className={styles.required}>*</span></label>
                    <select className={styles.select} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                      <option value="">Selecione uma categoria</option>
                      <option value="1">Eletrônicos</option>
                      <option value="2">Veículos</option>
                      <option value="3">Imóveis</option>
                      <option value="4">Moda e Vestuário</option>
                      <option value="5">Casa e Jardim</option>
                      <option value="6">Esportes e Lazer</option>
                      <option value="7">Brinquedos e Jogos</option>
                      <option value="8">Livros e Papelaria</option>
                      <option value="9">Música e Instrumentos</option>
                      <option value="10">Ferramentas e Construção</option>
                      <option value="11">Saúde e Beleza</option>
                      <option value="12">Animais de Estimação</option>
                      <option value="13">Outros</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Condição <span className={styles.required}>*</span></label>
                    <select className={styles.select} value={condicao} onChange={(e) => setCondicao(e.target.value)}>
                      <option value="">Selecione a condição</option>
                      <option value="1">Novo</option>
                      <option value="2">Seminovo</option>
                      <option value="3">Bom estado</option>
                      <option value="4">Regular</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">payments</span>
                <span>Preço</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Valor <span className={styles.required}>*</span></label>
                  <div className={styles.priceWrapper}>
                    <span className={styles.pricePrefix}>R$</span>
                    <input className={styles.inputPrice} type="text" inputMode="numeric"
                      placeholder="0,00" value={preco}
                      onChange={(e) => setPreco(e.target.value)} />
                  </div>
                </div>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Preço negociável
                </label>
              </div>
            </section>
          </div>

          {/* ── COLUNA DIREITA ── */}
          <div className={styles.colRight}>
            <p className={styles.colLabel}>Mídia e localização</p>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">add_photo_alternate</span>
                <span>Fotos do produto</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.sectionDesc}>Adicione até 8 fotos. A primeira será a capa do anúncio.</p>

                <div className={styles.dropzone}>
                  <input type="file" accept="image/*" multiple className={styles.dropzoneInput}
                    id="fotos" onChange={handleImageChange} />
                  <label htmlFor="fotos" className={styles.dropzoneLabel}>
                    <span className={styles.dropzoneIcon}>
                      <span className="material-symbols-outlined">cloud_upload</span>
                    </span>
                    <span className={styles.dropzoneText}>Clique para adicionar fotos</span>
                    <span className={styles.dropzoneHint}>ou arraste e solte aqui · PNG, JPG até 10MB</span>
                  </label>
                </div>

                {/* Preview das imagens selecionadas */}
                {previews.length > 0 && (
                  <div className={styles.imageGrid}>
                    {previews.map((src, i) => (
                      <div key={i} className={`${styles.imageItem} ${i === 0 ? styles.imageItemCover : ""}`}>
                        <img src={src} alt={`foto ${i + 1}`} className={styles.imageThumb} />
                        {i === 0 && <span className={styles.imageBadge}>Capa</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.btnCancel}>Cancelar</button>
          <button type="submit" className={styles.btnSubmit}>
            <span className="material-symbols-outlined">send</span>
            Publicar anúncio
          </button>
        </div>
      </form>
    </div>
  );
}