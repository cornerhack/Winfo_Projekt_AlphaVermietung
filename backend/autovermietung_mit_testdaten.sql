CREATE DATABASE Autoverleih;
USE Autoverleih;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `autovermietung`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kfzs`
--

CREATE TABLE `kfz` (
  `kfzID` int(11) NOT NULL,
  `marke` varchar(45) DEFAULT NULL,
  `modell` varchar(45) DEFAULT NULL,
  `getriebe` enum('manuell','automatik') CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `kfzTypID` int(11) NOT NULL,
  `kilometerStand` int(11) DEFAULT NULL,
  `anzahlTueren` int(1) DEFAULT NULL,
  `standortMietstationID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `kfz`
--
INSERT INTO `kfz` (`kfzID`, `marke`, `modell`, `getriebe`, `kfzTypID`, `kilometerStand`, `anzahlTueren`, `standortMietstationID`) VALUES
(1, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(2, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(3, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(4, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(5, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(6, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(7, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(8, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(9, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(10, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(11, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(12, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(13, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(14, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(15, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(16, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(17, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(18, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(19, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(20, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(21, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(22, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(23, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(24, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(25, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(26, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(27, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(28, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(29, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(30, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(31, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(32, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(33, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(34, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(35, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(36, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(37, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(38, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(39, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(40, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(41, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(42, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(43, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(44, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(45, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(46, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(47, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(48, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(49, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(50, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(51, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(52, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(53, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(54, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(55, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(56, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(57, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(58, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(59, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(60, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(61, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(62, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(63, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(64, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(65, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(66, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(67, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(68, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(69, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(70, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(71, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(72, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(73, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(74, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(75, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(76, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(77, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(78, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(79, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(80, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(81, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(82, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(83, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(84, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(85, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(86, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(87, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(88, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(89, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(90, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(91, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(92, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(93, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(94, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(95, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(96, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(97, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(98, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(99, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(100, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(101, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(102, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(103, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(104, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(105, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(106, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(107, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(108, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(109, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(110, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(111, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(112, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(113, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(114, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(115, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(116, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(117, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(118, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(119, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(120, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(121, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(122, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(123, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(124, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(125, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(126, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(127, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(128, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(129, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(130, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(131, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(132, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(133, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(134, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(135, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(136, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(137, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(138, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(139, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(140, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(141, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(142, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(143, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(144, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(145, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(146, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(147, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(148, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(149, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(150, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(151, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(152, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(153, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(154, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(155, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(156, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(157, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(158, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(159, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(160, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(161, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(162, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(163, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(164, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(165, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(166, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(167, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(168, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(169, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(170, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(171, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(172, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(173, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(174, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(175, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(176, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(177, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(178, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(179, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(180, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(181, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(182, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(183, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(184, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(185, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(186, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(187, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(188, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(189, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(190, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(191, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(192, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(193, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(194, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(195, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(196, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(197, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(198, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(199, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(200, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(201, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(202, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(203, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(204, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(205, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(206, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(207, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(208, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(209, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(210, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(211, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(212, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(213, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(214, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(215, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(216, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(217, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(218, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(219, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(220, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(221, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(222, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(223, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(224, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(225, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(226, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(227, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(228, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(229, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(230, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(231, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(232, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(233, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(234, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(235, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(236, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(237, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(238, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(239, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(240, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(241, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(242, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(243, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(244, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(245, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(246, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(247, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(248, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(249, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(250, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(251, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(252, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(253, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(254, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(255, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(256, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(257, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(258, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(259, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(260, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(261, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(262, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(263, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(264, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(265, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(266, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(267, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(268, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(269, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(270, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(271, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(272, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(273, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(274, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(275, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(276, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(277, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(278, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(279, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(280, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(281, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(282, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(283, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(284, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(285, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(286, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(287, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(288, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(289, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(290, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(291, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(292, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(293, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(294, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(295, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(296, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(297, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(298, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(299, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(300, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(301, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(302, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(303, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(304, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(305, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(306, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(307, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(308, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(309, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(310, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(311, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(312, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(313, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(314, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(315, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(316, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(317, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(318, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(319, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(320, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(321, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(322, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(323, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(324, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(325, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(326, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(327, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(328, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(329, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(330, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(331, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(332, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(333, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(334, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(335, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(336, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(337, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(338, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(339, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(340, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(341, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(342, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(343, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(344, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(345, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(346, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(347, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(348, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(349, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(350, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(351, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(352, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(353, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(354, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(355, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(356, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(357, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(358, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(359, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(360, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(361, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(362, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(363, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(364, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(365, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(366, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(367, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(368, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(369, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(370, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(371, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(372, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(373, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(374, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(375, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(376, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(377, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(378, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(379, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(380, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(381, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(382, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(383, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(384, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(385, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(386, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(387, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(388, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(389, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(390, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(391, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(392, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(393, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(394, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(395, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(396, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(397, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(398, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(399, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(400, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(401, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(402, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(403, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(404, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(405, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(406, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(407, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(408, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(409, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(410, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(411, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(412, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(413, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(414, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(415, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(416, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(417, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(418, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(419, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(420, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(421, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(422, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(423, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(424, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(425, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(426, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(427, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(428, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(429, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(430, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(431, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(432, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(433, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(434, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(435, 'Fiat', 'Ducato Camper', 'automatik', 11, 89012, 4, 35),
(436, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(437, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(438, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(439, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(440, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(441, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(442, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(443, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(444, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(445, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(446, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(447, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(448, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(449, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(450, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50),
(451, 'Volkswagen', 'Golf', 'automatik', 1, 12543, 5, 1),
(452, 'Volkswagen', 'Passat', 'manuell', 2, 23456, 5, 2),
(453, 'Mercedes', 'Vito', 'automatik', 3, 34567, 5, 3),
(454, 'Ford', 'Transit', 'manuell', 4, 45678, 5, 4),
(455, 'BMW', 'X5', 'automatik', 5, 56789, 5, 5),
(456, 'Toyota', 'Hilux', 'manuell', 6, 67890, 4, 6),
(457, 'Fiat', 'Ducato', 'automatik', 7, 78901, 3, 7),
(458, 'Audi', 'A5 Cabrio', 'manuell', 8, 89012, 2, 8),
(459, 'Porsche', 'Boxster', 'automatik', 9, 90123, 2, 9),
(460, 'Audi', 'A8', 'manuell', 10, 12345, 4, 10),
(461, 'Volkswagen', 'California', 'automatik', 11, 23456, 4, 11),
(462, 'Porsche', '911', 'manuell', 12, 34567, 2, 12),
(463, 'Volkswagen', 'Polo', 'automatik', 1, 45678, 5, 13),
(464, 'Skoda', 'Octavia', 'manuell', 2, 56789, 5, 14),
(465, 'Mercedes', 'V-Class', 'automatik', 3, 67890, 5, 15),
(466, 'Mercedes', 'Sprinter', 'manuell', 4, 78901, 5, 16),
(467, 'Audi', 'Q7', 'automatik', 5, 89012, 5, 17),
(468, 'Ford', 'Ranger', 'manuell', 6, 90123, 4, 18),
(469, 'Peugeot', 'Boxer', 'automatik', 7, 12345, 3, 19),
(470, 'BMW', 'Z4', 'manuell', 8, 23456, 2, 20),
(471, 'BMW', 'i8 Roadster', 'automatik', 9, 34567, 2, 21),
(472, 'Mercedes', 'S-Klasse', 'manuell', 10, 45678, 4, 22),
(473, 'Hyundai', 'Grand Starex', 'automatik', 11, 56789, 4, 23),
(474, 'Ferrari', '488 GTB', 'manuell', 12, 67890, 2, 24),
(475, 'Opel', 'Corsa', 'automatik', 1, 78901, 5, 25),
(476, 'Volkswagen', 'Golf Variant', 'manuell', 2, 89012, 5, 26),
(477, 'Toyota', 'Hiace', 'automatik', 3, 90123, 5, 27),
(478, 'Ford', 'Tourneo', 'manuell', 4, 12345, 5, 28),
(479, 'Volvo', 'XC90', 'automatik', 5, 23456, 5, 29),
(480, 'Isuzu', 'D-Max', 'manuell', 6, 34567, 4, 30),
(481, 'Citroen', 'Jumper', 'automatik', 7, 45678, 3, 31),
(482, 'Mazda', 'MX-5', 'manuell', 8, 56789, 2, 32),
(483, 'Lotus', 'Elise', 'automatik', 9, 67890, 2, 33),
(484, 'Lexus', 'LS', 'manuell', 10, 78901, 4, 34),
(486, 'Lamborghini', 'Huracan', 'manuell', 12, 90123, 2, 36),
(487, 'Renault', 'Clio', 'automatik', 1, 12345, 5, 37),
(488, 'Skoda', 'Superb', 'manuell', 2, 23456, 5, 38),
(489, 'Volkswagen', 'Caravelle', 'automatik', 3, 34567, 5, 39),
(490, 'Mercedes', 'Viano', 'manuell', 4, 45678, 5, 40),
(491, 'Land Rover', 'Range Rover', 'automatik', 5, 56789, 5, 41),
(492, 'Nissan', 'Navara', 'manuell', 6, 67890, 4, 42),
(493, 'Renault', 'Master', 'automatik', 7, 78901, 3, 43),
(494, 'Audi', 'TT Roadster', 'manuell', 8, 89012, 2, 44),
(495, 'Porsche', 'Cayman', 'automatik', 9, 90123, 2, 45),
(496, 'Jaguar', 'XF', 'manuell', 10, 12345, 4, 46),
(497, 'Volkswagen', 'Grand California', 'automatik', 11, 23456, 4, 47),
(498, 'McLaren', '720S', 'manuell', 12, 34567, 2, 48),
(499, 'Ford', 'Fiesta', 'automatik', 1, 45678, 5, 49),
(500, 'Volkswagen', 'Arteon', 'manuell', 2, 56789, 5, 50);
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kfztypen`
--

CREATE TABLE `kfztypen` (
  `kfzTypID` int(11) NOT NULL,
  `typBezeichnung` varchar(45) NOT NULL,
  `tarifID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `kfztypen`
--

INSERT INTO `kfztypen` (`kfzTypID`, `typBezeichnung`, `tarifID`) VALUES
(1, 'Kleinwagen', 1),
(2, 'Kombi', 2),
(3, 'Van', 3),
(4, 'Bus', 4),
(5, 'SUV', 5),
(6, 'Pickup', 6),
(7, 'Mini Truck', 7),
(8, 'Cabrio', 8),
(9, 'Roadster', 9),
(10, 'Limousine', 10),
(11, 'Wohnmobil', 11),
(12, 'Sportwagen', 12);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kunden`
--

CREATE TABLE `kunden` (
  `kundeID` int(11) NOT NULL,
  `unternehmen` varchar(45) DEFAULT NULL,
  `vorname` varchar(45) DEFAULT NULL,
  `nachname` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `strasse` varchar(45) DEFAULT NULL,
  `hausNr` varchar(4) DEFAULT NULL,
  `plz` int(11) DEFAULT NULL,
  `ort` varchar(45) DEFAULT NULL,
  `land` varchar(45) DEFAULT NULL,
  `telefonNr` varchar(45) DEFAULT NULL,
  `emailAdresse` varchar(45) DEFAULT NULL,
  `geschaeftlich` boolean DEFAULT false,
  `sammelrechnung` enum('keine','woechentlich','monatlich','quartalsweise','halbjaehrlich','jaehrlich') CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci DEFAULT 'keine'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `kunden`
--
INSERT INTO `kunden` (`kundeID`, `unternehmen`, `vorname`, `nachname`, `password`, `strasse`, `hausNr`, `plz`, `ort`, `land`, `telefonNr`, `emailAdresse`, `geschaeftlich`, `sammelrechnung`) VALUES
(1, NULL, 'Max', 'Mustermann', 'pass123', 'Musterstraße', '12', 10115, 'Berlin', 'Deutschland', '0301234567', 'max.mustermann@email.de', false, 'keine'),
(2, 'Tech Solutions GmbH', 'Anna', 'Schmidt', 'securepw', 'Hauptstraße', '34', 20095, 'Hamburg', 'Deutschland', '0402345678', 'anna.schmidt@tech.de', true, 'monatlich'),
(3, NULL, 'Thomas', 'Müller', 'thomas123', 'Schulweg', '5', 80331, 'München', 'Deutschland', '0893456789', 'thomas.mueller@email.de', false, 'keine'),
(4, 'AutoPartner AG', 'Sabine', 'Meier', 'sabine!', 'Bahnhofstraße', '67', 50667, 'Köln', 'Deutschland', '02214567890', 'sabine.meier@autopartner.de', true, 'quartalsweise'),
(5, NULL, 'Julia', 'Fischer', 'julia2024', 'Lindenallee', '89', 60313, 'Frankfurt', 'Deutschland', '0695678901', 'julia.fischer@email.de', false, 'keine'),
(6, 'Logistik Express', 'Daniel', 'Weber', 'danielweber', 'Goethestraße', '23', 70173, 'Stuttgart', 'Deutschland', '0711789012', 'daniel.weber@logistik.de', true, 'woechentlich'),
(7, NULL, 'Laura', 'Becker', 'laura123', 'Parkstraße', '45', 40213, 'Düsseldorf', 'Deutschland', '0211890123', 'laura.becker@email.de', false, 'keine'),
(8, 'BauProjekt GmbH', 'Markus', 'Hoffmann', 'markush', 'Friedrichstraße', '56', 04109, 'Leipzig', 'Deutschland', '0341901234', 'markus.hoffmann@bauprojekt.de', true, 'monatlich'),
(9, NULL, 'Sarah', 'Schulz', 'sarahs', 'Kaiserstraße', '78', 55116, 'Mainz', 'Deutschland', '0613012345', 'sarah.schulz@email.de', false, 'keine'),
(10, 'IT-Systemhaus', 'Felix', 'Richter', 'felixit', 'Dorfplatz', '90', 01067, 'Dresden', 'Deutschland', '0351123456', 'felix.richter@itsystem.de', true, 'jaehrlich'),
(11, NULL, 'Nicole', 'Klein', 'nicolek', 'Am Berg', '12', 30159, 'Hannover', 'Deutschland', '0511234567', 'nicole.klein@email.de', false, 'keine'),
(12, 'EventPlanung GmbH', 'Stefan', 'Wolf', 'stefanw', 'Wiesenweg', '34', 99084, 'Erfurt', 'Deutschland', '0361567890', 'stefan.wolf@event.de', true, 'monatlich'),
(13, NULL, 'Petra', 'König', 'petrak', 'Rosenstraße', '56', 66111, 'Saarbrücken', 'Deutschland', '0681678901', 'petra.koenig@email.de', false, 'keine'),
(14, 'MedTech Solutions', 'Andreas', 'Schröder', 'andreasmed', 'Ahornweg', '78', 18055, 'Rostock', 'Deutschland', '0381789012', 'andreas.schroeder@medtech.de', true, 'halbjaehrlich'),
(15, NULL, 'Monika', 'Brandt', 'monikab', 'Eichenallee', '90', 97070, 'Würzburg', 'Deutschland', '0931890123', 'monika.brandt@email.de', false, 'keine'),
(16, 'Consulting Plus', 'Oliver', 'Werner', 'oliverc', 'Buchenweg', '12', 52070, 'Aachen', 'Deutschland', '0241901234', 'oliver.werner@consulting.de', true, 'quartalsweise'),
(17, NULL, 'Claudia', 'Lange', 'claudial', 'Fichtenstraße', '34', 86150, 'Augsburg', 'Deutschland', '0821012345', 'claudia.lange@email.de', false, 'keine'),
(18, 'TransportLog AG', 'Jan', 'Krause', 'jank', 'Tannenweg', '56', 90402, 'Nürnberg', 'Deutschland', '0911123456', 'jan.krause@transport.de', true, 'monatlich'),
(19, NULL, 'Birgit', 'Huber', 'birgith', 'Kiefernstraße', '78', 22041, 'Hamburg', 'Deutschland', '0401234567', 'birgit.huber@email.de', false, 'keine'),
(20, 'FinanzService GmbH', 'Tim', 'Vogel', 'timf', 'Ulmenallee', '90', 48143, 'Münster', 'Deutschland', '0251234567', 'tim.vogel@finanz.de', true, 'jaehrlich'),
(21, NULL, 'Tanja', 'Frank', 'tanjaf', 'Akazienweg', '12', 39104, 'Magdeburg', 'Deutschland', '0391345678', 'tanja.frank@email.de', false, 'keine'),
(22, 'BauDesign AG', 'Martin', 'Roth', 'martinb', 'Lerchenweg', '34', 40210, 'Düsseldorf', 'Deutschland', '0211456789', 'martin.roth@bau.de', true, 'monatlich'),
(23, NULL, 'Sandra', 'Bauer', 'sandrab', 'Amselstraße', '56', 45127, 'Essen', 'Deutschland', '0201567890', 'sandra.bauer@email.de', false, 'keine'),
(24, 'IT-Consulting', 'Philipp', 'Zimmermann', 'philippit', 'Drosselweg', '78', 64283, 'Darmstadt', 'Deutschland', '0615678901', 'philipp.zimmermann@itconsult.de', true, 'quartalsweise'),
(25, NULL, 'Christine', 'Schmitt', 'christines', 'Finkenstraße', '90', 70176, 'Stuttgart', 'Deutschland', '0711789012', 'christine.schmitt@email.de', false, 'keine');
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mietstationen`
--

CREATE TABLE `mietstationen` (
  `mietstationID` int(11) NOT NULL,
  `anzahlStellplaetze` int(11) NOT NULL,
  `strasse` varchar(45) DEFAULT NULL,
  `hausNr` varchar(4) DEFAULT NULL,
  `plz` int(11) DEFAULT NULL,
  `ort` varchar(45) DEFAULT NULL,
  `land` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mietstationen`
--

INSERT INTO `mietstationen` (`mietstationID`, `anzahlStellplaetze`, `strasse`, `hausNr`, `plz`, `ort`, `land`) VALUES
(1, 34, 'Goethestraße', '92', 71091, 'Duisburg', 'Deutschland'),
(2, 85, 'Schulstraße', '165', 42153, 'Hamburg', 'Deutschland'),
(3, 71, 'Bahnhofstraße', '113', 53736, 'Köln', 'Deutschland'),
(4, 17, 'Friedrichstraße', '211', 88145, 'Münster', 'Deutschland'),
(5, 44, 'Hauptstraße', '280', 67823, 'Stuttgart', 'Deutschland'),
(6, 37, 'Musterweg', '60', 98574, 'Berlin', 'Deutschland'),
(7, 29, 'Bergstraße', '29', 96052, 'Nürnberg', 'Deutschland'),
(8, 96, 'Hofstraße', '74', 70332, 'Hannover', 'Deutschland'),
(9, 79, 'Marktstraße', '191', 87082, 'Bochum', 'Deutschland'),
(10, 63, 'Waldstraße', '24', 82076, 'Dortmund', 'Deutschland'),
(11, 91, 'Ringstraße', '116', 42016, 'Essen', 'Deutschland'),
(12, 48, 'Alleeweg', '157', 97406, 'Leipzig', 'Deutschland'),
(13, 67, 'Rosenweg', '94', 41830, 'Bremen', 'Deutschland'),
(14, 87, 'Wiesenweg', '44', 57267, 'Frankfurt am Main', 'Deutschland'),
(15, 13, 'Tulpenstraße', '138', 84392, 'Dresden', 'Deutschland'),
(16, 91, 'Am Hang', '19', 50701, 'Wuppertal', 'Deutschland'),
(17, 68, 'Finkenweg', '122', 91148, 'München', 'Deutschland'),
(18, 32, 'Amselweg', '177', 91370, 'Berlin', 'Deutschland'),
(19, 66, 'Lindenstraße', '121', 66831, 'Hamburg', 'Deutschland'),
(20, 83, 'Buchenweg', '269', 50098, 'Bielefeld', 'Deutschland'),
(21, 25, 'Drosselweg', '218', 97316, 'Bonn', 'Deutschland'),
(22, 74, 'Schillerstraße', '144', 75900, 'Duisburg', 'Deutschland'),
(23, 17, 'Mozartstraße', '49', 68342, 'München', 'Deutschland'),
(24, 42, 'Brunnenstraße', '221', 86037, 'Leipzig', 'Deutschland'),
(25, 70, 'Kastanienweg', '15', 88500, 'Köln', 'Deutschland'),
(26, 64, 'Sonnenstraße', '201', 93019, 'Dortmund', 'Deutschland'),
(27, 92, 'Eichenweg', '114', 72248, 'Berlin', 'Deutschland'),
(28, 86, 'Weinbergstraße', '17', 51400, 'Essen', 'Deutschland'),
(29, 41, 'Platanenweg', '190', 76160, 'Frankfurt am Main', 'Deutschland'),
(30, 21, 'Im Winkel', '69', 88460, 'Hannover', 'Deutschland'),
(31, 61, 'An der Mühle', '212', 69360, 'Wuppertal', 'Deutschland'),
(32, 75, 'Neue Straße', '267', 72771, 'Bonn', 'Deutschland'),
(33, 20, 'Bahnhofstraße', '154', 82331, 'Hamburg', 'Deutschland'),
(34, 59, 'Ringstraße', '132', 50242, 'Dresden', 'Deutschland'),
(35, 65, 'Lerchenweg', '133', 60529, 'Bielefeld', 'Deutschland'),
(36, 28, 'Waldweg', '6', 99677, 'Bochum', 'Deutschland'),
(37, 36, 'Gartenstraße', '33', 81395, 'Köln', 'Deutschland'),
(38, 100, 'Hauptstraße', '9', 97392, 'Stuttgart', 'Deutschland'),
(39, 82, 'Poststraße', '157', 51108, 'Berlin', 'Deutschland'),
(40, 53, 'Ziegelstraße', '74', 89340, 'Nürnberg', 'Deutschland'),
(41, 49, 'Blumenweg', '228', 87306, 'München', 'Deutschland'),
(42, 84, 'Kanalstraße', '46', 70999, 'Hamburg', 'Deutschland'),
(43, 35, 'Hofweg', '147', 82321, 'Dortmund', 'Deutschland'),
(44, 58, 'Birkenweg', '261', 96241, 'Leipzig', 'Deutschland'),
(45, 40, 'Uferstraße', '288', 78020, 'Frankfurt am Main', 'Deutschland'),
(46, 30, 'Glockenstraße', '50', 89200, 'Wuppertal', 'Deutschland'),
(47, 55, 'Nordstraße', '75', 98081, 'Bielefeld', 'Deutschland'),
(48, 72, 'Bergweg', '233', 61734, 'Bochum', 'Deutschland'),
(49, 43, 'Südstraße', '102', 72321, 'Stuttgart', 'Deutschland'),
(50, 97, 'Parkweg', '161', 85349, 'Münster', 'Deutschland');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mietvertraege`
--

CREATE TABLE `mietvertraege` (
  `mietvertragID` int(11) NOT NULL,
  `mietdauerTage` int(11) NOT NULL,
  `mietgebuehr` double NOT NULL,
  `kfzID` int(11) NOT NULL,
  `reservierungID` int(11) NOT NULL,
  `datum` DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mietvertraege`
--
INSERT INTO `mietvertraege` (`mietvertragID`, `mietdauerTage`, `mietgebuehr`, `kfzID`, `reservierungID`, `datum`) VALUES
(1, 5, 152.5, 1, 1, '2023-01-10'),
(2, 6, 186.0, 2, 2, '2023-01-12'),
(3, 5, 157.5, 3, 3, '2023-01-15'),
(4, 7, 224.0, 4, 4, '2023-01-18'),
(5, 7, 227.5, 5, 5, '2023-01-20'),
(6, 7, 231.0, 6, 6, '2023-01-22'),
(7, 7, 234.5, 7, 7, '2023-01-25'),
(8, 8, 272.0, 8, 8, '2023-01-28'),
(9, 7, 241.5, 9, 9, '2023-02-01'),
(10, 7, 245.0, 10, 10, '2023-02-05'),
(11, 7, 248.5, 11, 11, '2023-02-08'),
(12, 7, 252.0, 12, 12, '2023-02-10'),
(13, 7, 213.5, 13, 13, '2023-02-12'),
(14, 7, 217.0, 14, 14, '2023-02-15'),
(15, 7, 220.5, 15, 15, '2023-02-18'),
(16, 7, 224.0, 16, 16, '2023-02-20'),
(17, 7, 227.5, 17, 17, '2023-02-22'),
(18, 7, 231.0, 18, 18, '2023-02-25'),
(19, 7, 234.5, 19, 19, '2023-02-28'),
(20, 7, 238.0, 20, 20, '2023-03-01'),
(21, 7, 241.5, 21, 21, '2023-03-05'),
(22, 7, 245.0, 22, 22, '2023-03-08'),
(23, 7, 248.5, 23, 23, '2023-03-10'),
(24, 7, 252.0, 24, 24, '2023-03-12'),
(25, 7, 213.5, 25, 25, '2023-03-15'),
(26, 7, 217.0, 26, 26, '2023-03-18'),
(27, 7, 220.5, 27, 27, '2023-03-20'),
(28, 7, 224.0, 28, 28, '2023-03-22'),
(29, 7, 227.5, 29, 29, '2023-03-25'),
(30, 7, 231.0, 30, 30, '2023-03-28'),
(31, 7, 234.5, 31, 31, '2023-04-01'),
(32, 7, 238.0, 32, 32, '2023-04-05'),
(33, 7, 241.5, 33, 33, '2023-04-08'),
(34, 7, 245.0, 34, 34, '2023-04-10'),
(35, 7, 248.5, 35, 35, '2023-04-12'),
(36, 7, 252.0, 36, 36, '2023-04-15'),
(37, 7, 213.5, 37, 37, '2023-04-18'),
(38, 7, 217.0, 38, 38, '2023-04-20'),
(39, 7, 220.5, 39, 39, '2023-04-22'),
(40, 7, 224.0, 40, 40, '2023-04-25'),
(41, 7, 227.5, 41, 41, '2023-04-28'),
(42, 7, 231.0, 42, 42, '2023-05-01'),
(43, 7, 234.5, 43, 43, '2023-05-05'),
(44, 7, 238.0, 44, 44, '2023-05-08'),
(45, 7, 241.5, 45, 45, '2023-05-10'),
(46, 7, 245.0, 46, 46, '2023-05-12'),
(47, 7, 248.5, 47, 47, '2023-05-15'),
(48, 7, 252.0, 48, 48, '2023-05-18'),
(49, 7, 213.5, 49, 49, '2023-05-20'),
(50, 7, 217.0, 50, 50, '2023-05-22');
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `mitarbeiterID` int(11) NOT NULL,
  `nachname` varchar(50) DEFAULT NULL,
  `vorname` varchar(45) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `emailAdresse` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mitarbeiter`
--

INSERT INTO `mitarbeiter` (`mitarbeiterID`, `nachname`, `vorname`, `password`, `emailAdresse`) VALUES
(1, 'Schneider', 'Lena', 'passwort123', 'lena.schneider@firma.de'),
(2, 'Müller', 'Thomas', 'musterpass', 'thomas.mueller@firma.de'),
(3, 'Meier', 'Sophie', 'sich3r3spw', 'sophie.meier@firma.de'),
(4, 'Fischer', 'Jonas', 'admin2024!', 'jonas.fischer@firma.de'),
(5, 'Weber', 'Laura', 'lauraW#1', 'laura.weber@firma.de'),
(6, 'Hofmann', 'Lukas', 'lukas_h@2024', 'lukas.hofmann@firma.de'),
(7, 'Klein', 'Marie', 'mari3_pw', 'marie.klein@firma.de'),
(8, 'Schulz', 'Paul', 'paul_s@pw', 'paul.schulz@firma.de'),
(9, 'Becker', 'Anna', 'ann@pass', 'anna.becker@firma.de'),
(10, 'Richter', 'Felix', 'felix_pw!', 'felix.richter@firma.de');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rechnungen`
--

CREATE TABLE `rechnungen` (
  `rechnungNr` int(11) NOT NULL,
  `mietvertragID` int(11) NOT NULL,
  `kundeID` int(11) NOT NULL,
  `ruecknahmeprotokollID` int(11) DEFAULT NULL,
  `rechnungDatum` DATE DEFAULT NULL,
  `rechnungBetrag` double NOT NULL,
  `mahnstatus` enum('keine','erste Mahnung','zweite Mahnung','dritte Mahnung') NOT NULL,
  `zahlungslimit` date DEFAULT NULL,
  `bezahlt` boolean DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `rechnungen`
--
INSERT INTO `rechnungen` (`rechnungNr`, `mietvertragID`, `kundeID`, `ruecknahmeprotokollID`, `rechnungDatum`, `rechnungBetrag`, `mahnstatus`, `zahlungslimit`, `bezahlt`) VALUES
(1, 1, 1, 1, '2023-01-16', 152.5, 'keine', '2025-06-10', false),
(2, 2, 2, 2, '2023-01-19', 186.0, 'keine', '2023-02-18', TRUE),
(3, 3, 3, 3, '2023-01-21', 157.5, 'keine', '2023-02-20', TRUE),
(4, 4, 4, 4, '2023-01-26', 224.0, 'keine', '2023-02-25', TRUE),
(5, 5, 5, 5, '2023-01-28', 227.5, 'keine', '2023-02-27', TRUE),
(6, 6, 6, 6, '2023-01-30', 231.0, 'keine', '2023-02-28', TRUE),
(7, 7, 7, 7, '2023-02-02', 234.5, 'keine', '2023-03-04', TRUE),
(8, 8, 8, 8, '2023-02-06', 272.0, 'keine', '2023-03-08', TRUE),
(9, 9, 9, 9, '2023-02-09', 241.5, 'keine', '2023-03-11', TRUE),
(10, 10, 10, 10, '2023-02-13', 245.0, 'keine', '2023-03-15', TRUE),
(11, 11, 11, 11, '2023-02-16', 248.5, 'keine', '2023-03-18', TRUE),
(12, 12, 12, 12, '2023-02-18', 252.0, 'keine', '2023-03-20', TRUE),
(13, 13, 13, 13, '2023-02-20', 213.5, 'keine', '2023-03-22', TRUE),
(14, 14, 14, 14, '2023-02-23', 217.0, 'keine', '2023-03-25', TRUE),
(15, 15, 15, 15, '2023-02-26', 220.5, 'keine', '2023-03-28', TRUE),
(16, 16, 16, 16, '2023-02-28', 224.0, 'keine', '2023-03-30', TRUE),
(17, 17, 17, 17, '2023-03-02', 227.5, 'keine', '2023-04-01', TRUE),
(18, 18, 18, 18, '2023-03-05', 231.0, 'keine', '2023-04-04', TRUE),
(19, 19, 19, 19, '2023-03-08', 234.5, 'keine', '2023-04-07', TRUE),
(20, 20, 20, 20, '2023-03-09', 238.0, 'keine', '2023-04-08', TRUE);
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reservierungen`
--

CREATE TABLE `reservierungen` (
  `reservierungID` int(11) NOT NULL,
  `kundeID` int(11) NOT NULL,
  `kfzTypID` int(11) NOT NULL,
  `abholstationID` int(11) NOT NULL,
  `abgabestationID` int(11) NOT NULL,
  `status` enum('bestätigt','aktiv','storniert','abgeschlossen') NOT NULL,
  `mietbeginn` DATE DEFAULT NULL,
  `mietende` DATE DEFAULT NULL,
  `zusaetze` varchar(255) DEFAULT NULL -- Versicherung, zweite Fahrer, etc.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `reservierungen`
--
INSERT INTO `reservierungen` (`reservierungID`, `kundeID`, `kfzTypID`, `abholstationID`, `abgabestationID`, `status`, `mietbeginn`, `mietende`, `zusaetze`) VALUES
(1, 1, 1, 1, 1, 'abgeschlossen', '2023-01-10', '2023-01-15', NULL),
(2, 2, 2, 2, 2, 'abgeschlossen', '2023-01-12', '2023-01-18', NULL),
(3, 3, 3, 3, 3, 'abgeschlossen', '2023-01-15', '2023-01-20', NULL),
(4, 4, 4, 4, 4, 'abgeschlossen', '2023-01-18', '2023-01-25', NULL),
(5, 5, 5, 5, 5, 'abgeschlossen', '2023-01-20', '2023-01-27', NULL),
(6, 6, 6, 6, 6, 'abgeschlossen', '2023-01-22', '2023-01-29', NULL),
(7, 7, 7, 7, 7, 'abgeschlossen', '2023-01-25', '2023-02-01', NULL),
(8, 8, 8, 8, 8, 'abgeschlossen', '2023-01-28', '2023-02-05', NULL),
(9, 9, 9, 9, 9, 'abgeschlossen', '2023-02-01', '2023-02-08', NULL),
(10, 10, 10, 10, 10, 'abgeschlossen', '2023-02-05', '2023-02-12', NULL),
(11, 11, 11, 11, 11, 'abgeschlossen', '2023-02-08', '2023-02-15', NULL),
(12, 12, 12, 12, 12, 'abgeschlossen', '2023-02-10', '2023-02-17', NULL),
(13, 13, 1, 13, 13, 'abgeschlossen', '2023-02-12', '2023-02-19', NULL),
(14, 14, 2, 14, 14, 'abgeschlossen', '2023-02-15', '2023-02-22', NULL),
(15, 15, 3, 15, 15, 'abgeschlossen', '2023-02-18', '2023-02-25', NULL),
(16, 16, 4, 16, 16, 'abgeschlossen', '2023-02-20', '2023-02-27', NULL),
(17, 17, 5, 17, 17, 'abgeschlossen', '2023-02-22', '2023-03-01', NULL),
(18, 18, 6, 18, 18, 'abgeschlossen', '2023-02-25', '2023-03-04', NULL),
(19, 19, 7, 19, 19, 'abgeschlossen', '2023-02-28', '2023-03-07', NULL),
(20, 20, 8, 20, 20, 'abgeschlossen', '2023-03-01', '2023-03-08', NULL),
(21, 21, 9, 21, 21, 'bestätigt', '2023-03-05', '2023-03-12', NULL),
(22, 22, 10, 22, 22, 'bestätigt', '2023-03-08', '2023-03-15', NULL),
(23, 23, 11, 23, 23, 'bestätigt', '2023-03-10', '2023-03-17', NULL),
(24, 24, 12, 24, 24, 'bestätigt', '2023-03-12', '2023-03-19', NULL),
(25, 25, 1, 25, 25, 'bestätigt', '2023-03-15', '2023-03-22', NULL),
(26, 1, 2, 26, 26, 'aktiv', '2023-03-18', '2023-03-25', NULL),
(27, 2, 3, 27, 27, 'aktiv', '2023-03-20', '2023-03-27', NULL),
(28, 3, 4, 28, 28, 'aktiv', '2023-03-22', '2023-03-29', NULL),
(29, 4, 5, 29, 29, 'aktiv', '2023-03-25', '2023-04-01', NULL),
(30, 5, 6, 30, 30, 'aktiv', '2023-03-28', '2023-04-04', NULL),
(31, 6, 7, 31, 31, 'storniert', '2023-04-01', '2023-04-08', NULL),
(32, 7, 8, 32, 32, 'storniert', '2023-04-05', '2023-04-12', NULL),
(33, 8, 9, 33, 33, 'storniert', '2023-04-08', '2023-04-15', NULL),
(34, 9, 10, 34, 34, 'storniert', '2023-04-10', '2023-04-17', NULL),
(35, 10, 11, 35, 35, 'storniert', '2023-04-12', '2023-04-19', NULL),
(36, 11, 12, 36, 36, 'aktiv', '2023-04-15', '2023-04-22', NULL),
(37, 12, 1, 37, 37, 'aktiv', '2023-04-18', '2023-04-25', NULL),
(38, 13, 2, 38, 38, 'aktiv', '2023-04-20', '2023-04-27', NULL),
(39, 14, 3, 39, 39, 'aktiv', '2023-04-22', '2023-04-29', NULL),
(40, 15, 4, 40, 40, 'aktiv', '2023-04-25', '2023-05-02', NULL),
(41, 16, 5, 41, 41, 'bestätigt', '2023-04-28', '2023-05-05', NULL),
(42, 17, 6, 42, 42, 'bestätigt', '2023-05-01', '2023-05-08', NULL),
(43, 18, 7, 43, 43, 'bestätigt', '2023-05-05', '2023-05-12', NULL),
(44, 19, 8, 44, 44, 'bestätigt', '2023-05-08', '2023-05-15', NULL),
(45, 20, 9, 45, 45, 'bestätigt', '2023-05-10', '2023-05-17', NULL),
(46, 21, 10, 46, 46, 'bestätigt', '2023-05-12', '2023-05-19', NULL),
(47, 22, 11, 47, 47, 'bestätigt', '2023-05-15', '2023-05-22', NULL),
(48, 23, 12, 48, 48, 'bestätigt', '2023-05-18', '2023-05-25', NULL),
(49, 24, 1, 49, 49, 'bestätigt', '2023-05-20', '2023-05-27', NULL),
(50, 25, 2, 50, 50, 'bestätigt', '2023-05-22', '2023-05-29', NULL);
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ruecknahmeprotokolle`
--

CREATE TABLE `ruecknahmeprotokolle` (
  `ruecknahmeprotokollID` int(11) NOT NULL,
  `ersteller` int(11) NOT NULL,
  `protokollDatum` DATE DEFAULT NULL,
  `tank` float NOT NULL,
  `sauberkeit` enum('sehr schmutzig','leicht schmutzig','neutral','sauber','sehr sauber') NOT NULL,
  `schadenTarifID`  int(11) NOT NULL,
  `kilometerstand` int(11) NOT NULL,
  `mietvertragID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `ruecknahmeprotokolle`
--
INSERT INTO `ruecknahmeprotokolle` (`ruecknahmeprotokollID`, `ersteller`, `protokollDatum`, `tank`, `sauberkeit`, `schadenTarifID`, `kilometerstand`, `mietvertragID`) VALUES
(1, 1, '2023-01-15', 0.8, 'sauber', 13, 13021, 1),
(2, 2, '2023-01-18', 0.5, 'sehr sauber', 14, 24012, 2),
(3, 3, '2023-01-20', 0.9, 'neutral', 13, 35045, 3),
(4, 4, '2023-01-25', 0.7, 'leicht schmutzig', 13, 46230, 4),
(5, 5, '2023-01-27', 0.6, 'sauber', 14, 57345, 5),
(6, 6, '2023-01-29', 0.8, 'sehr sauber', 13, 68456, 6),
(7, 7, '2023-02-01', 0.5, 'neutral', 13, 79567, 7),
(8, 8, '2023-02-05', 0.9, 'sauber', 13, 90678, 8),
(9, 9, '2023-02-08', 0.7, 'leicht schmutzig', 14, 101789, 9),
(10, 10, '2023-02-12', 0.6, 'sehr sauber', 13, 112890, 10),
(11, 1, '2023-02-15', 0.8, 'sauber', 13, 123901, 11),
(12, 2, '2023-02-17', 0.5, 'neutral', 14, 135012, 12),
(13, 3, '2023-02-19', 0.9, 'sehr sauber', 13, 146123, 13),
(14, 4, '2023-02-22', 0.7, 'sauber', 13, 157234, 14),
(15, 5, '2023-02-25', 0.6, 'leicht schmutzig', 13, 168345, 15),
(16, 6, '2023-02-27', 0.8, 'neutral', 14, 179456, 16),
(17, 7, '2023-03-01', 0.5, 'sehr sauber', 13, 190567, 17),
(18, 8, '2023-03-04', 0.9, 'sauber', 13, 201678, 18),
(19, 9, '2023-03-07', 0.7, 'leicht schmutzig', 13, 212789, 19),
(20, 10, '2023-03-08', 0.6, 'sehr sauber', 14, 223890, 20);
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tarife`
--

CREATE TABLE `tarife` (
  `tarifID` int(11) NOT NULL,
  `tarifBez` varchar(45) NOT NULL,
  `tarifPreis` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `tarife`
--

INSERT INTO `tarife` (`tarifID`, `tarifBez`, `tarifPreis`) VALUES
(1, 'Tarif 1', 70.5),
(2, 'Tarif 2', 75.5),
(3, 'Tarif 3', 90.5),
(4, 'Tarif 4', 103.5),
(5, 'Tarif 5', 92.5),
(6, 'Tarif 6', 95),
(7, 'Tarif 7', 97.5),
(8, 'Tarif 8', 80),
(9, 'Tarif 9', 73.5),
(10, 'Tarif 10', 84.5),
(11, 'Tarif 11', 125.5),
(12, 'Tarif 12', 145.6),
(13, 'kein Schaden', 0),
(14, 'leichter Schaden', 50),
(15, 'starker Schaden', 250),
(16, 'Totalschaden', 1000);

-- --------------------------------------------------------

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `kfzs`
--
ALTER TABLE `kfz`
  ADD PRIMARY KEY (`kfzID`),
  ADD KEY `kfz_kfzTypID` (`kfzTypID`);

--
-- Indizes für die Tabelle `kfztypen`
--
ALTER TABLE `kfztypen`
  ADD PRIMARY KEY (`kfzTypID`),
  ADD KEY `kfztypen_tarifID_idx` (`tarifID`);

--
-- Indizes für die Tabelle `kunden`
--
ALTER TABLE `kunden`
  ADD PRIMARY KEY (`kundeID`);

--
-- Indizes für die Tabelle `mietstationen`
--
ALTER TABLE `mietstationen`
  ADD PRIMARY KEY (`mietstationID`);

--
-- Indizes für die Tabelle `mietvertraege`
--
ALTER TABLE `mietvertraege`
  ADD PRIMARY KEY (`mietvertragID`),
  ADD KEY `mietvertraege_kfzID_idx` (`kfzID`),
  ADD KEY `mietvertraege_reservierungID` (`reservierungID`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`mitarbeiterID`);

--
-- Indizes für die Tabelle `rechnungen`
--
ALTER TABLE `rechnungen`
  ADD PRIMARY KEY (`rechnungNr`),
  ADD KEY `rechnungen_kundeID_idx` (`kundeID`),
  ADD KEY `rechnungen_mietvertragID_idx` (`mietvertragID`),
  ADD KEY `rechnungen_ruecknahmeprotokollID_idx` (`ruecknahmeprotokollID`);

--
-- Indizes für die Tabelle `reservierungen`
--
ALTER TABLE `reservierungen`
  ADD PRIMARY KEY (`reservierungID`),
  ADD KEY `reservierungen_kfzTypID_idx` (`kfzTypID`),
  ADD KEY `reservierungen_abholstationID_idx` (`abholstationID`),
  ADD KEY `reservierungen_abgabestationID_idx` (`abgabestationID`),
  ADD KEY `reservierungen_kundeID_idx` (`kundeID`) USING BTREE;

--
-- Indizes für die Tabelle `ruecknahmeprotokolle`
--
ALTER TABLE `ruecknahmeprotokolle`
  ADD PRIMARY KEY (`ruecknahmeprotokollID`),
  ADD UNIQUE KEY `ruecknahmeprotokolle_mietvertragID` (`mietvertragID`),
  ADD KEY `ruecknahmeprotokolle_ersteller` (`ersteller`),
  ADD KEY `ruecknahmeprotokolle_tarifID_idx` (`schadenTarifID`);

--
-- Indizes für die Tabelle `tarife`
--
ALTER TABLE `tarife`
  ADD PRIMARY KEY (`tarifID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `kfzs`
--
ALTER TABLE `kfz`
  MODIFY `kfzID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=501;

--
-- AUTO_INCREMENT für Tabelle `kunden`
--
ALTER TABLE `kunden`
  MODIFY `kundeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT für Tabelle `mietstationen`
--
ALTER TABLE `mietstationen`
  MODIFY `mietstationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT für Tabelle `mietvertraege`
--
ALTER TABLE `mietvertraege`
  MODIFY `mietvertragID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT für Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  MODIFY `mitarbeiterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `rechnungen`
--
ALTER TABLE `rechnungen`
  MODIFY `rechnungNr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT für Tabelle `reservierungen`
--
ALTER TABLE `reservierungen`
  MODIFY `reservierungID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT für Tabelle `ruecknahmeprotokolle`
--
ALTER TABLE `ruecknahmeprotokolle`
  MODIFY `ruecknahmeprotokollID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `kfzs`
--
ALTER TABLE `kfz`
  ADD CONSTRAINT `kfz_kfzTypID` FOREIGN KEY (`kfzTypID`) REFERENCES `kfztypen` (`kfzTypID`);

--
-- Constraints der Tabelle `kfztypen`
--
ALTER TABLE `kfztypen`
  ADD CONSTRAINT `kfztypen_tarifID` FOREIGN KEY (`tarifID`) REFERENCES `tarife` (`tarifID`);

--
-- Constraints der Tabelle `mietvertraege`
--
ALTER TABLE `mietvertraege`
  ADD CONSTRAINT `mietvertraege_reservierungID` FOREIGN KEY (`reservierungID`) REFERENCES `reservierungen` (`reservierungID`),
  ADD CONSTRAINT `mietvertraege_kfzID` FOREIGN KEY (`kfzID`) REFERENCES `kfz` (`kfzID`);

--
-- Constraints der Tabelle `rechnungen`
--
ALTER TABLE `rechnungen`
  ADD CONSTRAINT `rechnungen_kundeID` FOREIGN KEY (`kundeID`) REFERENCES `kunden` (`kundeID`),
  ADD CONSTRAINT `rechnungen_mietvertragID` FOREIGN KEY (`mietvertragID`) REFERENCES `mietvertraege` (`mietvertragID`),
  ADD CONSTRAINT `rechnungen_ruecknahmeprotokollID` FOREIGN KEY (`ruecknahmeprotokollID`) REFERENCES `ruecknahmeprotokolle` (`ruecknahmeprotokollID`);

--
-- Constraints der Tabelle `reservierungen`
--
ALTER TABLE `reservierungen`
  ADD CONSTRAINT `reservierungen_kfzTypID` FOREIGN KEY (`kfzTypID`) REFERENCES `kfztypen` (`kfzTypID`),
  ADD CONSTRAINT `reservierungen_kundeID` FOREIGN KEY (`kundeID`) REFERENCES `kunden` (`kundeID`),
  ADD CONSTRAINT `reservierungen_abholstationID` FOREIGN KEY (`abholstationID`) REFERENCES `mietstationen` (`mietstationID`),
  ADD CONSTRAINT `reservierungen_abgabestationID` FOREIGN KEY (`abgabestationID`) REFERENCES `mietstationen` (`mietstationID`);

--
-- Constraints der Tabelle `ruecknahmeprotokolle`
--
ALTER TABLE `ruecknahmeprotokolle`
  ADD CONSTRAINT `ruecknahmeprotokolle_ersteller` FOREIGN KEY (`ersteller`) REFERENCES `mitarbeiter` (`mitarbeiterID`),
  ADD CONSTRAINT `ruecknahmeprotokolle_mietvertragID` FOREIGN KEY (`mietvertragID`) REFERENCES `mietvertraege` (`mietvertragID`),
  ADD CONSTRAINT `ruecknahmeprotokolle_tarifID` FOREIGN KEY (`schadenTarifID`) REFERENCES `tarife` (`tarifID`);

DELIMITER $$

-- Trigger für mietvertraege
CREATE TRIGGER trg_mietvertraege_set_datum
BEFORE INSERT ON mietvertraege
FOR EACH ROW
BEGIN
  IF NEW.datum IS NULL THEN
    SET NEW.datum = CURRENT_DATE;
  END IF;
END$$

-- Trigger für rechnungen
CREATE TRIGGER trg_rechnungen_set_datum
BEFORE INSERT ON rechnungen
FOR EACH ROW
BEGIN
  IF NEW.rechnungDatum IS NULL THEN
    SET NEW.rechnungDatum = CURRENT_DATE;
  END IF;
END$$

-- Trigger für ruecknahmeprotokolle
CREATE TRIGGER trg_ruecknahmeprotokolle_set_datum
BEFORE INSERT ON ruecknahmeprotokolle
FOR EACH ROW
BEGIN
  IF NEW.protokollDatum IS NULL THEN
    SET NEW.protokollDatum = CURRENT_DATE;
  END IF;
END$$

DELIMITER ;

