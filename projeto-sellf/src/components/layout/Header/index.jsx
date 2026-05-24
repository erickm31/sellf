import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Button from "../../ui/button";
import sellfpng from "../../../assets/sellf.png";


export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.containercima}>
        <img className={styles.img} src={sellfpng} alt="Sellf" />
        <div className={styles.searchContainer}>
          <input className={styles.search} type="text" placeholder="Pesquisar no Sellf" />
          <button className={styles.searchButton}>
            <span class="material-symbols-outlined">search</span>
          </button>
        </div>
        <div>Outros bagulhos</div>
      </div>
      <div className={styles.containerbaixo}>

      </div>
    </header>
  );
}