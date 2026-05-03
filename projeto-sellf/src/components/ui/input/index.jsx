import styles from "./styles.module.css";

export default function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}