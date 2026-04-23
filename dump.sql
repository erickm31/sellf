-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: BancoDeDadosSELLF
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anuncio`
--

DROP TABLE IF EXISTS `anuncio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anuncio` (
  `id_anuncio` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE armscii8_bin NOT NULL,
  `descricao` text COLLATE armscii8_bin,
  `id_produto` int DEFAULT NULL,
  `idstatus_anuncio` int NOT NULL,
  PRIMARY KEY (`id_anuncio`),
  UNIQUE KEY `id_produto` (`id_produto`),
  KEY `fk_anuncio_status_anuncio1_idx` (`idstatus_anuncio`),
  CONSTRAINT `anuncio_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `fk_anuncio_status_anuncio1` FOREIGN KEY (`idstatus_anuncio`) REFERENCES `status_anuncio` (`idstatus_anuncio`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anuncio`
--

LOCK TABLES `anuncio` WRITE;
/*!40000 ALTER TABLE `anuncio` DISABLE KEYS */;
/*!40000 ALTER TABLE `anuncio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE armscii8_bin NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagem_produto`
--

DROP TABLE IF EXISTS `imagem_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagem_produto` (
  `id_imagem` int NOT NULL AUTO_INCREMENT,
  `id_produto` int DEFAULT NULL,
  PRIMARY KEY (`id_imagem`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `imagem_produto_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagem_produto`
--

LOCK TABLES `imagem_produto` WRITE;
/*!40000 ALTER TABLE `imagem_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagem_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localizacao`
--

DROP TABLE IF EXISTS `localizacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localizacao` (
  `id_localizacao` int NOT NULL AUTO_INCREMENT,
  `cidade` varchar(100) COLLATE armscii8_bin DEFAULT NULL,
  `estado` varchar(50) COLLATE armscii8_bin DEFAULT NULL,
  `cep` varchar(45) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`id_localizacao`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localizacao`
--

LOCK TABLES `localizacao` WRITE;
/*!40000 ALTER TABLE `localizacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `localizacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loja_anunciante`
--

DROP TABLE IF EXISTS `loja_anunciante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loja_anunciante` (
  `id_loja` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE armscii8_bin NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_localizacao` int DEFAULT NULL,
  `idstatus_loja` int NOT NULL,
  PRIMARY KEY (`id_loja`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_localizacao` (`id_localizacao`),
  KEY `fk_loja_anunciante_status_loja1_idx` (`idstatus_loja`),
  CONSTRAINT `fk_loja_anunciante_status_loja1` FOREIGN KEY (`idstatus_loja`) REFERENCES `status_loja` (`idstatus_loja`),
  CONSTRAINT `loja_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `loja_ibfk_2` FOREIGN KEY (`id_localizacao`) REFERENCES `localizacao` (`id_localizacao`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loja_anunciante`
--

LOCK TABLES `loja_anunciante` WRITE;
/*!40000 ALTER TABLE `loja_anunciante` DISABLE KEYS */;
/*!40000 ALTER TABLE `loja_anunciante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE armscii8_bin NOT NULL,
  `descricao` text COLLATE armscii8_bin,
  `preco` varchar(20) COLLATE armscii8_bin NOT NULL,
  `status` varchar(20) COLLATE armscii8_bin DEFAULT 'ativo',
  `id_loja` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_loja` (`id_loja`),
  CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `loja_anunciante` (`id_loja`),
  CONSTRAINT `produto_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_anuncio`
--

DROP TABLE IF EXISTS `status_anuncio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_anuncio` (
  `idstatus_anuncio` int NOT NULL,
  `status_anuncio` varchar(45) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_anuncio`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_anuncio`
--

LOCK TABLES `status_anuncio` WRITE;
/*!40000 ALTER TABLE `status_anuncio` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_anuncio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_loja`
--

DROP TABLE IF EXISTS `status_loja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_loja` (
  `idstatus_loja` int NOT NULL,
  `status_loja` varchar(45) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_loja`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_loja`
--

LOCK TABLES `status_loja` WRITE;
/*!40000 ALTER TABLE `status_loja` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_loja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_usuario`
--

DROP TABLE IF EXISTS `status_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_usuario` (
  `idstatus_usuario` int NOT NULL,
  `status_usuario` varchar(45) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_usuario`
--

LOCK TABLES `status_usuario` WRITE;
/*!40000 ALTER TABLE `status_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_usuario` (
  `idtipo_usuario` int NOT NULL,
  `tipo_usuario` varchar(45) COLLATE armscii8_bin NOT NULL,
  PRIMARY KEY (`idtipo_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `email` varchar(100) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `senha` varchar(255) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idtipo_usuario` int NOT NULL,
  `idstatus_usuario` int NOT NULL,
  `id_localizacao` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_tipo_usuario1_idx` (`idtipo_usuario`),
  KEY `fk_usuario_status_usuario1_idx` (`idstatus_usuario`),
  KEY `fk_usuario_localizacao1_idx` (`id_localizacao`),
  CONSTRAINT `fk_usuario_localizacao1` FOREIGN KEY (`id_localizacao`) REFERENCES `localizacao` (`id_localizacao`),
  CONSTRAINT `fk_usuario_status_usuario1` FOREIGN KEY (`idstatus_usuario`) REFERENCES `status_usuario` (`idstatus_usuario`),
  CONSTRAINT `fk_usuario_tipo_usuario1` FOREIGN KEY (`idtipo_usuario`) REFERENCES `tipo_usuario` (`idtipo_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23  9:13:44