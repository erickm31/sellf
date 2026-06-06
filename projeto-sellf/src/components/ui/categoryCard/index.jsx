import styles from "./styles.module.css";

export default function CategoryCard({ icon, name }) {
  return (
    <button className={styles.card}>
      <span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>{icon}</span>
      <span className={styles.name}>{name}</span>
    </button>
  );
}