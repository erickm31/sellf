import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../ui/button";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
        <p>© 2026 Sellf</p>
    </footer>
  );
}