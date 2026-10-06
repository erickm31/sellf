import { useState, useEffect } from "react";
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

  // ============================================================
  // PREVIEWS DAS IMAGENS
  // ============================================================

  useEffect(() => {
    const urls = imagens.map((imagem) => URL.createObjectURL(imagem));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagens]);

  // ============================================================
  // ADICIONAR IMAGENS
  // ============================================================

  function handleImageChange(e) {
    const files = Array.from(e.target.files);

    setImagens((imagensAtuais) => {
      const quantidadeDisponivel = 8 - imagensAtuais.length;

      const novasImagens = files.slice(0, quantidadeDisponivel);

      return [...imagensAtuais, ...novasImagens];
    });

    // Permite selecionar novamente o mesmo arquivo
    e.target.value = "";
  }

  // ============================================================
  // REMOVER IMAGEM
  // ============================================================

  function handleRemoveImage(index) {
    setImagens((imagensAtuais) =>
      imagensAtuais.filter((_, i) => i !== index)
    );
  }

  // ============================================================
  // ENVIAR FORMULÁRIO
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagens.length === 0) {
      alert("Adicione pelo menos uma foto do produto.");
      return;
    }

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("id_categoria", categoria);
    formData.append("id_condicao", condicao);

    imagens.forEach((img) => {
      formData.append("imagens", img);
    });

    try {
      const resposta = await axios.post(
        "http://localhost:3000/produtos",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(resposta.data.message);

      // Limpa o formulário depois do cadastro
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setCondicao("");
      setPreco("");
      setImagens([]);
      setPreviews([]);

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Erro ao cadastrar anúncio."
      );
    }
  };

  return (
    <div className={styles.page}>

      {/* ============================================================
          VOLTAR
      ============================================================ */}

      <a href="/home" className={styles.voltarLink}>
        <button type="button" className={styles.voltarBtn}>
          ← Tela inicial
        </button>
      </a>

      {/* ============================================================
          CABEÇALHO
      ============================================================ */}

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <span className="material-symbols-outlined">
            sell
          </span>
        </div>

        <div>
          <h1 className={styles.pageTitle}>
            Novo anúncio
          </h1>

          <p className={styles.pageSubtitle}>
            Preencha os dados do seu produto para publicar na vitrine
          </p>
        </div>
      </div>

      {/* ============================================================
          FORMULÁRIO
      ============================================================ */}

      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit}
      >

        <div className={styles.twoCol}>

          {/* ========================================================
              COLUNA ESQUERDA
          ======================================================== */}

          <div className={styles.colLeft}>

            <p className={styles.colLabel}>
              Informações do produto
            </p>

            {/* ======================================================
                DETALHES
            ====================================================== */}

            <section className={styles.card}>

              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">
                  description
                </span>

                <span>
                  Detalhes do anúncio
                </span>
              </div>

              <div className={styles.cardBody}>

                {/* TÍTULO */}

                <div className={styles.field}>

                  <label
                    className={styles.label}
                    htmlFor="titulo"
                  >
                    Título do anúncio{" "}
                    <span className={styles.required}>
                      *
                    </span>
                  </label>

                  <input
                    id="titulo"
                    className={styles.input}
                    type="text"
                    placeholder="Ex: iPhone 13 Pro 256GB — Azul Sierra"
                    maxLength={80}
                    value={titulo}
                    onChange={(e) =>
                      setTitulo(e.target.value)
                    }
                  />

                  <span className={styles.hint}>
                    Seja específico: marca, modelo, cor e capacidade
                  </span>

                </div>

                {/* DESCRIÇÃO */}

                <div className={styles.field}>

                  <label
                    className={styles.label}
                    htmlFor="descricao"
                  >
                    Descrição{" "}
                    <span className={styles.required}>
                      *
                    </span>
                  </label>

                  <textarea
                    id="descricao"
                    className={styles.textarea}
                    rows={4}
                    maxLength={2000}
                    placeholder="Descreva o produto com detalhes..."
                    value={descricao}
                    onChange={(e) =>
                      setDescricao(e.target.value)
                    }
                  />

                  <span className={styles.hint}>
                    Quanto mais detalhes, maior a chance de vender
                  </span>

                </div>

                {/* CATEGORIA / CONDIÇÃO */}

                <div className={styles.row}>

                  <div className={styles.field}>

                    <label className={styles.label}>
                      Categoria{" "}
                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <select
                      className={styles.select}
                      value={categoria}
                      onChange={(e) =>
                        setCategoria(e.target.value)
                      }
                    >
                      <option value="">
                        Selecione uma categoria
                      </option>

                      <option value="1">
                        Eletrônicos
                      </option>

                      <option value="2">
                        Veículos
                      </option>

                      <option value="3">
                        Imóveis
                      </option>

                      <option value="4">
                        Moda e Vestuário
                      </option>

                      <option value="5">
                        Casa e Jardim
                      </option>

                      <option value="6">
                        Esportes e Lazer
                      </option>

                      <option value="7">
                        Brinquedos e Jogos
                      </option>

                      <option value="8">
                        Livros e Papelaria
                      </option>

                      <option value="9">
                        Música e Instrumentos
                      </option>

                      <option value="10">
                        Ferramentas e Construção
                      </option>

                      <option value="11">
                        Saúde e Beleza
                      </option>

                      <option value="12">
                        Animais de Estimação
                      </option>

                      <option value="13">
                        Outros
                      </option>
                    </select>

                  </div>

                  <div className={styles.field}>

                    <label className={styles.label}>
                      Condição{" "}
                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <select
                      className={styles.select}
                      value={condicao}
                      onChange={(e) =>
                        setCondicao(e.target.value)
                      }
                    >
                      <option value="">
                        Selecione a condição
                      </option>

                      <option value="1">
                        Novo
                      </option>

                      <option value="2">
                        Seminovo
                      </option>

                      <option value="3">
                        Bom estado
                      </option>

                      <option value="4">
                        Regular
                      </option>
                    </select>

                  </div>

                </div>

              </div>

            </section>

            {/* ======================================================
                PREÇO
            ====================================================== */}

            <section className={styles.card}>

              <div className={styles.cardHead}>

                <span className="material-symbols-outlined">
                  payments
                </span>

                <span>
                  Preço
                </span>

              </div>

              <div className={styles.cardBody}>

                <div className={styles.field}>

                  <label className={styles.label}>
                    Valor{" "}
                    <span className={styles.required}>
                      *
                    </span>
                  </label>

                  <div className={styles.priceWrapper}>

                    <span className={styles.pricePrefix}>
                      R$
                    </span>

                    <input
                      className={styles.inputPrice}
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={preco}
                      onChange={(e) =>
                        setPreco(e.target.value)
                      }
                    />

                  </div>

                </div>

                <label className={styles.checkboxLabel}>

                  <input
                    type="checkbox"
                    className={styles.checkbox}
                  />

                  Preço negociável

                </label>

              </div>

            </section>

          </div>

          {/* ========================================================
              COLUNA DIREITA
          ======================================================== */}

          <div className={styles.colRight}>

            <p className={styles.colLabel}>
              Mídia e localização
            </p>

            {/* ======================================================
                FOTOS
            ====================================================== */}

            <section className={styles.card}>

              <div className={styles.cardHead}>

                <span className="material-symbols-outlined">
                  add_photo_alternate
                </span>

                <span>
                  Fotos do produto
                </span>

              </div>

              <div className={styles.cardBody}>

                <p className={styles.sectionDesc}>
                  Adicione até 8 fotos. A primeira será a capa do anúncio.
                </p>

                {/* ==================================================
                    DROPZONE
                ================================================== */}

                {imagens.length < 8 && (
                  <div className={styles.dropzone}>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      multiple
                      className={styles.dropzoneInput}
                      id="fotos"
                      onChange={handleImageChange}
                    />

                    <label
                      htmlFor="fotos"
                      className={styles.dropzoneLabel}
                    >

                      <span className={styles.dropzoneIcon}>
                        <span className="material-symbols-outlined">
                          cloud_upload
                        </span>
                      </span>

                      <span className={styles.dropzoneText}>
                        Clique para adicionar fotos
                      </span>

                      <span className={styles.dropzoneHint}>
                        ou arraste e solte aqui · PNG, JPG até 10MB
                      </span>

                    </label>

                  </div>
                )}

                {/* ==================================================
                    CONTADOR
                ================================================== */}

                <p style={{ marginTop: "10px", fontSize: "13px" }}>
                  {imagens.length} de 8 fotos adicionadas
                </p>

                {/* ==================================================
                    PREVIEW
                ================================================== */}

                {previews.length > 0 && (

                  <div className={styles.imageGrid}>

                    {previews.map((src, i) => (

                      <div
                        key={i}
                        className={`${styles.imageItem} ${
                          i === 0
                            ? styles.imageItemCover
                            : ""
                        }`}
                      >

                        <img
                          src={src}
                          alt={`foto ${i + 1}`}
                          className={styles.imageThumb}
                        />

                        {/* CAPA */}

                        {i === 0 && (
                          <span className={styles.imageBadge}>
                            CAPA
                          </span>
                        )}

                        {/* REMOVER */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(i)
                          }
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            width: "28px",
                            height: "28px",
                            border: "none",
                            borderRadius: "50%",
                            background: "#fff",
                            color: "#d32f2f",
                            cursor: "pointer",
                            fontSize: "18px",
                            fontWeight: "bold",
                            boxShadow:
                              "0 2px 6px rgba(0,0,0,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          aria-label={`Remover foto ${i + 1}`}
                        >
                          ×
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </section>

          </div>

        </div>

        {/* ==========================================================
            BOTÕES
        ========================================================== */}

        <div className={styles.formActions}>

          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={styles.btnSubmit}
          >

            <span className="material-symbols-outlined">
              send
            </span>

            Publicar anúncio

          </button>

        </div>

      </form>

    </div>
  );
}
