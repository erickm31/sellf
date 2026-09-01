CREATE DATABASE  IF NOT EXISTS `bancodedadossellf` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bancodedadossellf`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bancodedadossellf
-- ------------------------------------------------------
-- Server version	9.7.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '07593505-4688-11f1-92e0-0ccc47eb1185:1-227';

--
-- Table structure for table `anuncio`
--

DROP TABLE IF EXISTS `anuncio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anuncio` (
  `id_anuncio` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `id_produto` int DEFAULT NULL,
  `idstatus_anuncio` int NOT NULL,
  PRIMARY KEY (`id_anuncio`),
  UNIQUE KEY `id_produto` (`id_produto`),
  KEY `fk_anuncio_status_anuncio1_idx` (`idstatus_anuncio`),
  CONSTRAINT `anuncio_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `fk_anuncio_status_anuncio1` FOREIGN KEY (`idstatus_anuncio`) REFERENCES `status_anuncio` (`idstatus_anuncio`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anuncio`
--

LOCK TABLES `anuncio` WRITE;
/*!40000 ALTER TABLE `anuncio` DISABLE KEYS */;
INSERT INTO `anuncio` VALUES (1,'Iphone13','topzera',1,1),(2,'Iphone14','muito bom',2,1),(3,'Cadeira','Cadeira ergonomica simples',3,1),(4,'mouse','mouse novo logitech',4,1),(5,'Cadeira','gamer',5,1),(6,'Celular Samsung','Celular s26 Ultra',6,1),(7,'Iphone 16 128GB','Apple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\n3\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nAcesse a Loja Oficial de Apple\r\n\r\n\r\nNovo  |  +10 mil vendidos\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nLOJA OFICIAL APPLE\r\nVendido por um Revendedor Autorizado Apple.\r\nProduto novo em caixa fechada e com nota fiscal local.\r\nGarantia limitada da Apple por 1 ano.\r\nGarantia AppleCare e serviço de reparo local para produtos fora da garantia.\r\n4.9\r\nAvaliação 4.9 de 5. 43852 opiniões.\r\n(43852)\r\nAdicionar aos favoritos\r\nR$\r\n7.799\r\nR$\r\n4.496\r\n,\r\n80\r\n42% OFF\r\n\r\nou \r\nR$\r\n5.110\r\n em 10x \r\nR$\r\n511\r\n sem juros\r\n\r\n10% OFF Saldo no Mercado Pago\r\n\r\nVer meios de pagamento e promoções\r\nCor:Rosa\r\n\r\nBranco\r\nPreto\r\nRosa\r\nUltramarine\r\nVerde-acinzentado\r\nMemória interna:128 GB\r\n\r\n128 GB\r\n\r\n256 GB\r\n\r\nPoupe comprando com Plano de troca\r\n\r\nReceba até R$5.000 pelo celular usado adicionando o Plano de troca na sua compra.\r\n\r\n\r\nCotar meu celular\r\n\r\nComo funciona\r\nO que você precisa saber sobre este produto\r\nMemória RAM: 8 GB.\r\nO controle da câmera é seu.\r\nFotos que vão além e chegam mais perto.\r\nEstilos fotográficos.\r\nChip A18 superinteligente.\r\nMaior duração da bateria.\r\nRecurso essencial de segurança.\r\nEste iPhone é compatível com eSIM. Entre em contato com a sua operadora para saber como ativar.',7,1),(8,'Iphone 16 128GB','iphone',8,1),(9,'Iphone 16 128GB','iphone',9,1),(10,'Iphone 16 128GB','iphone',10,1),(11,'Iphone 16 128GB','iphone',11,1),(12,'Iphone 16 128GB','aaaa',12,1),(13,'Iphone 16 128GB','aaa',13,1),(14,'dadasdas','dsadada',14,1),(15,'Samsung s26','celular',15,1),(16,'Lanterna Ecopower 8135','Lanterna com por',16,1);
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
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Eletrônicos'),(2,'Veículos'),(3,'Imóveis'),(4,'Moda e Vestuário'),(5,'Casa e Jardim'),(6,'Esportes e Lazer'),(7,'Brinquedos e Jogos'),(8,'Livros e Papelaria'),(9,'Música e Instrumentos'),(10,'Ferramentas e Construção'),(11,'Saúde e Beleza'),(12,'Animais de Estimação'),(13,'Outros');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicao_produto`
--

DROP TABLE IF EXISTS `condicao_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicao_produto` (
  `id_condicao` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_condicao`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicao_produto`
--

LOCK TABLES `condicao_produto` WRITE;
/*!40000 ALTER TABLE `condicao_produto` DISABLE KEYS */;
INSERT INTO `condicao_produto` VALUES (1,'Novo'),(2,'Semi Novo'),(3,'Bom Estado'),(4,'Regular');
/*!40000 ALTER TABLE `condicao_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagem_produto`
--

DROP TABLE IF EXISTS `imagem_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagem_produto` (
  `id_imagem` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `caminho_imagem` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_principal` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_imagem`),
  KEY `fk_imagem_produto` (`id_produto`),
  CONSTRAINT `fk_imagem_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagem_produto`
--

LOCK TABLES `imagem_produto` WRITE;
/*!40000 ALTER TABLE `imagem_produto` DISABLE KEYS */;
INSERT INTO `imagem_produto` VALUES (1,6,'1787181038934-219159510.jpg',1),(2,7,'1787181512023-379553807.webp',1),(3,8,'1787181769039-944951154.webp',1),(4,9,'1787182074944-148087819.webp',1),(5,10,'1787182094826-902110859.webp',1),(6,11,'1787182407428-965457101.webp',1),(7,12,'1787182645906-178535009.webp',1),(8,13,'1787183261627-985740789.webp',1),(9,14,'1787221977564-240242373.jpg',1),(10,15,'1787222291778-156224237.jpg',1),(11,16,'1787224443284-885184366.jpeg',1);
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
  `cidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_localizacao`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localizacao`
--

LOCK TABLES `localizacao` WRITE;
/*!40000 ALTER TABLE `localizacao` DISABLE KEYS */;
INSERT INTO `localizacao` VALUES (25,'Campo Mourão','Paraná','',NULL),(29,'Campo Mourão','Paraná','',NULL),(30,'Campo Mourão','Paraná','',NULL),(31,'Pato Branco','Paraná','',NULL),(32,'Campo Mourão','Paraná','',NULL),(33,'Campo Mourão','Paraná','',NULL),(34,'Campo Mourão','Paraná','',NULL),(35,'Campo Mourão','PR','87303307',''),(36,'Campo Mourão','PR','87303307','Jardim São Sebastião'),(37,'Campo Mourão','PR','87303307','Jardim São Sebastião'),(38,'Campo Mourão','PR','87303307','Jardim São Sebastião'),(39,'Campo Mourão','PR','87303307','Jardim São Sebastião'),(40,'Campo Mourão','PR','',NULL),(41,'Araruna','PR','',NULL),(42,'Araruna','PR','',NULL),(43,'Campo Mourão','PR','',NULL),(44,'Campo Mourão','PR','',NULL),(45,'Campo Mourão','PR','',NULL),(46,'Campo Mourão','PR','',NULL),(47,'Campo Mourão','PR','',NULL),(48,'Campo Mourão','PR','',NULL),(49,'Pato Branco','PR','',NULL),(50,'Pato Branco','PR','',NULL);
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
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loja_anunciante`
--

LOCK TABLES `loja_anunciante` WRITE;
/*!40000 ALTER TABLE `loja_anunciante` DISABLE KEYS */;
INSERT INTO `loja_anunciante` VALUES (1,'Loja do joão',32,39,1),(2,'Loja de JOAO PEDRO BUHLER',38,45,1),(3,'Loja de Joao',41,48,1),(4,'Loja de Joao Buhler',43,50,1),(5,'Loja de João',23,25,1);
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
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preco` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ativo',
  `id_loja` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_condicao` int DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_loja` (`id_loja`),
  KEY `fk_produto_condicao` (`id_condicao`),
  CONSTRAINT `fk_produto_condicao` FOREIGN KEY (`id_condicao`) REFERENCES `condicao_produto` (`id_condicao`),
  CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `loja_anunciante` (`id_loja`),
  CONSTRAINT `produto_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (1,'Iphone13','topzera','3000','ativo',1,1,1),(2,'Iphone14','muito bom','4000','ativo',1,1,3),(3,'Cadeira','Cadeira ergonomica simples','500','ativo',1,3,1),(4,'mouse','mouse novo logitech','100','ativo',1,1,1),(5,'Cadeira','gamer','200','ativo',2,11,1),(6,'Celular Samsung','Celular s26 Ultra','4000','ativo',3,1,1),(7,'Iphone 16 128GB','Apple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\n3\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nAcesse a Loja Oficial de Apple\r\n\r\n\r\nNovo  |  +10 mil vendidos\r\nApple iPhone 16 (128 GB) - Rosa - Distribuidor Autorizado\r\nLOJA OFICIAL APPLE\r\nVendido por um Revendedor Autorizado Apple.\r\nProduto novo em caixa fechada e com nota fiscal local.\r\nGarantia limitada da Apple por 1 ano.\r\nGarantia AppleCare e serviço de reparo local para produtos fora da garantia.\r\n4.9\r\nAvaliação 4.9 de 5. 43852 opiniões.\r\n(43852)\r\nAdicionar aos favoritos\r\nR$\r\n7.799\r\nR$\r\n4.496\r\n,\r\n80\r\n42% OFF\r\n\r\nou \r\nR$\r\n5.110\r\n em 10x \r\nR$\r\n511\r\n sem juros\r\n\r\n10% OFF Saldo no Mercado Pago\r\n\r\nVer meios de pagamento e promoções\r\nCor:Rosa\r\n\r\nBranco\r\nPreto\r\nRosa\r\nUltramarine\r\nVerde-acinzentado\r\nMemória interna:128 GB\r\n\r\n128 GB\r\n\r\n256 GB\r\n\r\nPoupe comprando com Plano de troca\r\n\r\nReceba até R$5.000 pelo celular usado adicionando o Plano de troca na sua compra.\r\n\r\n\r\nCotar meu celular\r\n\r\nComo funciona\r\nO que você precisa saber sobre este produto\r\nMemória RAM: 8 GB.\r\nO controle da câmera é seu.\r\nFotos que vão além e chegam mais perto.\r\nEstilos fotográficos.\r\nChip A18 superinteligente.\r\nMaior duração da bateria.\r\nRecurso essencial de segurança.\r\nEste iPhone é compatível com eSIM. Entre em contato com a sua operadora para saber como ativar.','4500','ativo',3,1,1),(8,'Iphone 16 128GB','iphone','4000','ativo',3,1,1),(9,'Iphone 16 128GB','iphone','4000','ativo',3,1,1),(10,'Iphone 16 128GB','iphone','4000','ativo',3,1,1),(11,'Iphone 16 128GB','iphone','4000','ativo',3,1,1),(12,'Iphone 16 128GB','aaaa','22222','ativo',3,12,2),(13,'Iphone 16 128GB','aaa','222222','ativo',4,11,2),(14,'dadasdas','dsadada','32393012','ativo',5,12,3),(15,'Samsung s26','celular','50000','ativo',5,1,1),(16,'Lanterna Ecopower 8135','Lanterna com por','100','ativo',5,1,2);
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
  `status_anuncio` varchar(45) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_anuncio`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_anuncio`
--

LOCK TABLES `status_anuncio` WRITE;
/*!40000 ALTER TABLE `status_anuncio` DISABLE KEYS */;
INSERT INTO `status_anuncio` VALUES (1,'Ativo'),(2,'Pausado'),(3,'Vendido');
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
  `status_loja` varchar(45) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_loja`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_loja`
--

LOCK TABLES `status_loja` WRITE;
/*!40000 ALTER TABLE `status_loja` DISABLE KEYS */;
INSERT INTO `status_loja` VALUES (1,'Ativa'),(2,'Inativa');
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
  `status_usuario` varchar(45) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`idstatus_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_usuario`
--

LOCK TABLES `status_usuario` WRITE;
/*!40000 ALTER TABLE `status_usuario` DISABLE KEYS */;
INSERT INTO `status_usuario` VALUES (1,'ativo'),(2,'inativo');
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
  `tipo_usuario` varchar(45) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  PRIMARY KEY (`idtipo_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (1,'comprador'),(2,'vendedor'),(3,'administrador');
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
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idtipo_usuario` int NOT NULL,
  `idstatus_usuario` int NOT NULL,
  `id_localizacao` int NOT NULL,
  `senha_resetada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_tipo_usuario1_idx` (`idtipo_usuario`),
  KEY `fk_usuario_status_usuario1_idx` (`idstatus_usuario`),
  KEY `fk_usuario_localizacao1_idx` (`id_localizacao`),
  CONSTRAINT `fk_usuario_localizacao1` FOREIGN KEY (`id_localizacao`) REFERENCES `localizacao` (`id_localizacao`),
  CONSTRAINT `fk_usuario_status_usuario1` FOREIGN KEY (`idstatus_usuario`) REFERENCES `status_usuario` (`idstatus_usuario`),
  CONSTRAINT `fk_usuario_tipo_usuario1` FOREIGN KEY (`idtipo_usuario`) REFERENCES `tipo_usuario` (`idtipo_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (23,'João','097.518.929-88',NULL,'joaopedrobuhler26@gmail.com','$2b$10$HyL04R84QCuhI4MKPiEVVO02rT5y2oLnIFF7vGfgwHZ/WEJsDfT9.','2026-05-04 00:28:04',3,1,25,0),(30,'Joao bozz','417.899.130-20',NULL,'joaobozz@gmail.com','$2b$10$2jlkudhSdmp8ed6fP/AybevD5e0pek7fNr0SKpqcPM80q6bwDjYhW','2026-05-13 17:06:57',1,1,32,0),(32,'João Pedro','097.518.929-88',NULL,'joaopedro@gmail.com','$2b$10$ZpeRDa0hFSsdxzLCui1ApeUn3tNLh7j8oyvJqjvrkfsTeNoGGK9ue','2026-05-14 11:30:51',2,2,34,0),(33,'João Bühler','16168483918',NULL,'ericklemes@gmail.com','$2b$10$ZRZwttdwijgvJwpGA6GLs.8hlKxmjyOFN9QXntISLm8Jv/RM0x66y','2026-07-09 11:39:32',2,1,40,0),(34,'João Bühler','080.554.990-04',NULL,'antonio@gmail.com','$2b$10$VwGLP..cHYAL/uriXYqL5es9hFcwvfMG5TApK8zNPmWuzyWNXjh.q','2026-07-09 11:42:30',1,1,41,0),(35,'Hiago','084.787.400-15',NULL,'hiago@gmail.com','$2b$10$pq0ZYBXFLlrp6Q/9Rd2mIeGuvdJ48M3rKHYhhCWoHp7Skst82/emC','2026-07-09 11:43:08',2,2,42,0),(37,'Vitor','721.394.910-17',NULL,'vitor@gmail.com','$2b$10$I8pYc.hLMXhRGTz4VRCxwOqcFTgi6ck9OhaGfTpuphor3aPaOvw/q','2026-07-09 11:45:00',1,1,44,0),(38,'JOAO PEDRO BUHLER','09751892988',NULL,'xynhg01@gmail.com','$2b$10$H10JrM1AsPT50fREZ1VIGuTmm/FohFFOsBl6xFMgC5KCCoSLRyBgW','2026-08-19 18:09:23',2,1,45,0),(41,'Joao','09751892988','46991262603','pedro@gmail.com','$2b$10$rfdRP5OKvgArEKKPmLHX4eIZcmOlzeT/eJkenNlUKK/.RlsUyAO5m','2026-08-19 22:41:14',2,1,48,0),(43,'Joao Buhler','09751892988','46991262607','joao@hotmail.com','$2b$10$5bBNnuLlTtkXlvvZQNj9muqhFa5MygEc1JO58VIFTm6Be2ApVhlmW','2026-08-19 23:44:25',1,1,50,0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bancodedadossellf'
--

--
-- Dumping routines for database 'bancodedadossellf'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-01  7:54:39
