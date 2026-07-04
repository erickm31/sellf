import styles from "./styles.module.css";

export default function StoreCard({ name, rating, listingsCount, initial }) {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.ratingRow}>
          <span className={styles.stars}>{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span>
          <span className={styles.ratingValue}>{rating}</span>
        </div>
        <p className={styles.listings}>{listingsCount} anúncios ativos</p>
      </div>
      <button className={styles.visitBtn}>
        Ver loja
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
      </button>
    </div>
  );
}