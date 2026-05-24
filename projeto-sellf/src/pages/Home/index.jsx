import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header></Header>
      <Footer></Footer>
    </div>
  );
}