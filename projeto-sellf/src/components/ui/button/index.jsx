import styles from "./styles.module.css";

export default function Button({ children, onClick, variant = "primary", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}