-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: 192.168.70.20    Database: connect
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `cafe`
--

DROP TABLE IF EXISTS `cafe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cafe` (
  `cAccount` varchar(45) NOT NULL,
  `cName` varchar(45) DEFAULT NULL,
  `cost` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cAccount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cafe`
--

LOCK TABLES `cafe` WRITE;
/*!40000 ALTER TABLE `cafe` DISABLE KEYS */;
INSERT INTO `cafe` VALUES ('2222-2222','힐 스터디 카페','3000'),('4444-4444','노블 스터디 카페','2600'),('6666-6666','토스 스터디 카페','7000');
/*!40000 ALTER TABLE `cafe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cron`
--

DROP TABLE IF EXISTS `cron`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cron` (
  `cronId` int(11) NOT NULL AUTO_INCREMENT,
  `moneyFrom` varchar(45) DEFAULT NULL,
  `moneyTo` varchar(45) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `transfer` tinyint(4) DEFAULT NULL,
  `sDate` date DEFAULT NULL,
  PRIMARY KEY (`cronId`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cron`
--

LOCK TABLES `cron` WRITE;
/*!40000 ALTER TABLE `cron` DISABLE KEYS */;
INSERT INTO `cron` VALUES (37,'test3','2222-2222',3000,0,'2019-12-25'),(38,'test1','2222-2222',3000,0,'2019-12-25'),(39,'test2','2222-2222',3000,0,'2019-12-25'),(40,'test4','2222-2222',3000,0,'2019-12-25'),(41,'test4','4444-4444',2600,0,'2019-03-08'),(42,'test2','4444-4444',2600,0,'2019-03-08'),(43,'test1','4444-4444',2600,0,'2019-03-08'),(44,'test3','2222-2222',3000,0,'2019-12-18'),(45,'test1','2222-2222',3000,0,'2019-12-18'),(46,'test2','2222-2222',3000,0,'2019-12-18'),(47,'test1','0000-0000',20000,0,'2019-12-20'),(48,'test2','0000-0000',5000,0,'2019-12-20'),(49,'test3','0000-0000',5000,0,'2019-12-20'),(50,'test','0000-0000',1000,0,'2019-12-20'),(51,'test2','0000-0000',5000,0,'2019-12-20'),(52,'test1','0000-0000',5000,0,'2019-12-20'),(53,'test3','0000-0000',5000,0,'2019-12-20'),(54,'test3','4444-4444',2600,0,'2019-12-16'),(55,'test4','4444-4444',2600,0,'2019-12-16'),(56,'app','2222-2222',3000,0,'2019-12-16'),(57,'test3','2222-2222',3000,0,'2019-12-16'),(58,'test2','2222-2222',3000,0,'2019-12-16'),(59,'test3','0000-0000',2000,0,'2019-12-20'),(60,'test2','2222-2222',3000,0,'2019-08-06'),(61,'test1','2222-2222',3000,0,'2019-08-06'),(62,'test4','2222-2222',3000,0,'2019-08-06'),(63,'test1','0000-0000',5000,0,'2019-12-20'),(64,'test3','2222-2222',3000,0,'2019-12-17'),(65,'test1','2222-2222',3000,0,'2019-12-17'),(66,'test4','2222-2222',3000,0,'2019-12-17'),(67,'test3','0000-0000',1500,0,'2019-12-20'),(68,'test1','2222-2222',3000,0,'2019-12-26'),(69,'test2','2222-2222',3000,0,'2019-12-26'),(70,'test3','2222-2222',3000,0,'2019-12-26'),(71,'test3','0000-0000',1000,0,'2019-12-20');
/*!40000 ALTER TABLE `cron` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manage`
--

DROP TABLE IF EXISTS `manage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manage` (
  `user_uId` varchar(20) NOT NULL,
  `study_sId` int(11) NOT NULL,
  `manager` tinyint(4) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `fk_user_has_study_study1_idx` (`study_sId`),
  KEY `fk_user_has_study_user_idx` (`user_uId`),
  CONSTRAINT `fk_user_has_study_study1` FOREIGN KEY (`study_sId`) REFERENCES `study` (`sId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_study_user` FOREIGN KEY (`user_uId`) REFERENCES `user` (`uId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manage`
--

LOCK TABLES `manage` WRITE;
/*!40000 ALTER TABLE `manage` DISABLE KEYS */;
INSERT INTO `manage` VALUES ('test3',50,1,106),('test1',50,0,107),('test2',50,0,108),('test4',50,0,109),('test4',51,1,110),('test2',51,0,111),('test1',51,0,112),('test3',52,1,113),('test1',52,0,114),('test2',52,0,115),('test3',53,1,116),('test4',53,0,117),('app',54,0,118),('test3',54,0,119),('test2',54,0,120),('test2',55,0,121),('test1',55,0,122),('test4',55,0,123),('test3',56,0,124),('test1',56,0,125),('test4',56,0,126),('test1',57,1,127),('test2',57,0,128),('test3',57,0,129);
/*!40000 ALTER TABLE `manage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penalty`
--

DROP TABLE IF EXISTS `penalty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `penalty` (
  `pId` int(11) NOT NULL AUTO_INCREMENT,
  `sId` int(11) NOT NULL,
  `uId` varchar(45) NOT NULL,
  `pAmount` int(11) NOT NULL,
  `pDate` date NOT NULL,
  `pDetail` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pId`),
  KEY `sId_idx` (`sId`),
  KEY `uId_idx` (`uId`),
  CONSTRAINT `sId` FOREIGN KEY (`sId`) REFERENCES `study` (`sId`),
  CONSTRAINT `uId` FOREIGN KEY (`uId`) REFERENCES `user` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penalty`
--

LOCK TABLES `penalty` WRITE;
/*!40000 ALTER TABLE `penalty` DISABLE KEYS */;
INSERT INTO `penalty` VALUES (1,50,'test3',2000,'2019-12-21','지각'),(2,51,'test2',3000,'2019-12-11','과제 안 함'),(3,50,'test1',1000,'2019-11-30','지각'),(4,50,'test4',4000,'2019-11-21','과제 안 함'),(5,51,'test2',500,'2019-11-11','지각'),(10,52,'test1',500,'2019-12-31','지각'),(16,50,'test3',5000,'2019-11-12','불참'),(17,54,'test3',2000,'2019-11-21','지각'),(18,50,'test1',5000,'2019-11-12','불참'),(19,56,'test3',1500,'2019-12-20','지각'),(20,57,'test3',1000,'2019-12-30','지각');
/*!40000 ALTER TABLE `penalty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study`
--

DROP TABLE IF EXISTS `study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study` (
  `sId` int(11) NOT NULL AUTO_INCREMENT,
  `sName` varchar(45) NOT NULL,
  `sDate` date NOT NULL COMMENT '스터디 하는 날짜',
  `indiTrans` int(11) NOT NULL COMMENT '며칠 전에 돈 걷을지',
  `cafeTrans` int(11) NOT NULL COMMENT '며칠 전에 돈 보낼지',
  `sAccount` varchar(45) NOT NULL,
  `sBalance` int(11) NOT NULL,
  `sPenalty` int(11) NOT NULL,
  `cafe_cAccount` varchar(45) NOT NULL,
  PRIMARY KEY (`sId`,`sAccount`,`sPenalty`,`cafe_cAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study`
--

LOCK TABLES `study` WRITE;
/*!40000 ALTER TABLE `study` DISABLE KEYS */;
INSERT INTO `study` VALUES (50,'핀테크 아카데미 프로젝트','2019-12-30',5,3,'2222-2222',5000,0,'2222-2222'),(51,'2020 상반기 취업 준비','2020-03-10',2,1,'4444-4444',5000,0,'4444-4444'),(52,'토익 스피킹','2019-12-20',2,1,'2222-2222',0,0,'2222-2222'),(53,'금융경제','2019-12-21',5,2,'4444-4444',0,0,'4444-4444'),(54,'독서 모임','2019-12-19',3,2,'2222-2222',2000,0,'2222-2222'),(55,'시사영어','2020-08-10',4,3,'2222-2222',0,0,'2222-2222'),(56,'웹 프로그래밍','2019-12-20',3,2,'2222-2222',1500,0,'2222-2222'),(57,'테스트 할 스터디 1','2019-12-30',4,1,'2222-2222',1000,0,'2222-2222');
/*!40000 ALTER TABLE `study` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uId` varchar(20) NOT NULL,
  `uPassword` varchar(45) NOT NULL,
  `uName` varchar(45) NOT NULL,
  `uAccount` varchar(45) DEFAULT NULL,
  `uPhone` varchar(45) DEFAULT NULL,
  `accessToken` text NOT NULL,
  `refreshToken` text NOT NULL,
  `userSeqNo` varchar(45) NOT NULL,
  PRIMARY KEY (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('app','1234','우리App','555-555-555-555','010-4321-4321','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODIwMDI4ODIsImp0aSI6IjU4M2E5NDY4LTI3ZmMtNGE4Yi1hNTk0LTUwYjU5YmVlY2FiNyJ9.oADLU04YVaa4SqK5_hYZNqnzr_ZENfbx8QwbR_0gM1A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODI4NjY4ODIsImp0aSI6IjczMGVhODcyLTdhOGItNGNkOC1iMDU2LTAyMzM2OTI1MzdjZCJ9.EZge3J7-PqqYmAUvHsPNHXS2527GazbicCOJXQ74VFs','1100751444'),('cnh','1234','최나현','166-000000-000000','010-1234-5678','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTU2Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODQzMjU1ODksImp0aSI6ImY4OWY0ODkxLTE2NzYtNGM3ZC05MzBhLTQzMjc1ZGNiY2YzZSJ9.rm_LbJeRSiwKRALnaYdDeDC99yy4_yjaiYFyZpqC-4w','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTU2Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODUxODk1ODksImp0aSI6IjUyMzBiYzBkLTEyNWYtNGVkNC05NzgzLTA2MzdkY2JmZTYyYiJ9.ihJtHoCvDZ3RoBXaQTvunEy6lpvgzoKgYCMiATVZUTM','1100752156'),('hillStudy','1234','힐스터디','2222-2222','02-1234-1234','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODQzMjU3OTUsImp0aSI6IjdkYjNiNWEwLWU1NjAtNDg2NC1hMWFiLTk2OGRkMjhjZThmOSJ9.bHUaA7qqxih7aUdy1gFi58U8huG5ggh9CLxT_INKCRY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODUxODk3OTUsImp0aSI6IjczZTRkYWVhLTViODgtNDIzNy1iMWNmLTQ4NWMxM2EyMmUzZCJ9.5YpFgL-OR35WXaTFtgSwEY7g_NVZ0i--8pocBCR27fA','1100752165'),('test1','1234','서용진','166-000000-000000','010-1234-1111','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODIwMDI4ODIsImp0aSI6IjU4M2E5NDY4LTI3ZmMtNGE4Yi1hNTk0LTUwYjU5YmVlY2FiNyJ9.oADLU04YVaa4SqK5_hYZNqnzr_ZENfbx8QwbR_0gM1A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODI4NjY4ODIsImp0aSI6IjczMGVhODcyLTdhOGItNGNkOC1iMDU2LTAyMzM2OTI1MzdjZCJ9.EZge3J7-PqqYmAUvHsPNHXS2527GazbicCOJXQ74VFs','1100751444'),('test2','1234','김하은','1234','010-2580-2222','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODQzMjU3OTUsImp0aSI6IjdkYjNiNWEwLWU1NjAtNDg2NC1hMWFiLTk2OGRkMjhjZThmOSJ9.bHUaA7qqxih7aUdy1gFi58U8huG5ggh9CLxT_INKCRY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODUxODk3OTUsImp0aSI6IjczZTRkYWVhLTViODgtNDIzNy1iMWNmLTQ4NWMxM2EyMmUzZCJ9.5YpFgL-OR35WXaTFtgSwEY7g_NVZ0i--8pocBCR27fA','1100752165'),('test3','1234','최나현','123-4567-890','010-1234-3333','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTU2Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODQzMjU1ODksImp0aSI6ImY4OWY0ODkxLTE2NzYtNGM3ZC05MzBhLTQzMjc1ZGNiY2YzZSJ9.rm_LbJeRSiwKRALnaYdDeDC99yy4_yjaiYFyZpqC-4w','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTU2Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODUxODk1ODksImp0aSI6IjUyMzBiYzBkLTEyNWYtNGVkNC05NzgzLTA2MzdkY2JmZTYyYiJ9.ihJtHoCvDZ3RoBXaQTvunEy6lpvgzoKgYCMiATVZUTM','1100752156'),('test4','1234','노현영','166-910023-22005','010-1234-4444','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODQzMjU3OTUsImp0aSI6IjdkYjNiNWEwLWU1NjAtNDg2NC1hMWFiLTk2OGRkMjhjZThmOSJ9.bHUaA7qqxih7aUdy1gFi58U8huG5ggh9CLxT_INKCRY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyMTY1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODUxODk3OTUsImp0aSI6IjczZTRkYWVhLTViODgtNDIzNy1iMWNmLTQ4NWMxM2EyMmUzZCJ9.5YpFgL-OR35WXaTFtgSwEY7g_NVZ0i--8pocBCR27fA','1100752165');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-20 14:33:36
