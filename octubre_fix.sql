-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: observapp
-- ------------------------------------------------------
-- Server version	5.7.14-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actualizacion`
--

DROP TABLE IF EXISTS `actualizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actualizacion` (
  `idactualizacion` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` int(11) NOT NULL DEFAULT '1',
  `idproyecto` int(11) NOT NULL,
  `iduser` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contenido` mediumtext,
  `principal` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idactualizacion`),
  KEY `fk_actualizacion_proyecto1_idx` (`idproyecto`),
  KEY `fk_actualizacion_user1_idx` (`iduser`),
  CONSTRAINT `fk_actualizacion_proyecto1` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_actualizacion_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actualizacion`
--

LOCK TABLES `actualizacion` WRITE;
/*!40000 ALTER TABLE `actualizacion` DISABLE KEYS */;
INSERT INTO `actualizacion` VALUES (1,3,2,1,'2017-08-31 00:58:12','juiaaa','/web-img/2017-08-181806241.jpg'),(2,3,2,1,'2017-08-31 00:59:01','','/web-img/2017-08-181806241.jpg'),(3,2,4,1,'2017-08-31 01:10:58','vivan los perritos','jeje'),(4,2,6,1,'2017-08-31 01:44:21','guau guau<p><br></p>','vivan los perritos'),(5,3,2,7,'2017-08-31 04:39:20','jjjj','https://yt3.ggpht.com/-XaGPKxcjtwA/AAAAAAAAAAI/AAAAAAAAAAA/NntFRM8Ab-M/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'),(6,2,15,7,'2017-08-31 13:33:43','jeje','muñeco'),(7,2,19,1,'2017-10-13 10:41:16','este proyecto es la luz','wena men'),(8,5,19,8,'2017-10-13 22:49:00','yo quiero un laik','Se unió al proyecto!'),(9,6,19,8,'2017-10-15 19:14:01','aja&@&aja','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.'),(10,5,19,8,'2017-10-15 19:17:14','<h3 class=\"page-header\">Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).</h3>aja<h3 class=\"page-header\">Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.</h3>aja','El proyecto avanzó de etapa!'),(11,5,19,5,'2017-10-16 10:57:06','Explota!','Se unió al proyecto!'),(12,5,15,8,'2017-10-24 17:10:21','yo quiero ser útil','Se unió al proyecto!'),(13,5,15,8,'2017-10-24 17:11:53','yo quiero ser útil','Se unió al proyecto!'),(14,5,15,8,'2017-10-24 17:13:08','yo quiero ser útil','Se unió al proyecto!'),(15,5,15,8,'2017-10-24 17:17:06','yo quiero ser útil','Se unió al proyecto!'),(16,5,15,7,'2017-10-25 21:42:06','<h4>5</h4>asddsa<hr style=\"border-top-color: black; margin-top: 20px\"><h4>6</h4>adsdsaads','El proyecto avanzó de etapa!'),(17,5,20,7,'2017-10-26 00:33:45','vamos que se puede','Se unió al proyecto!'),(18,5,20,7,'2017-10-26 00:35:48','vamos que se puede','Se unió al proyecto!'),(19,5,20,7,'2017-11-16 13:51:48','<h4>Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).</h4>asddddd<hr style=\"border-top-color: black; margin-top: 20px\"><h4>Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.</h4>dddd','El proyecto avanzó de etapa!'),(20,5,18,1,'2018-09-27 17:10:20','tengos hermanos tambien<p><br></p>','Se unió al proyecto!'),(21,2,20,7,'2018-09-27 17:17:57','nuestro proyecto va bien','paz mundial'),(22,2,20,1,'2018-10-04 17:39:02','<h6 class=\"text-center\" style=\"font-family: Roboto, Helvetica, Arial, sans-serif; margin-top: 10px; margin-bottom: 10px; font-size: 12px;\">&lt;p class=\"_4bl9\" style=\"overflow-wrap: break-word; overflow: hidden; flex: 1 0 0px; font-family: Helvetica, Arial, sans-serif; color: rgb(29, 33, 41); font-size: 12px;\"&gt;&lt;p class=\"_3-8w\" style=\"margin-top: 4px; font-family: inherit;\"&gt;¡Almacenes re-significados! Devolvemos el valor de centro comunitario primario a los almacenes de barrio, buscamos el fomento de comunidades sustentables, por medio de las compras colectivas, y la fracción a precio justo&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;/p&gt;</h6><p><br></p>','s'),(23,5,20,8,'2018-10-08 00:10:29','yo cacho que is se puede','Se unió al proyecto!'),(24,5,20,1,'2018-10-08 00:11:43','<h4>¿Cómo definirían el impacto social de su proyecto?</h4>bueno<hr style=\"border-top-color: black; margin-top: 20px\"><h4>¿Quién o quiénes serán los/as beneficiarios/as?</h4>todos','El proyecto avanzó de etapa!'),(25,5,17,1,'2018-10-18 13:47:40','yo quiero aportar algo<p><br></p>','Se unió al proyecto!'),(26,5,21,7,'2018-10-18 13:50:58','Aportemos a la paz','Se unió al proyecto!');
/*!40000 ALTER TABLE `actualizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `idadmin` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(10) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(15) DEFAULT NULL,
  `apellido` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`idadmin`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'jeje','jojo','Benja','Menes');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudadano`
--

DROP TABLE IF EXISTS `ciudadano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciudadano` (
  `idobs` int(10) unsigned NOT NULL,
  `iduser` int(11) NOT NULL,
  PRIMARY KEY (`iduser`),
  KEY `fk_ciudadano_observatorio1_idx` (`idobs`),
  KEY `fk_ciudadano_user1_idx` (`iduser`),
  CONSTRAINT `fk_ciudadano_observatorio1` FOREIGN KEY (`idobs`) REFERENCES `observatorio` (`idobservatorio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ciudadano_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudadano`
--

LOCK TABLES `ciudadano` WRITE;
/*!40000 ALTER TABLE `ciudadano` DISABLE KEYS */;
INSERT INTO `ciudadano` VALUES (1,7),(2,1),(2,8),(2,9),(2,15),(2,22);
/*!40000 ALTER TABLE `ciudadano` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentario` (
  `idcomentario` int(11) NOT NULL AUTO_INCREMENT,
  `texto` mediumtext,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `iduser` int(11) NOT NULL,
  `idpost` int(10) unsigned NOT NULL,
  `estado` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idcomentario`),
  KEY `fk_comentario_user1_idx` (`iduser`),
  KEY `fk_comentario_post1_idx` (`idpost`),
  CONSTRAINT `fk_comentario_post1` FOREIGN KEY (`idpost`) REFERENCES `post` (`idpost`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentario_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
INSERT INTO `comentario` VALUES (10,'penita','2017-07-25 23:56:37',2,17,1),(16,'a si?','2017-08-07 13:27:38',9,29,2),(17,'pirula','2017-08-07 15:43:42',9,49,2),(19,'muerte a la vida\r\n','2017-08-11 13:26:04',7,49,1),(20,'pirulín','2017-08-13 23:52:48',5,49,1),(21,'jiji','2017-10-07 07:20:12',1,54,1),(22,'Wena choro','2017-11-21 17:01:25',1,50,1),(23,'si?','2017-11-21 20:57:37',1,73,1),(24,'Funcionas?','2017-11-21 20:58:46',1,71,1),(25,'Si, que weno','2017-11-21 20:58:54',1,71,1),(26,'lugar','2017-11-21 21:12:19',1,55,1),(27,'vamo a ver','2017-11-21 21:12:34',1,49,1),(28,'SAIK','2017-11-21 21:12:43',1,55,1),(29,'SAIK','2017-11-21 21:12:43',1,55,1),(30,'SAIK','2017-11-21 21:12:43',1,55,1),(31,'no','2017-11-21 21:13:16',1,73,1),(32,'nein','2017-11-21 21:13:23',1,60,1),(33,'jaja','2017-11-21 21:13:29',1,73,1),(34,'jaja','2017-11-21 21:13:29',1,73,1),(35,'jaja','2017-11-21 21:13:29',1,73,1),(36,'nonono','2017-11-21 21:16:03',1,69,1),(37,'naraná','2017-11-21 21:16:22',1,54,1),(38,'nanananna','2017-11-21 21:16:29',1,69,1),(39,'nanananna','2017-11-21 21:16:29',1,69,1),(40,'nanananna','2017-11-21 21:16:29',1,69,1),(41,'yapos','2017-11-21 21:18:04',1,64,1),(42,'workea','2017-11-21 21:18:19',1,54,1),(43,'se juntaban','2017-11-21 21:18:27',1,64,1),(44,'poder contar','2017-11-21 21:18:40',1,54,1),(45,'yea\n','2017-11-22 09:50:01',5,29,1),(46,'oh si','2017-11-22 09:50:10',5,71,1),(47,'jajá','2017-11-22 10:10:31',5,75,1),(48,'jeje','2017-11-22 13:41:43',1,75,1),(49,'wuju','2017-11-22 14:00:43',1,75,1),(50,'yupi','2017-11-22 14:02:57',1,62,1),(51,'si?','2017-11-22 14:03:18',1,64,1),(52,'la wea chora','2017-11-22 14:03:37',1,17,1),(53,'wena, que bacán todo me gusta el pan con palta y la mermelá de mora, el queso y jam+ón junts ojalá en el microondas para poder hacer deretido y ojalaá tostaralo un poco y todas esas cutiones que vos cachai','2018-10-22 13:09:47',1,91,1),(54,'hola','2018-10-22 13:11:33',1,91,1),(55,'','2018-10-22 13:26:36',1,91,1),(56,'','2018-10-22 13:26:45',1,91,1);
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentinterno`
--

DROP TABLE IF EXISTS `comentinterno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentinterno` (
  `idcomentinterno` int(11) NOT NULL AUTO_INCREMENT,
  `texto` mediumtext NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idpost` int(11) NOT NULL,
  `iduser` int(11) NOT NULL,
  PRIMARY KEY (`idcomentinterno`),
  KEY `fk_comentinterno_postinterno1_idx` (`idpost`),
  KEY `fk_comentinterno_user1_idx` (`iduser`),
  CONSTRAINT `fk_comentinterno_postinterno1` FOREIGN KEY (`idpost`) REFERENCES `postinterno` (`idpostinterno`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentinterno_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentinterno`
--

LOCK TABLES `comentinterno` WRITE;
/*!40000 ALTER TABLE `comentinterno` DISABLE KEYS */;
INSERT INTO `comentinterno` VALUES (1,'ya','2017-09-12 02:59:19',8,1),(2,'jeje','2017-09-12 02:59:34',9,1),(3,'ya weno, seré el primero porque me lo dijo esta página web','2017-09-12 03:26:36',10,1),(4,'ya oka','2017-09-12 03:28:21',8,1),(5,'me parece muy interesante tu comentario, pero creo que le faltan mas memes','2017-09-12 03:30:36',10,7),(6,'en volá un loro','2017-09-12 03:31:54',11,7),(7,'aaaaaa','2017-09-12 03:33:23',11,7),(8,'aaaaaa','2017-09-12 03:34:32',11,7),(9,'ajá','2017-09-12 03:36:22',11,7),(10,'llon','2017-09-12 03:48:16',9,7),(11,'yuju','2017-10-07 10:41:50',19,1),(12,'jojo','2017-10-11 19:18:36',18,1),(13,'wat, maldito internet explorer','2017-10-25 14:21:37',23,1);
/*!40000 ALTER TABLE `comentinterno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etapa`
--

DROP TABLE IF EXISTS `etapa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `etapa` (
  `idetapa` int(11) NOT NULL AUTO_INCREMENT,
  `token` mediumtext,
  `nro` int(11) NOT NULL,
  `idevento` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idetapa`),
  KEY `fk_etapa_evento1_idx` (`idevento`),
  CONSTRAINT `fk_etapa_evento1` FOREIGN KEY (`idevento`) REFERENCES `evento` (`idevento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etapa`
--

LOCK TABLES `etapa` WRITE;
/*!40000 ALTER TABLE `etapa` DISABLE KEYS */;
INSERT INTO `etapa` VALUES (1,'2&&3',1,4,'1'),(2,'5&&6',2,4,'4'),(3,'Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1,1,'Problema'),(4,'¿Cómo definirían el impacto social de su proyecto?&&¿Quién o quiénes serán los/as beneficiarios/as?',2,1,'Quien-Quienes viven el problema.'),(5,'¿Cómo esperan financiar su proyecto?&&¿Cómo se espera asegurar su financiamiento futuro?',3,1,'Financiar el proyecto'),(6,'2&&3',1,5,'1'),(7,'5&&6',2,5,'4'),(8,'8&&9',3,5,'7');
/*!40000 ALTER TABLE `etapa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evento` (
  `idevento` int(11) NOT NULL AUTO_INCREMENT,
  `etapas` int(11) DEFAULT NULL,
  `likes` int(11) DEFAULT NULL,
  `nuevos` int(11) DEFAULT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idevento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (1,3,1,1,'zero'),(4,2,1,1,'asd'),(5,3,4,2,'reconstruyamos vitacura');
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institucion`
--

DROP TABLE IF EXISTS `institucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institucion` (
  `idinstitucion` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(80) NOT NULL,
  `correo` varchar(40) NOT NULL,
  `fono` varchar(12) NOT NULL,
  `comuna` varchar(45) DEFAULT NULL,
  `avatar_pat` mediumtext,
  `direccion` varchar(45) DEFAULT NULL,
  `idmonitor` int(11) DEFAULT NULL,
  PRIMARY KEY (`idinstitucion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institucion`
--

LOCK TABLES `institucion` WRITE;
/*!40000 ALTER TABLE `institucion` DISABLE KEYS */;
INSERT INTO `institucion` VALUES (1,'Colegio 32','JAJÁ','ÑEÑE','vitacura','/assets/img/placeholder.png','',NULL),(2,'colegio 3','hola@123.cl','92929992','vitacura','/assets/img/placeholder.png','alla 742',NULL),(3,'wat','1233333@r.com','123123','','/assets/img/placeholder.png','',NULL);
/*!40000 ALTER TABLE `institucion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `megusta`
--

DROP TABLE IF EXISTS `megusta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `megusta` (
  `iduser` int(11) NOT NULL,
  `idpost` int(10) unsigned NOT NULL,
  PRIMARY KEY (`iduser`,`idpost`),
  KEY `fk_megusta_user1_idx` (`iduser`),
  KEY `fk_megusta_post1_idx` (`idpost`),
  CONSTRAINT `fk_megusta_post1` FOREIGN KEY (`idpost`) REFERENCES `post` (`idpost`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_megusta_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `megusta`
--

LOCK TABLES `megusta` WRITE;
/*!40000 ALTER TABLE `megusta` DISABLE KEYS */;
INSERT INTO `megusta` VALUES (1,10),(1,13),(1,14),(1,25),(1,29),(1,41),(1,45),(1,46),(1,50),(1,54),(1,55),(1,60),(1,69),(1,71),(1,73),(1,93),(2,9),(2,10),(2,13),(2,14),(2,16),(2,17),(2,19),(3,19),(3,50),(3,60),(5,19),(5,49),(5,71),(7,17),(7,19),(8,19),(9,17),(9,19),(15,19),(16,19),(17,19),(18,19);
/*!40000 ALTER TABLE `megusta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `monitor` (
  `idmonitor` int(11) NOT NULL,
  `idobservatorio` int(10) unsigned NOT NULL,
  `f_inscripcion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmonitor`,`idobservatorio`),
  KEY `fk_user_has_observatorio_observatorio1_idx` (`idobservatorio`),
  KEY `fk_user_has_observatorio_user1_idx` (`idmonitor`),
  CONSTRAINT `fk_user_has_observatorio_observatorio1` FOREIGN KEY (`idobservatorio`) REFERENCES `observatorio` (`idobservatorio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_observatorio_user1` FOREIGN KEY (`idmonitor`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitor`
--

LOCK TABLES `monitor` WRITE;
/*!40000 ALTER TABLE `monitor` DISABLE KEYS */;
INSERT INTO `monitor` VALUES (5,1,'2018-10-01 18:21:36'),(5,2,'2018-10-18 15:45:44'),(16,5,'2018-10-01 19:48:04'),(21,2,'2018-09-27 13:26:29'),(21,5,'2018-09-27 13:26:02');
/*!40000 ALTER TABLE `monitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificacion` (
  `idnotificacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idnotificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,'fa2@109582@52@2018-10-16 12:44:43@19@1',0),(2,'fa2@109584@78@2018-10-16 12:45:10@20@1',0),(3,'fa2@109586@34@2018-10-16 12:45:19@21@1',0),(4,'fa2@109587@102@2018-10-16 12:45:32@22@1',0),(5,'fa3@109582@46@2018-10-16 12:55:49@19@1',0),(6,'fa3@109584@70@2018-10-16 12:56:02@20@1',0),(7,'fa3@109586@20@2018-10-16 12:56:25@21@1',0),(8,'fa3@109587@60@2018-10-16 12:56:34@22@1',0),(9,'fa3@109602@8@2018-10-16 12:56:43@27@1',0),(10,'fa4@109582@56@2018-10-16 12:57:05@19@1',0),(11,'fa4@109584@60@2018-10-16 12:57:20@20@1',0),(12,'fa4@109586@20@2018-10-16 12:57:28@21@1',0),(13,'fa4@109587@60@2018-10-16 12:57:42@22@1',0),(14,'fa5@109584@25@2018-10-16 12:58:43@20@1',0),(15,'fa5@109587@56@2018-10-16 12:59:11@22@1',0),(16,'fa2@109582@52@2018-10-16 13:12:40@19@1',0),(17,'fa2@109584@78@2018-10-16 13:12:52@20@1',0),(18,'fa2@109586@34@2018-10-16 13:13:01@21@1',0),(19,'fa2@109587@102@2018-10-16 13:13:10@22@1',0),(20,'fa3@109582@46@2018-10-16 13:13:30@19@1',0),(21,'fa3@109584@70@2018-10-16 13:13:37@20@1',0),(22,'fa3@109586@20@2018-10-16 13:13:54@21@1',0),(23,'fa3@109587@60@2018-10-16 13:14:06@22@1',0),(24,'fa5@109584@25@2018-10-16 13:15:09@20@1',1),(25,'fa2@109582@52@2018-10-16 13:22:33@19@1',0),(26,'fa2@109584@78@2018-10-16 13:22:40@20@1',0),(27,'fa2@109586@34@2018-10-16 13:22:56@21@1',0),(28,'fa2@109587@102@2018-10-16 13:23:09@22@1',0),(29,'fa3@109582@46@2018-10-16 13:24:19@19@1',0),(30,'fa3@109584@70@2018-10-16 13:24:28@20@1',0),(31,'fa3@109586@20@2018-10-16 13:24:37@21@1',0),(32,'fa3@109587@60@2018-10-16 13:24:54@22@1',0),(33,'fa3@109602@8@2018-10-16 13:25:06@27@1',0),(34,'fa5@109582@56@2018-10-16 13:25:45@19@1',1),(35,'fa5@109584@60@2018-10-16 13:26:01@20@1',1),(36,'fa5@109586@20@2018-10-16 13:26:24@21@1',1),(37,'fa5@109587@60@2018-10-16 13:26:41@22@1',1),(38,'fa7@109584@25@2018-10-16 13:27:31@20@1',1),(39,'aof@10517-Sin OC@2018-10-19 22:41:33',0),(40,'aof@10518-Sin OC@2018-10-19 22:43:44',0),(41,'aoc@1254@2018-10-21 03:19:26',0),(42,'aof@10519-CODELCO@2018-10-21 03:19:26',0),(43,'fa2@109501@50@2018-10-21 03:59:27@3@2',0),(44,'jfp@109501@5@2018-10-21 04:00:10@3@2@Menos@2',0),(45,'fa1@109501@5@2018-10-21 04:01:34@3@2',1),(46,'aof@7994-ACERES@2018-10-23 14:08:37',1),(47,'aof@7995-ACERES@2018-10-23 14:22:13',1),(48,'aof@7996-Sin OC@2018-10-23 14:28:07',1),(49,'aof@7997-Sin OC@2018-10-23 14:29:30',1);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observatorio`
--

DROP TABLE IF EXISTS `observatorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `observatorio` (
  `idobservatorio` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idinst` int(10) unsigned NOT NULL,
  `max` int(11) NOT NULL,
  `avatar_pat` mediumtext,
  `nom` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` int(11) NOT NULL DEFAULT '1',
  `idevento` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idobservatorio`),
  UNIQUE KEY `idobservatorio_UNIQUE` (`idobservatorio`),
  KEY `fk_observatorio_institucion_idx` (`idinst`),
  KEY `fk_observatorio_evento1` (`idevento`),
  CONSTRAINT `fk_observatorio_evento1` FOREIGN KEY (`idevento`) REFERENCES `evento` (`idevento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_observatorio_institucion` FOREIGN KEY (`idinst`) REFERENCES `institucion` (`idinstitucion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observatorio`
--

LOCK TABLES `observatorio` WRITE;
/*!40000 ALTER TABLE `observatorio` DISABLE KEYS */;
INSERT INTO `observatorio` VALUES (1,1,23,'/assets/img/placeholder.png','obs1','2017-07-27 01:41:59',1,4),(2,1,222,'/assets/img/placeholder.png','asd','2017-07-27 02:07:56',1,5),(3,2,40,'/assets/img/placeholder.png','obs 3','2017-07-27 15:11:19',3,4),(4,3,1,'/assets/img/placeholder.png','test','2017-07-28 13:27:49',3,4),(5,1,2,'/assets/img/placeholder.png','test2','2017-07-28 15:45:41',1,4),(6,1,22,'/assets/img/placeholder.png','aaaaaaaayua','2018-09-27 14:25:07',1,1),(7,2,20,'/assets/img/placeholder.png','jejejeje','2018-09-27 15:39:30',1,1),(8,1,12,'/assets/img/placeholder.png','aaaaaaaayua2','2018-09-27 15:55:03',1,1),(9,2,20,'/assets/img/placeholder.png','weaita','2018-09-27 15:56:00',1,1),(10,2,11,'/assets/img/placeholder.png','weaita2','2018-09-27 15:56:14',1,1);
/*!40000 ALTER TABLE `observatorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `idpost` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `iduser` int(11) NOT NULL,
  `tipo` int(10) unsigned NOT NULL,
  `t_principal` varchar(300) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT '1',
  `contenido` mediumtext,
  `tags` varchar(320) DEFAULT NULL,
  `idobs` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`idpost`),
  KEY `fk_post_user1_idx` (`iduser`),
  KEY `fk_post_obs1_idx` (`idobs`),
  CONSTRAINT `fk_post_obs1` FOREIGN KEY (`idobs`) REFERENCES `observatorio` (`idobservatorio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_post_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'2017-07-13 20:52:41',1,1,'TENGO UNA IDEA SIN TAGS',2,NULL,'idea',1),(2,'2017-07-13 20:53:00',1,1,'AHORA CON',2,NULL,'este es el tag',1),(3,'2017-07-13 21:00:52',2,1,'SI?',2,NULL,'idea',4),(8,'2017-07-13 21:44:32',2,1,'paz mundial',2,NULL,'idea',4),(9,'2017-07-13 21:44:43',2,1,'paz mundial',2,NULL,'paratodos',1),(10,'2017-07-13 21:45:00',2,1,'hmmm',2,NULL,'si,mamam,amam',1),(11,'2017-07-13 21:45:13',2,2,'yia',2,'adsdasdsdasdasdas','',1),(12,'2017-07-13 21:47:13',2,2,'yia?',2,'FIN','',4),(14,'2017-07-13 21:48:37',2,2,'aja',2,NULL,'',4),(15,'2017-07-14 11:48:04',1,2,'ads',2,'sddsds','',1),(16,'2017-07-14 11:48:21',1,3,'penita',2,'adsdasdas','',4),(17,'2017-07-14 14:06:01',1,2,'pena',2,'rayos','caritatriste',1),(18,'2017-07-27 13:36:57',7,2,'que viva la revolución',2,'revolucion123','puntoceele',4),(19,'2017-08-03 18:38:05',3,1,'Viva la revolucionasddsd',2,NULL,'idea',4),(20,'2017-08-03 18:38:13',3,1,'pena',3,NULL,'asdsdasadsda',4),(21,'2017-08-03 18:38:37',3,1,'jueue',2,NULL,'hola,comotay',1),(22,'2017-08-03 18:38:47',3,2,'wat',2,'JJA','',1),(23,'2017-08-03 19:35:50',3,2,'John',2,'&lt;img src=\"/assets/img/placeholder.png\" &gt;&lt;/img&gt;<p>&lt;h1&gt; VIVA LA REVOLUCION CUBANA&lt;/h1&gt;</p>','html',1),(24,'2017-08-03 21:35:28',3,2,'Pena',3,'triteza','',4),(25,'2017-08-03 21:38:06',3,1,'asd',2,NULL,'idea',1),(26,'2017-08-03 21:38:19',3,2,'asdasd',3,'dddd','',4),(27,'2017-08-04 14:24:44',3,2,'hola',2,'jejeje','',1),(28,'2017-08-04 14:28:12',3,1,'jejeje',3,NULL,'idea',4),(29,'2017-08-04 14:41:10',3,2,'titulo',2,'categoria','si',1),(30,'2017-08-04 14:42:01',3,2,'otro',3,'jeje','',4),(31,'2017-08-05 20:29:00',15,2,'titulo',3,'sasaas','',4),(32,'2017-08-07 03:28:02',1,1,'jeje',3,NULL,'idea',2),(33,'2017-08-13 22:27:24',1,2,'equisde',3,'dededede','',2),(34,'2017-08-07 03:30:16',9,1,'mmuaajajaj',3,NULL,'idea',2),(35,'2017-08-07 03:30:25',9,2,'libre',3,'alfin','',2),(36,'2017-08-07 03:30:40',9,3,'https://68.media.tumblr.com/f062a85cf4879f7987f9c8facb91fe04/tumblr_n73fw3ruIP1qinsqio7_540.jpg',3,'aasaassasa','',2),(37,'2017-08-07 04:22:18',9,2,'wat',3,'assa','',2),(38,'2017-08-07 04:24:47',9,2,'pena',3,'muajaja','',2),(39,'2017-08-07 04:25:12',9,3,'https://68.media.tumblr.com/a55e26b59938de1de324c102b93233a4/tumblr_inline_ou9az9GWlP1qigpam_540.png',3,'jajajaja','',2),(40,'2017-08-07 04:26:03',9,2,'https://68.media.tumblr.com/a55e26b59938de1de324c102b93233a4/tumblr_inline_ou9az9GWlP1qigpam_540.png',3,'juajaa','',2),(41,'2017-08-07 04:26:24',9,3,'https://68.media.tumblr.com/a55e26b59938de1de324c102b93233a4/tumblr_inline_ou9az9GWlP1qigpam_540.png',2,'addadada','',2),(42,'2017-08-07 04:26:44',9,3,'https://68.media.tumblr.com/a55e26b59938de1de324c102b93233a4/tumblr_inline_ou9az9GWlP1qigpam_540.png',3,'ddadaad','',2),(43,'2017-08-07 13:56:38',9,2,'como',2,'asdsaddasd','',2),(45,'2017-08-07 14:01:17',9,2,'DASSAD',2,'DSDSDS','',2),(46,'2017-08-07 14:04:44',9,2,'1',2,'2','',2),(47,'2017-08-07 14:02:28',9,2,'2',3,'3','',2),(48,'2017-08-07 14:02:34',9,2,'3',2,'4','',2),(49,'2017-08-07 14:38:48',1,2,'prueba html',2,'<b>MAUAJAJA</b><p><ul><li><b>uno</b></li><li><b>dos</b></li><li><b>tres</b></li></ul></p>','',2),(50,'2017-09-10 20:29:05',1,2,'html test23',2,'<b>adssadadsads</b><p><b><span style=\"font-size:18px;\">JAJAJAJA</span></p><p><ol><li><b>when</b></li><li><b>you</b></li><li><b>try</b></li><li><b>your</b></li><li><b>best</b></li></ol></p>','',2),(51,'2017-08-07 15:30:01',9,2,'que onda',3,'microonda','',2),(53,'2017-09-10 20:29:07',1,3,'/web-img/2017-08-111548121.jpg',2,'hola','',2),(54,'2017-09-10 20:31:00',1,3,'/web-img/2017-08-132230281.jpg',2,'mira la luna','asd,aho',3),(55,'2017-09-10 20:31:01',1,2,'jeje',2,'jojo','',3),(56,'2017-08-14 16:34:34',1,1,'eso?',1,NULL,'idea',3),(57,'2017-10-16 10:16:12',1,1,'ahora?',2,NULL,'idea',3),(58,'2017-10-16 10:16:11',1,1,'jasjdjasjd',2,NULL,'idea',3),(60,'2017-09-10 20:31:03',1,2,'aaaa',2,'no mas pobreza<p><br></p>','',3),(61,'2017-10-16 10:16:55',1,2,'aaa',2,'wat','',3),(62,'2017-10-16 10:16:08',1,1,'Pizzi charlatan!',2,NULL,'idea',2),(63,'2017-10-22 20:43:12',1,2,'<aasa',2,NULL,'',2),(64,'2017-10-16 10:16:09',1,1,'muerte',2,NULL,'idea',2),(65,'2017-10-16 11:47:36',1,2,'dddd',3,'sdsdsdsdsd','',2),(66,'2017-10-16 11:58:29',1,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8hp1oXyEPZ0w1QkvZYeZyW5WF0n8uWhQChUDg4RQaCtFVfGLMA',3,'adadssda','',2),(67,'2017-10-22 20:43:12',1,2,'educacion',2,'si','',2),(68,'2017-10-22 20:43:11',1,2,'mas educacion',2,'es importante','',2),(69,'2017-10-22 20:43:14',1,2,'si saber no es un derecho seguro será izquirdo',2,'jaá','',2),(71,'2017-10-28 22:44:57',8,2,'asdd',2,'ddddd','',2),(72,'2017-10-28 22:44:00',8,1,'f',1,NULL,'idea',2),(73,'2017-10-28 22:44:58',8,2,'ff',2,'asdd','',2),(74,'2017-11-21 23:26:14',8,2,'asdd',2,NULL,'p',2),(75,'2017-11-21 23:26:17',8,2,'aaaaaaa',2,NULL,'p',2),(76,'2017-11-26 12:57:06',1,1,'PORFAVOR DIOSITO',1,NULL,'idea',2),(77,'2017-11-26 12:59:37',1,1,'TANANANá',1,NULL,'idea',2),(80,'2018-06-18 17:06:09',1,4,'sGksSNvrS-s',3,'ssssss','',2),(88,'2018-09-27 16:18:30',1,4,'<iframe src=\"//www.youtube.com/embed/8Roq0lI1C_c\" width=\"100%\" height=\"536\" frameborder=\"0\" allowfullscreen></iframe>',2,NULL,'',2),(89,'2018-10-18 15:51:15',1,3,'http://localhost:8080/web-img/2017-08-111551431.jpg',2,NULL,'',2),(90,'2018-09-13 17:16:47',5,4,'<iframe src=\"//www.youtube.com/embed/p5YsgGNlcGY\" width=\"100%\" height=\"536\" frameborder=\"0\" allowfullscreen></iframe>',2,NULL,'',3),(91,'2018-10-18 15:57:56',1,2,'paz mundial',2,'Escribo','',2),(92,'2018-10-18 15:43:50',1,1,'asdddd',1,NULL,'idea',2),(93,'2018-10-18 15:56:16',1,3,'https://static.wixstatic.com/media/78b389_d122aafd79a34bc19b4973d0f057ac7c~mv2_d_5202_3465_s_4_2.jpg/v1/fill/w_300,h_200,al_c,q_80,usm_0.66_1.00_0.01/78b389_d122aafd79a34bc19b4973d0f057ac7c~mv2_d_5202_3465_s_4_2.webp',2,NULL,'',2);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postinterno`
--

DROP TABLE IF EXISTS `postinterno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postinterno` (
  `idpostinterno` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `laiks` varchar(100) DEFAULT NULL,
  `idproyecto` int(11) NOT NULL,
  `texto1` mediumtext,
  `texto2` mediumtext,
  `token` varchar(200) DEFAULT NULL,
  `iduser` int(11) NOT NULL,
  PRIMARY KEY (`idpostinterno`),
  KEY `fk_postinterno_proyecto1_idx` (`idproyecto`),
  KEY `fk_postinterno_user1_idx` (`iduser`),
  CONSTRAINT `fk_postinterno_proyecto1` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_postinterno_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postinterno`
--

LOCK TABLES `postinterno` WRITE;
/*!40000 ALTER TABLE `postinterno` DISABLE KEYS */;
INSERT INTO `postinterno` VALUES (1,2,'2017-09-07 06:26:56','&7&',6,'jejej','muajajaj','6&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 04:22:33',1),(2,2,'2017-09-07 06:29:24','&7&',6,'12','ya?','7&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 04:22:45',1),(3,2,'2017-09-07 06:36:27','fin',6,'12','este es mas lindo','7&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 04:22:45',1),(4,2,'2017-09-07 06:37:48','fin',6,'5','y ete?','5&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 04:21:47',1),(5,1,'2017-09-07 09:30:35',NULL,6,'hmmm','','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias)&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado',1),(6,3,'2017-09-07 09:30:49','fin',6,'kk','su propio peso<p><br></p>','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias)&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado',1),(7,2,'2017-09-07 09:37:03','fin',6,'jejej','jjojojoj','6&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 04:22:33',1),(8,3,'2017-09-10 20:06:35','fin',2,'muajaja','el peo es lindo','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias)&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado',1),(9,1,'2017-09-10 20:09:31',NULL,2,'?','','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias)&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado',1),(10,3,'2017-09-10 20:09:59','fin',2,'si?','kike?','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias)&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado',1),(11,2,'2017-09-12 03:31:37','fin',15,'y un gato?','prefiero los perritos','10&&jeje&&/web-img/2017-08-111551431.jpg&&2017-09-04 02:46:36',7),(12,2,'2017-09-12 03:33:04','fin',15,'y un guau guau?','pff no vi esto antes','12&&jeje&&/web-img/2017-08-111551431.jpg&&2017-09-04 02:47:56',7),(13,2,'2017-09-24 23:48:25','fin',11,'nueva','jejejejejeje','9&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 13:35:15',1),(14,3,'2017-09-25 00:15:19','&7&',2,'ya','bueno','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(15,5,'2017-09-26 10:03:51','fin',16,'ye','ye','2&&3',1),(16,2,'2017-09-26 10:04:54','fin',16,'escógeme','weno','13&&llon&&/web-img/2017-08-111503087.jpg&&2017-09-26 10:04:26',1),(17,4,'2017-09-26 10:09:04','fin',16,'ah?','que','2&&3',1),(18,5,'2017-09-26 12:22:38','fin',15,'avancems','si','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(19,4,'2017-09-26 12:25:54','fin',15,'nuevo avance','evento','2&&3',7),(20,2,'2017-10-07 10:44:22','&1&',11,'nueva','já','9&&llon&&/web-img/2017-08-111503087.jpg&&2017-08-31 13:35:15',1),(21,2,'2017-10-13 22:48:55','fin',19,'yo quiero un laik','si me gusta','14&&mcklein&&/assets/img/placeholder.png&&2017-10-13 22:47:25',1),(22,4,'2017-10-14 15:39:56','fin',19,'aja','aja','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',8),(23,3,'2017-10-16 10:40:23','&1&',19,'asdddd','dedededed','¿Cómo esperan financiar su proyecto?&&¿Cómo se espera asegurar su financiamiento futuro?',1),(24,2,'2017-10-16 10:56:26','fin',19,'Explota!','el es choro<p><br></p>','15&&jijo&&/web-img/2017-08-181955235.jpg&&2017-10-16 10:20:37',1),(25,2,'2017-10-24 12:35:20','fin',15,'y un gato?','','10&&jeje&&/web-img/2017-08-111551431.jpg&&2017-09-04 02:46:36',1),(26,2,'2017-10-24 17:09:43','fin',15,'yo quiero ser útil','es útil','16&&mcklein&&/assets/img/placeholder.png&&2017-10-24 17:09:29',1),(27,2,'2017-10-24 17:11:44','fin',15,'yo quiero ser útil','ahora?','16&&mcklein&&/assets/img/placeholder.png&&2017-10-24 17:09:29',1),(28,2,'2017-10-24 17:12:54','fin',15,'yo quiero ser útil','inútil','16&&mcklein&&/assets/img/placeholder.png&&2017-10-24 17:09:29',7),(29,2,'2017-10-24 17:16:47','fin',15,'yo quiero ser útil','','16&&mcklein&&/assets/img/placeholder.png&&2017-10-24 17:09:29',1),(30,2,'2017-10-24 17:17:26','fin',15,'yo quiero ser útil','','16&&mcklein&&/assets/img/placeholder.png&&2017-10-24 17:09:29',7),(31,5,'2017-10-24 22:45:50','fin',15,'avancemos plis','porfis','5&&6',1),(32,5,'2017-10-24 23:54:21','fin',15,'asddas','adssad','5&&6',7),(33,4,'2017-10-25 01:01:55','fin',15,'asddsa','adsdsaads','5&&6',7),(34,2,'2017-10-26 00:33:40','fin',20,'vamos que se puede','si','17&&llon&&/web-img/2017-08-111503087.jpg&&2017-10-26 00:33:20',1),(35,2,'2017-10-26 00:35:32','fin',20,'vamos que se puede','2','17&&llon&&/web-img/2017-08-111503087.jpg&&2017-10-26 00:33:20',1),(36,3,'2017-10-26 02:02:10','fin',20,'dale','si','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(37,3,'2017-10-26 02:06:46','fin',20,'wat','wat','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(38,3,'2017-10-26 02:09:53','fin',20,'otro','jeje','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(39,3,'2017-10-26 02:16:02','fin',20,'sdsd','asd','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(40,3,'2017-10-26 02:24:33','fin',20,'asd','ddd','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(41,5,'2017-10-26 02:25:06','fin',20,'duh','gil','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',1),(42,3,'2017-10-26 02:25:29','fin',20,'denuevo','tonto','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',7),(43,5,'2017-10-26 02:26:14','fin',20,'asd','dddd','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',7),(44,4,'2017-10-26 02:27:56','fin',20,'asddddd','dddd','Describa la situación y/o problema que aborda el proyecto (causas y consecuencias).&&Señale cómo cambiará o incidirá el proyecto en cambiar la situación y/o problema identificado.',7),(45,3,'2017-10-27 23:15:06','&1&',16,'sss','ssssssss','5&&6',1),(46,4,'2017-11-21 17:15:53','fin',20,'bueno','todos','¿Cómo definirían el impacto social de su proyecto?&&¿Quién o quiénes serán los/as beneficiarios/as?',1),(47,2,'2018-09-27 17:04:49','&1&',19,'yo quiero un laik','esta solcuoon me gusta mucho','14&&mcklein&&/assets/img/placeholder.png&&2017-10-13 22:47:25',1),(48,3,'2018-09-27 17:08:53','&1&',16,'este avance me gusta','este tambien','5&&6',1),(49,2,'2018-09-27 17:10:17','fin',18,'tengos hermanos tambien<p><br></p>','','18&&jeje&&/web-img/2017-08-111551431.jpg&&2018-09-27 17:03:49',7),(50,3,'2018-09-27 17:10:35',NULL,18,'4','6','2&&3',7),(51,2,'2018-10-08 00:09:28','fin',20,'yo cacho que is se puede','wenon','19&&mcklein&&/assets/img/placeholder.png&&2018-10-08 00:09:16',7),(52,2,'2018-10-18 13:47:35','fin',17,'yo quiero aportar algo<p><br></p>','','20&&jeje&&/web-img/2017-08-111551431.jpg&&2018-10-18 13:45:15',7),(53,2,'2018-10-18 13:50:55','fin',21,'Aportemos a la paz','','21&&llon&&/web-img/2017-08-111503087.jpg&&2018-10-18 13:49:52',1);
/*!40000 ALTER TABLE `postinterno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyecto`
--

DROP TABLE IF EXISTS `proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proyecto` (
  `idproyecto` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) DEFAULT NULL,
  `descripcion` mediumtext,
  `problema` varchar(140) DEFAULT NULL,
  `etapa` int(11) NOT NULL DEFAULT '1',
  `creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idcreador` int(11) DEFAULT NULL,
  `media` varchar(500) NOT NULL DEFAULT 'no',
  `idevento` int(11) NOT NULL DEFAULT '1',
  `gotlaik` int(1) NOT NULL DEFAULT '0',
  `gotuser` int(1) NOT NULL DEFAULT '0',
  `idobservatorio` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`idproyecto`),
  KEY `fk_proyecto_user1` (`idcreador`),
  KEY `fk_proyecto_evento` (`idevento`),
  KEY `fk_proyecto_obs` (`idobservatorio`),
  CONSTRAINT `fk_proyecto_evento1` FOREIGN KEY (`idevento`) REFERENCES `evento` (`idevento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_proyecto_obs1` FOREIGN KEY (`idobservatorio`) REFERENCES `observatorio` (`idobservatorio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_proyecto_user1` FOREIGN KEY (`idcreador`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyecto`
--

LOCK TABLES `proyecto` WRITE;
/*!40000 ALTER TABLE `proyecto` DISABLE KEYS */;
INSERT INTO `proyecto` VALUES (1,'Perro pieda','vida submarina, el perro era tiburón todo este tiempo','le gustan mucho las piedras',1,'2017-08-18 18:05:46','2017-08-18 18:05:46',1,'no',1,0,0,2),(2,'ads','sdd','ddddd',1,'2017-08-18 18:06:32','2017-08-31 04:39:20',1,'/web-img/2017-08-181806241.jpg',1,0,0,2),(3,'asddd','asdadsdas','dsds',1,'2017-08-18 18:06:56','2017-08-18 18:06:56',1,'/web-img/2017-08-181806481.jpg',1,0,0,2),(4,'jo','asddsa','ka',1,'2017-08-18 19:11:36','2017-08-18 19:11:36',1,'/web-img/2017-08-181911271.jpg',1,0,0,2),(5,'sad','asdd','ds',1,'2017-08-18 19:13:26','2017-08-18 19:13:26',1,'/web-img/2017-08-181913201.jpg',1,0,0,2),(6,'asd','asdd','asd',1,'2017-08-18 19:13:51','2017-08-31 01:44:21',1,'/web-img/2017-08-181913451.jpg',1,0,0,2),(7,'das','asdddd','dssd',1,'2017-08-18 19:14:29','2017-08-18 19:14:29',5,'no',1,0,0,2),(8,'asddd','asddd','ddddd',1,'2017-08-18 19:15:07','2017-08-18 19:15:07',5,'/web-img/2017-08-181914595.jpg',1,0,0,2),(9,'sdd','asddd','ddd',1,'2017-08-18 19:16:08','2017-08-18 19:16:08',5,'/web-img/2017-08-181916015.jpg',1,0,0,2),(10,'ddd','asasd','sd',1,'2017-08-18 19:17:48','2017-08-18 19:17:48',5,'/web-img/2017-08-181917415.jpg',1,0,0,2),(11,'La aventura lego','jejeje xd','legos necesitan mas amor',1,'2017-08-29 12:29:00','2017-08-29 12:29:00',1,'no',1,0,0,2),(12,'asd','sss','ds',1,'2017-08-29 12:30:40','2017-08-29 12:30:40',1,'no',1,0,0,2),(13,'SI?','aaaa','d',1,'2017-08-29 12:32:51','2017-08-29 12:32:51',1,'no',1,0,0,2),(14,'yapo','onda','que',1,'2017-08-29 12:38:37','2017-08-29 12:38:37',1,'no',1,0,0,2),(15,'que tal si hacemos un muñeco','elsa pallo','no tiene que ser un muñeco',3,'2017-08-31 04:40:36','2017-08-31 13:33:43',7,'no',4,0,0,2),(16,'mmmm','asddd','aaa',2,'2017-09-25 01:20:37','2017-09-25 01:20:37',1,'no',4,1,0,2),(17,'mi mamá me mima','me quiere mas que el manjar colún&nbsp;','Sería bueno que todas las mamas mimaran a todos',1,'2017-09-26 10:25:59','2017-09-26 10:25:59',7,'no',4,0,1,2),(18,'Mis hermanos son bacanes','si hay dia del padre y de la madre, porqué no del hermano?','Debería existir un día del hermano',1,'2017-09-26 10:27:49','2017-09-26 10:27:49',7,'no',4,1,1,2),(19,'un laik','jeje','para mi',3,'2017-09-26 12:21:36','2017-10-13 10:41:15',1,'no',1,1,1,2),(20,'ahora','jajap','si?',3,'2017-10-22 19:53:14','2018-10-04 17:39:02',1,'no',1,0,0,2),(21,'paz mundial','cualquier cosa','esta sucio',1,'2018-09-27 17:02:36','2018-09-27 17:02:36',1,'no',5,0,1,2);
/*!40000 ALTER TABLE `proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proylike`
--

DROP TABLE IF EXISTS `proylike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proylike` (
  `iduser` int(11) NOT NULL,
  `idproyecto` int(11) NOT NULL,
  PRIMARY KEY (`iduser`,`idproyecto`),
  KEY `fk_user_has_proyecto_proyecto2_idx` (`idproyecto`),
  KEY `fk_user_has_proyecto_user2_idx` (`iduser`),
  CONSTRAINT `fk_user_has_proyecto_proyecto2` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_proyecto_user2` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proylike`
--

LOCK TABLES `proylike` WRITE;
/*!40000 ALTER TABLE `proylike` DISABLE KEYS */;
INSERT INTO `proylike` VALUES (5,1),(1,2),(5,4),(1,6),(5,7),(7,12),(1,15),(5,15),(7,15),(1,16),(7,16),(1,18),(1,19),(2,19),(3,19),(5,19),(7,19),(8,19),(9,19),(15,19),(16,19),(17,19),(18,19),(1,20),(7,20);
/*!40000 ALTER TABLE `proylike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solucion`
--

DROP TABLE IF EXISTS `solucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solucion` (
  `idsolucion` int(11) NOT NULL AUTO_INCREMENT,
  `idproyecto` int(11) NOT NULL,
  `iduser` int(11) NOT NULL,
  `contenido` mediumtext,
  `etapa` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` int(11) DEFAULT NULL,
  PRIMARY KEY (`idsolucion`),
  KEY `fk_solucion_proyecto1_idx` (`idproyecto`),
  KEY `fk_solucion_user1_idx` (`iduser`),
  CONSTRAINT `fk_solucion_proyecto1` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solucion_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solucion`
--

LOCK TABLES `solucion` WRITE;
/*!40000 ALTER TABLE `solucion` DISABLE KEYS */;
INSERT INTO `solucion` VALUES (1,6,7,'123',1,'2017-08-31 04:19:40',0),(2,6,7,'2',1,'2017-08-31 04:20:19',0),(3,6,7,'3',1,'2017-08-31 04:20:54',0),(4,6,7,'as',1,'2017-08-31 04:21:27',0),(5,6,7,'5',1,'2017-08-31 04:21:47',0),(6,6,7,'jejej',1,'2017-08-31 04:22:33',0),(7,6,7,'12',1,'2017-08-31 04:22:45',0),(8,15,1,'y una muñeca?',1,'2017-08-31 12:09:48',0),(9,11,7,'nueva',1,'2017-08-31 13:35:15',0),(10,15,1,'y un gato?',1,'2017-09-04 02:46:36',0),(11,15,1,'',1,'2017-09-04 02:47:24',0),(12,15,1,'y un guau guau?',1,'2017-09-04 02:47:56',0),(13,16,7,'escógeme',1,'2017-09-26 10:04:26',0),(14,19,8,'yo quiero un laik',1,'2017-10-13 22:47:25',0),(15,19,5,'Explota!',3,'2017-10-16 10:20:37',0),(16,15,8,'yo quiero ser útil',2,'2017-10-24 17:09:29',0),(17,20,7,'vamos que se puede',1,'2017-10-26 00:33:20',0),(18,18,1,'tengos hermanos tambien<p><br></p>',1,'2018-09-27 17:03:49',0),(19,20,8,'yo cacho que is se puede',2,'2018-10-08 00:09:16',0),(20,17,1,'yo quiero aportar algo<p><br></p>',1,'2018-10-18 13:45:15',0),(21,21,7,'Aportemos a la paz',1,'2018-10-18 13:49:52',0);
/*!40000 ALTER TABLE `solucion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tagpost`
--

DROP TABLE IF EXISTS `tagpost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tagpost` (
  `idtag` int(11) NOT NULL,
  `idpost` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idtag`,`idpost`),
  KEY `fk_tagpost_tags1_idx` (`idtag`),
  KEY `fk_tagpost_post1_idx` (`idpost`),
  CONSTRAINT `fk_tagpost_post1` FOREIGN KEY (`idpost`) REFERENCES `post` (`idpost`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tagpost_tags1` FOREIGN KEY (`idtag`) REFERENCES `tags` (`idtag`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tagpost`
--

LOCK TABLES `tagpost` WRITE;
/*!40000 ALTER TABLE `tagpost` DISABLE KEYS */;
INSERT INTO `tagpost` VALUES (18,18),(18,30),(18,31),(18,35),(18,88),(69,13),(69,41),(69,49),(69,60),(69,63),(69,67),(69,68),(69,69),(69,89),(70,39),(71,15),(71,24),(71,36),(71,43),(71,46),(71,48),(71,61),(71,65),(71,71),(71,73),(71,74),(71,75),(72,27),(74,80),(76,22),(76,50),(76,91),(76,93),(78,16),(78,29),(78,33),(78,37),(78,42),(78,51),(78,55),(78,90),(80,53),(80,54),(81,17),(81,74),(81,75),(82,14),(82,23),(82,26),(82,38),(82,40),(82,45),(82,47),(82,66),(85,29),(88,13),(89,17),(90,18),(95,23),(101,54),(102,54);
/*!40000 ALTER TABLE `tagpost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tagproyecto`
--

DROP TABLE IF EXISTS `tagproyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tagproyecto` (
  `idproyecto` int(11) NOT NULL,
  `idtag` int(11) NOT NULL,
  PRIMARY KEY (`idproyecto`,`idtag`),
  KEY `fk_proyecto_has_tags_tags1_idx` (`idtag`),
  KEY `fk_proyecto_has_tags_proyecto1_idx` (`idproyecto`),
  CONSTRAINT `fk_proyecto_has_tags_proyecto1` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_proyecto_has_tags_tags1` FOREIGN KEY (`idtag`) REFERENCES `tags` (`idtag`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tagproyecto`
--

LOCK TABLES `tagproyecto` WRITE;
/*!40000 ALTER TABLE `tagproyecto` DISABLE KEYS */;
INSERT INTO `tagproyecto` VALUES (19,18),(21,18),(14,67),(17,67),(2,68),(4,68),(6,68),(15,69),(11,70),(20,71),(3,73),(5,73),(8,75),(9,75),(12,76),(13,76),(7,78),(16,78),(1,79),(10,81),(18,82),(1,106);
/*!40000 ALTER TABLE `tagproyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `idtag` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(30) NOT NULL,
  PRIMARY KEY (`idtag`),
  UNIQUE KEY `tag_UNIQUE` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (18,'a'),(102,'aho'),(109,'alokikellamalllamallama'),(87,'amam'),(101,'asd'),(92,'asdsdasadsda'),(67,'b'),(68,'c'),(89,'caritatriste'),(94,'comotay'),(69,'d'),(70,'e'),(2,'esteeseltag'),(71,'f'),(72,'g'),(73,'h'),(93,'hola'),(95,'html'),(74,'i'),(1,'idea'),(106,'iguallegustanlaspiedras'),(75,'j'),(76,'k'),(77,'l'),(78,'m'),(86,'mamam'),(79,'n'),(80,'o'),(81,'p'),(84,'paratodos'),(90,'puntoceele'),(82,'q'),(88,'SHUERWENA'),(85,'si');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(45) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `tipo` int(1) NOT NULL DEFAULT '2',
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `fnac` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` varchar(1) DEFAULT NULL,
  `avatar_pat` varchar(300) DEFAULT '/assets/img/placeholder.png',
  `comuna` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'jijo','sider',3,'gerencia',NULL,'2017-10-05 02:53:48',NULL,NULL,NULL),(2,NULL,'faena','sider',1,'planta',NULL,'2017-10-13 01:33:06',NULL,NULL,NULL),(3,NULL,'plan','sider',1,'plan',NULL,'2017-10-18 23:41:11',NULL,NULL,NULL),(4,NULL,'dt','sider',1,'dt',NULL,'2017-10-19 00:04:04',NULL,NULL,NULL),(5,NULL,'dm','sider',3,'dm',NULL,'2017-10-19 00:07:23',NULL,NULL,NULL),(7,NULL,'bodega','sider',3,'bodega',NULL,'2017-10-31 00:00:00',NULL,NULL,NULL),(8,NULL,'abastecimiento','sider',3,'abastecimiento',NULL,'2018-03-28 09:19:32',NULL,NULL,NULL),(9,NULL,'matprimas','sider',3,'matprimas',NULL,'2018-05-03 22:54:32',NULL,NULL,NULL),(15,NULL,'jefeprod','sider',3,'jefeprod',NULL,'2017-10-31 09:50:07',NULL,NULL,NULL),(16,NULL,'llon','jojo',1,NULL,NULL,'2018-10-28 14:14:18',NULL,NULL,NULL),(21,NULL,'juju','jojo',1,NULL,NULL,'2018-10-28 14:14:18',NULL,NULL,NULL),(22,NULL,'juja','jojo',3,NULL,NULL,'2018-10-28 14:14:18',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userproyecto`
--

DROP TABLE IF EXISTS `userproyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userproyecto` (
  `iduser` int(11) NOT NULL,
  `idproyecto` int(11) NOT NULL,
  `etapa` int(11) NOT NULL DEFAULT '1',
  `flag` varchar(45) NOT NULL DEFAULT 'Colaborador',
  PRIMARY KEY (`iduser`,`idproyecto`),
  KEY `fk_user_has_proyecto_proyecto1_idx` (`idproyecto`),
  KEY `fk_user_has_proyecto_user1_idx` (`iduser`),
  CONSTRAINT `fk_user_has_proyecto_proyecto1` FOREIGN KEY (`idproyecto`) REFERENCES `proyecto` (`idproyecto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_proyecto_user1` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userproyecto`
--

LOCK TABLES `userproyecto` WRITE;
/*!40000 ALTER TABLE `userproyecto` DISABLE KEYS */;
INSERT INTO `userproyecto` VALUES (1,1,0,'Colaborador'),(1,2,0,'Colaborador'),(1,3,0,'Colaborador'),(1,4,0,'Colaborador'),(1,5,0,'Colaborador'),(1,6,0,'Colaborador'),(1,7,0,'Colaborador'),(1,11,0,'Colaborador'),(1,12,0,'Colaborador'),(1,13,0,'Colaborador'),(1,14,0,'Colaborador'),(1,15,1,'Colaborador'),(1,16,0,'Colaborador'),(1,17,1,'Colaborador'),(1,18,1,'Colaborador'),(1,19,0,'Colaborador'),(1,20,0,'Colaborador'),(1,21,0,'Colaborador'),(5,7,0,'Colaborador'),(5,8,0,'Colaborador'),(5,9,0,'Colaborador'),(5,10,0,'Colaborador'),(5,19,3,'Colaborador'),(7,2,1,'Colaborador'),(7,6,1,'Colaborador'),(7,11,1,'Colaborador'),(7,15,0,'Colaborador'),(7,16,1,'Colaborador'),(7,17,0,'Colaborador'),(7,18,0,'Colaborador'),(7,20,1,'Colaborador'),(7,21,1,'Colaborador'),(8,15,2,'Colaborador'),(8,19,1,'Colaborador'),(8,20,2,'Colaborador');
/*!40000 ALTER TABLE `userproyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'observapp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-28 14:20:51
