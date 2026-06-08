import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

export default function MinhaLoja() {
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    estado: "",
    cep: "",
    bairro: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const criarLoja = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/lojas",
        form,
        {
          withCredentials: true
        }
      );

      alert(response.data.message);
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Erro ao criar loja."
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <span className="material-symbols-outlined">
            storefront
          </span>
        </div>

        <div>
          <h1 className={styles.pageTitle}>
            Minha Loja
          </h1>

          <p className={styles.pageSubtitle}>
            Cadastre sua loja para começar a anunciar
          </p>
        </div>
      </div>

      <form onSubmit={criarLoja}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className="material-symbols-outlined">
              store
            </span>
            <span>Informações da loja</span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.field}>
              <label className={styles.label}>
                Nome da loja *
              </label>

              <input
                className={styles.input}
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Eletrônicos do João"
              />
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className="material-symbols-outlined">
              location_on
            </span>

            <span>Localização</span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.rowLocation}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Cidade *
                </label>

                <input
                  className={styles.input}
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Estado *
                </label>

                <select
                  className={styles.select}
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="">UF</option>

                  {[
                    "AC","AL","AP","AM","BA","CE","DF","ES",
                    "GO","MA","MT","MS","MG","PA","PB","PR",
                    "PE","PI","RJ","RN","RS","RO","RR","SC",
                    "SP","SE","TO"
                  ].map((uf) => (
                    <option key={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  CEP
                </label>

                <input
                  className={styles.input}
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Bairro
              </label>

              <input
                className={styles.input}
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.btnSubmit}
          >
            Criar Loja
          </button>
        </div>
      </form>
    </div>
  );
}