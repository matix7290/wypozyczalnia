-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 09 Gru 2021, 22:11
-- Wersja serwera: 10.4.22-MariaDB
-- Wersja PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `car-sharing`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `addresses_details`
--

CREATE TABLE `addresses_details` (
  `id` int(11) NOT NULL,
  `street` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `house_number` varchar(8) COLLATE utf8_polish_ci NOT NULL,
  `apartment_number` int(5) DEFAULT NULL,
  `city` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `postcode` varchar(6) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `addresses_details`
--

INSERT INTO `addresses_details` (`id`, `street`, `house_number`, `apartment_number`, `city`, `postcode`) VALUES
(1, 'Świętokrzyska', '21', 37, 'Kraków', '31-131'),
(2, 'Świętokrzyska', '21', 37, 'Kraków', '31-131'),
(3, 'Papieska', '21', 37, 'Watykan', '00120'),
(4, 'test', '21', NULL, 'test', '12-345'),
(7, 'test', '12', NULL, 'test', '25-454'),
(8, 'test', '165', NULL, 'test', '12-123'),
(9, 'ad', '12', 64, 'ad', '45-456');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cards_details`
--

CREATE TABLE `cards_details` (
  `id` int(11) NOT NULL,
  `owner_firstname` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `owner_lastname` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `card_number` varchar(32) COLLATE utf8_polish_ci NOT NULL,
  `expiry_date` varchar(5) COLLATE utf8_polish_ci NOT NULL,
  `cvv2` varchar(32) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `cards_details`
--

INSERT INTO `cards_details` (`id`, `owner_firstname`, `owner_lastname`, `card_number`, `expiry_date`, `cvv2`) VALUES
(1, 'Jan', 'Kowalski', '522c88530c38f56f72e6cda1871e04cf', '12/23', '202cb962ac59075b964b07152d234b70'),
(2, 'Jan', 'Nowak', '522c88530c38f56f72e6cda1871e04cf', '12/23', '202cb962ac59075b964b07152d234b70'),
(3, 'Mateusz', 'Olszewski', '098f6bcd4621d373cade4e832627b4f6', 'test', '098f6bcd4621d373cade4e832627b4f6'),
(4, 'test', 'test', 'd959caadac9b13dcb3e609440135cf54', '12/72', '202cb962ac59075b964b07152d234b70'),
(7, 'test', 'test', '522c88530c38f56f72e6cda1871e04cf', '12/15', '698d51a19d8a121ce581499d7b701668'),
(8, 'test', 'test', '522c88530c38f56f72e6cda1871e04cf', '08/23', '202cb962ac59075b964b07152d234b70'),
(9, 'ad', 'ad', 'd959caadac9b13dcb3e609440135cf54', '04/45', '9ab0d88431732957a618d4a469a0d4c3');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `mark` varchar(10) COLLATE utf8_polish_ci NOT NULL,
  `model` varchar(10) COLLATE utf8_polish_ci NOT NULL,
  `transmission` varchar(1) COLLATE utf8_polish_ci NOT NULL,
  `ac` varchar(1) COLLATE utf8_polish_ci NOT NULL,
  `number_of_seats` int(1) NOT NULL,
  `afc` float NOT NULL,
  `boot_capacity` float NOT NULL,
  `number_of_doors` int(1) NOT NULL,
  `vehicle_class_id` int(1) NOT NULL,
  `status_id` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `cars`
--

INSERT INTO `cars` (`id`, `mark`, `model`, `transmission`, `ac`, `number_of_seats`, `afc`, `boot_capacity`, `number_of_doors`, `vehicle_class_id`, `status_id`) VALUES
(1, 'BMW', 'S Class', 'A', 'A', 5, 4.7, 50, 5, 1, 1),
(2, 'Toyota', 'Yaris', 'M', 'M', 5, 4.7, 40, 5, 2, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cars_prices`
--

CREATE TABLE `cars_prices` (
  `id` int(11) NOT NULL,
  `vehicle_class` varchar(8) COLLATE utf8_polish_ci NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `cars_prices`
--

INSERT INTO `cars_prices` (`id`, `vehicle_class`, `price`) VALUES
(1, 'premium', 140),
(2, 'standard', 100),
(3, 'low', 60);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cars_statuses`
--

CREATE TABLE `cars_statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(12) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `cars_statuses`
--

INSERT INTO `cars_statuses` (`id`, `status_name`) VALUES
(1, 'avaible'),
(2, 'unavaible');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `contacts_details`
--

CREATE TABLE `contacts_details` (
  `id` int(11) NOT NULL,
  `phone` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `contacts_details`
--

INSERT INTO `contacts_details` (`id`, `phone`, `email`) VALUES
(1, 123456789, 'jan.kowalski@poczta.pl'),
(2, 987654321, 'jan.nowak@poczta.pl'),
(3, 796418052, 'mateusz7290.mo@gmail.com'),
(4, 123456789, 'test@test.test'),
(7, 123456789, 'test@test.test'),
(8, 123456789, 'test@test.test'),
(9, 123456789, 'ad@ad.ad');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` date NOT NULL,
  `finish_date` date NOT NULL,
  `status_id` int(1) NOT NULL DEFAULT 1,
  `qr_code_number` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Wyzwalacze `reservation`
--
DELIMITER $$
CREATE TRIGGER `put_to_archive` BEFORE DELETE ON `reservation` FOR EACH ROW INSERT INTO `reservation_archives`(`user_id`, `car_id`, `timestamp`, `start_date`, `finish_date`, `status_id`, `qr_code_number`)
VALUES(OLD.user_id, OLD.car_id, OLD.timestamp, OLD.start_date, OLD.finish_date, OLD.status_id, OLD.qr_code_number)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_accepted` BEFORE UPDATE ON `reservation` FOR EACH ROW IF NEW.finish_date >= CURRENT_DATE AND OLD.status_id = 3 THEN
SET NEW.status_id = 2;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_avaible` BEFORE UPDATE ON `reservation` FOR EACH ROW IF NEW.status_id = 1 THEN
UPDATE cars
SET cars.status_id = 1
WHERE cars.id = NEW.car_id;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_avaible_after_delete` BEFORE DELETE ON `reservation` FOR EACH ROW IF OLD.status_id = 2 OR OLD.status_id = 3 THEN
UPDATE cars
SET cars.status_id = 1
WHERE cars.id = OLD.car_id;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_overdue` BEFORE UPDATE ON `reservation` FOR EACH ROW IF (NEW.finish_date < CURRENT_DATE OR NEW.finish_date < NEW.start_date) AND OLD.status_id = 2 THEN
SET NEW.status_id = 3;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_unavaible` BEFORE UPDATE ON `reservation` FOR EACH ROW IF NEW.status_id = 2 OR NEW.status_id = 3 THEN
UPDATE cars
SET cars.status_id = 2
WHERE cars.id = NEW.car_id;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservation_archives`
--

CREATE TABLE `reservation_archives` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` date NOT NULL,
  `finish_date` date NOT NULL,
  `status_id` int(11) NOT NULL,
  `qr_code_number` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `reservation_archives`
--

INSERT INTO `reservation_archives` (`id`, `user_id`, `car_id`, `timestamp`, `start_date`, `finish_date`, `status_id`, `qr_code_number`) VALUES
(1, 1, 1, '2021-12-05 00:21:36', '2021-12-06', '2021-12-08', 2, 4),
(2, 1, 2, '2021-12-07 17:04:30', '2021-12-07', '2021-12-16', 1, 6),
(3, 1, 2, '2021-12-07 17:05:37', '2021-12-08', '2021-12-30', 1, 7),
(4, 1, 1, '2021-12-07 17:10:01', '2021-12-06', '2021-12-21', 1, 3),
(5, 1, 1, '2021-12-06 21:43:13', '2021-12-07', '2021-12-09', 3, 4),
(6, 1, 1, '2021-12-06 21:46:40', '2021-12-07', '2021-12-08', 3, 5),
(7, 1, 2, '2021-12-07 11:11:35', '2021-12-23', '2021-12-28', 3, 1),
(8, 1, 1, '2021-12-08 10:08:08', '2021-12-06', '2021-12-06', 1, 5),
(9, 1, 1, '2021-12-06 21:49:52', '2021-12-06', '2021-12-09', 1, 7),
(10, 1, 1, '2021-12-07 11:11:35', '2021-12-23', '2021-12-28', 1, 1),
(11, 1, 1, '2021-12-08 10:02:41', '2021-12-15', '2021-12-31', 1, 6),
(12, 1, 1, '2021-12-08 10:04:07', '2021-12-09', '2021-12-16', 1, 5),
(13, 5, 2, '2021-12-08 20:57:03', '2021-12-08', '2021-12-28', 2, 6),
(14, 1, 1, '2021-12-06 21:47:21', '2021-12-06', '2021-12-31', 2, 6),
(15, 6, 2, '2021-12-09 13:17:29', '2021-12-09', '2021-12-09', 1, 7),
(16, 5, 1, '2021-12-06 21:35:32', '2021-12-06', '2021-12-08', 2, 3),
(17, 5, 1, '2021-12-06 19:48:24', '2021-12-02', '2021-12-07', 3, 1),
(18, 5, 2, '2021-12-06 19:48:24', '2021-12-09', '2021-12-09', 2, 2),
(19, 1, 1, '2021-12-09 20:56:30', '2021-12-09', '2021-12-28', 1, 3),
(20, 9, 1, '2021-12-09 20:55:46', '2021-12-09', '2022-01-03', 2, 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservation_statuses`
--

CREATE TABLE `reservation_statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(12) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `reservation_statuses`
--

INSERT INTO `reservation_statuses` (`id`, `status_name`) VALUES
(1, 'waiting'),
(2, 'accepted'),
(3, 'overdue');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_polish_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `user_details_id` int(11) NOT NULL,
  `contact_details_id` int(11) NOT NULL,
  `address_details_id` int(11) NOT NULL,
  `card_details_id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `active`, `user_details_id`, `contact_details_id`, `address_details_id`, `card_details_id`, `user_type_id`) VALUES
(1, 'jan_kowalski', '81dc9bdb52d04dc20036dbd8313ed055', 1, 1, 1, 1, 1, 2),
(2, 'jan_nowak', '81dc9bdb52d04dc20036dbd8313ed055', 1, 2, 2, 2, 2, 3),
(3, 'mati7290', '05a671c66aefea124cc08b76ea6d30bb', 1, 3, 3, 3, 3, 3),
(4, 'test', '25d55ad283aa400af464c76d713c07ad', 1, 4, 4, 4, 4, 3),
(5, 'jan_pawel_2', '21232f297a57a5a743894a0e4a801fc3', 1, 3, 3, 3, 3, 2137),
(6, 'admin', '21232f297a57a5a743894a0e4a801fc3', 1, 4, 4, 4, 4, 1),
(7, 'dfg', '05a671c66aefea124cc08b76ea6d30bb', 0, 7, 7, 7, 7, 3),
(8, '\"1?\"', '05a671c66aefea124cc08b76ea6d30bb', 0, 8, 8, 8, 8, 3),
(9, 'ad', '25d55ad283aa400af464c76d713c07ad', 1, 9, 9, 9, 9, 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users_details`
--

CREATE TABLE `users_details` (
  `id` int(11) NOT NULL,
  `firstname` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `age` varchar(4) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users_details`
--

INSERT INTO `users_details` (`id`, `firstname`, `lastname`, `age`) VALUES
(1, 'Jan', 'Kowalski', 'more'),
(2, 'Jan', 'Nowak', '21'),
(3, 'Jan', 'Paweł 2', '2'),
(4, 'test', 'test', '18'),
(7, 'test', 'test', '18'),
(8, 'test', 'test', '19'),
(9, 'ad', 'ad', '21');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users_types`
--

CREATE TABLE `users_types` (
  `id` int(11) NOT NULL,
  `permissions_name` varchar(8) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users_types`
--

INSERT INTO `users_types` (`id`, `permissions_name`) VALUES
(1, 'admin'),
(2, 'mod'),
(3, 'standard'),
(2137, 'pope');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `addresses_details`
--
ALTER TABLE `addresses_details`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `cards_details`
--
ALTER TABLE `cards_details`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_class_id` (`vehicle_class_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indeksy dla tabeli `cars_prices`
--
ALTER TABLE `cars_prices`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `cars_statuses`
--
ALTER TABLE `cars_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `contacts_details`
--
ALTER TABLE `contacts_details`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indeksy dla tabeli `reservation_archives`
--
ALTER TABLE `reservation_archives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indeksy dla tabeli `reservation_statuses`
--
ALTER TABLE `reservation_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_details_id` (`card_details_id`),
  ADD KEY `contact_details_id` (`contact_details_id`),
  ADD KEY `user_details_id` (`user_details_id`),
  ADD KEY `users_ibfk_1` (`address_details_id`),
  ADD KEY `user_type_id` (`user_type_id`);

--
-- Indeksy dla tabeli `users_details`
--
ALTER TABLE `users_details`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users_types`
--
ALTER TABLE `users_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `cars_prices`
--
ALTER TABLE `cars_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `cars_statuses`
--
ALTER TABLE `cars_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT dla tabeli `reservation_archives`
--
ALTER TABLE `reservation_archives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT dla tabeli `reservation_statuses`
--
ALTER TABLE `reservation_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `users_types`
--
ALTER TABLE `users_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2138;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`vehicle_class_id`) REFERENCES `cars_prices` (`id`),
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `cars_statuses` (`id`);

--
-- Ograniczenia dla tabeli `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `reservation_statuses` (`id`);

--
-- Ograniczenia dla tabeli `reservation_archives`
--
ALTER TABLE `reservation_archives`
  ADD CONSTRAINT `reservation_archives_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `reservation_archives_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservation_archives_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `reservation_statuses` (`id`);

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_details_id`) REFERENCES `addresses_details` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`card_details_id`) REFERENCES `cards_details` (`id`),
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`contact_details_id`) REFERENCES `contacts_details` (`id`),
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`user_details_id`) REFERENCES `users_details` (`id`),
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`user_type_id`) REFERENCES `users_types` (`id`);

DELIMITER $$
--
-- Zdarzenia
--
CREATE DEFINER=`root`@`localhost` EVENT `update_reservations` ON SCHEDULE EVERY 1 DAY STARTS '2021-12-09 16:35:44' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE reservation
SET reservation.status_id = 3
WHERE reservation.finish_date < CURRENT_DATE AND reservation.status_id = 2$$

CREATE DEFINER=`root`@`localhost` EVENT `symulation_foreward` ON SCHEDULE EVERY 1 MINUTE STARTS '2021-12-09 20:40:53' ON COMPLETION NOT PRESERVE DISABLE DO UPDATE reservation
SET reservation.start_date = DATE_SUB(reservation.start_date, INTERVAL 1 DAY),
reservation.finish_date = DATE_SUB(reservation.finish_date, INTERVAL 1 DAY)$$

CREATE DEFINER=`root`@`localhost` EVENT `symulation_backward` ON SCHEDULE EVERY 1 MINUTE STARTS '2021-12-09 21:31:29' ON COMPLETION NOT PRESERVE DISABLE DO UPDATE reservation
SET reservation.start_date = DATE_ADD(reservation.start_date, INTERVAL 1 DAY),
reservation.finish_date = DATE_ADD(reservation.finish_date, INTERVAL 1 DAY)$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
