import styles from "./styles.module.css";

export default function Button({ children, onClick, variant = "primary", type = "button", disabled, className }) {

  return ( 
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
    >
      {children}
    </button>
  );
}