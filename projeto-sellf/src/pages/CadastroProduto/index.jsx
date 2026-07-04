import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

export default function CadastroProduto() {

  const [titulo, setTitulo] = useState("");
const [descricao, setDescricao] = useState("");
const [categoria, setCategoria] = useState("");
const [condicao, setCondicao] = useState("");
const [preco, setPreco] = useState("");
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("");
const [cep, setCep] = useState("");
const [bairro, setBairro] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const resposta = await axios.post(
      "http://localhost:3000/produtos",
      {
        titulo,
        descricao,
        preco,
        id_categoria: categoria,
        id_condicao: condicao,
        cidade,
        estado,
        cep,
        bairro
      },
      {
        withCredentials: true
      }
    );

    alert(resposta.data.message);

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
      <button className={styles.voltarBtn}>
        ← Tela inicial
      </button>

      {/* ── Cabeçalho da página ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <span className="material-symbols-outlined">sell</span>
        </div>
        <div>
          <h1 className={styles.pageTitle}>Novo anúncio</h1>
          <p className={styles.pageSubtitle}>Preencha os dados do seu produto para publicar na vitrine</p>
        </div>
      </div>

      <form
  className={styles.form}
  noValidate
  onSubmit={handleSubmit}
>
        <div className={styles.twoCol}>

          {/* ── COLUNA ESQUERDA: Informações do produto ── */}
          <div className={styles.colLeft}>
            <p className={styles.colLabel}>Informações do produto</p>

            {/* Card: Detalhes */}
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
                  <input
                    id="titulo"
                    name="titulo"
                    className={styles.input}
                    type="text"
                    placeholder="Ex: iPhone 13 Pro 256GB — Azul Sierra"
                    maxLength={80}
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <span className={styles.hint}>Seja específico: marca, modelo, cor e capacidade</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="descricao">
                    Descrição <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className={styles.textarea}
                    placeholder="Descreva o produto com detalhes: características, acessórios inclusos, motivo da venda..."
                    rows={4}
                    maxLength={2000}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                  <span className={styles.hint}>Quanto mais detalhes, maior a chance de vender</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="categoria">
                      Categoria <span className={styles.required}>*</span>
                    </label>
                    <select id="categoria" name="categoria" className={styles.select} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                      <option value="">Selecione uma categoria</option>
                       <option value="">Selecione</option>
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
                    <label className={styles.label} htmlFor="condicao">
                      Condição <span className={styles.required}>*</span>
                    </label>
                    <select id="condicao" name="condicao" className={styles.select} value={condicao} onChange={(e) => setCondicao(e.target.value)}>
                      <option value="">Selecione a condição</option>
                      <option value="1">Novo — na embalagem original</option>
                      <option value="2">Seminovo — usado poucas vezes</option>
                      <option value="3">Bom estado — marcas mínimas de uso</option>
                      <option value="4">Regular — funciona, com marcas visíveis</option>
                    </select>
                  </div>
                </div>

              </div>
            </section>

            {/* Card: Preço */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">payments</span>
                <span>Preço</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="preco">
                    Valor <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.priceWrapper}>
                    <span className={styles.pricePrefix}>R$</span>
                    <input
                      id="preco"
                      name="preco"
                      className={styles.inputPrice}
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                    />
                  </div>
                </div>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="negociavel" className={styles.checkbox} />
                  Preço negociável
                </label>
              </div>
            </section>
          </div>

          {/* ── COLUNA DIREITA: Fotos + Localização ── */}
          <div className={styles.colRight}>
            <p className={styles.colLabel}>Mídia e localização</p>

            {/* Card: Fotos */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">add_photo_alternate</span>
                <span>Fotos do produto</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.sectionDesc}>Adicione até 8 fotos. A primeira será a capa do anúncio.</p>

                <div className={styles.dropzone}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.dropzoneInput}
                    id="fotos"
                    name="fotos"
                  />
                  <label htmlFor="fotos" className={styles.dropzoneLabel}>
                    <span className={styles.dropzoneIcon}>
                      <span className="material-symbols-outlined">cloud_upload</span>
                    </span>
                    <span className={styles.dropzoneText}>Clique para adicionar fotos</span>
                    <span className={styles.dropzoneHint}>ou arraste e solte aqui · PNG, JPG até 10MB</span>
                  </label>
                </div>

                <div className={styles.imageGrid}>
                  <div className={`${styles.imageItem} ${styles.imageItemCover}`}>
                    <div className={styles.imagePlaceholder}>
                      <span className="material-symbols-outlined">image</span>
                    </div>
                    <span className={styles.imageBadge}>Capa</span>
                  </div>
                  <div className={styles.imageItem}>
                    <div className={styles.imagePlaceholder}>
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                  <div className={styles.imageItem}>
                    <div className={styles.imagePlaceholder}>
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                  <div className={styles.imageItem}>
                    <div className={styles.imagePlaceholder}>
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Card: Localização */}
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className="material-symbols-outlined">location_on</span>
                <span>Localização</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.sectionDesc}>Usada para mostrar seu anúncio a compradores próximos</p>

                <div className={styles.rowLocation}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="cidade">
                      Cidade <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="cidade"
                      name="cidade"
                      className={styles.input}
                      type="text"
                      placeholder="Ex: Campo Mourão"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldNarrow}`}>
                    <label className={styles.label} htmlFor="estado">
                      Estado <span className={styles.required}>*</span>
                    </label>
                    <select id="estado" name="estado" className={styles.select} value={estado} onChange={(e) => setEstado(e.target.value)}>
                      <option value="">UF</option>
                      {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                        <option key={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                  <div className={`${styles.field} ${styles.fieldNarrow}`}>
                    <label className={styles.label} htmlFor="cep">CEP</label>
                    <input
                      id="cep"
                      name="cep"
                      className={styles.input}
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bairro">Bairro</label>
                  <input
                    id="bairro"
                    name="bairro"
                    className={styles.input}
                    type="text"
                    placeholder="Ex: Centro"
                  />
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* ── Ações ── */}
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
