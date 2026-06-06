import styles from "./styles.module.css";

export default function LocalContextBar({ city = "Campo Mourão - PR", count = 2341, radius = 15 }) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "var(--cor-azul)" }}>
          location_on
        </span>
        <div className={styles.locationInfo}>
          <span className={styles.city}>{city}</span>
          <span className={styles.count}>
            +{count.toLocaleString("pt-BR")} anúncios próximos · Raio de {radius} km
          </span>
        </div>
      </div>
      <button className={styles.changeBtn}>
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>edit_location_alt</span>
        Alterar localização
      </button>
    </div>
  );
}