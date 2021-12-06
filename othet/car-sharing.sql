-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 06 Gru 2021, 13:17
-- Wersja serwera: 10.4.21-MariaDB
-- Wersja PHP: 8.0.12

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
  `house_number` int(4) NOT NULL,
  `apartment_number` int(3) DEFAULT NULL,
  `city` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `postcode` varchar(6) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `addresses_details`
--

INSERT INTO `addresses_details` (`id`, `street`, `house_number`, `apartment_number`, `city`, `postcode`) VALUES
(1, 'Świętokrzyska', 21, 37, 'Kraków', '31-131'),
(2, 'Świętokrzyska', 21, 37, 'Kraków', '31-131'),
(3, 'test', 2, 3, 'Kraków', '30-337');

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
(3, 'Mateusz', 'Olszewski', '098f6bcd4621d373cade4e832627b4f6', 'test', '098f6bcd4621d373cade4e832627b4f6');

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
(1, 'BMW', 'S Class', 'A', 'A', 5, 4.7, 50, 5, 1, 1);

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
(3, 796418052, 'mateusz7290.mo@gmail.com');

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
  `finish_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Wyzwalacze `reservation`
--
DELIMITER $$
CREATE TRIGGER `delete` BEFORE DELETE ON `reservation` FOR EACH ROW INSERT INTO reservation_archives(user_id, car_id, timestamp, start_date, finish_date)
VALUES(OLD.user_id, OLD.car_id, OLD.timestamp, OLD.start_date, OLD.finish_date)
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
  `finish_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `reservation_archives`
--

INSERT INTO `reservation_archives` (`id`, `user_id`, `car_id`, `timestamp`, `start_date`, `finish_date`) VALUES
(1, 1, 1, '2021-12-05 00:21:36', '2021-12-06', '2021-12-08');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(12) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `statuses`
--

INSERT INTO `statuses` (`id`, `status_name`) VALUES
(1, 'free'),
(2, 'reserved'),
(3, 'in-use'),
(4, 'overdue');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_polish_ci NOT NULL,
  `user_details_id` int(11) NOT NULL,
  `contact_details_id` int(11) NOT NULL,
  `address_details_id` int(11) NOT NULL,
  `card_details_id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `user_details_id`, `contact_details_id`, `address_details_id`, `card_details_id`, `user_type_id`) VALUES
(1, 'jan_kowalski', '81dc9bdb52d04dc20036dbd8313ed055', 1, 1, 1, 1, 3),
(2, 'jan_nowak', '81dc9bdb52d04dc20036dbd8313ed055', 2, 2, 2, 2, 3),
(3, 'mati7290', '05a671c66aefea124cc08b76ea6d30bb', 3, 3, 3, 3, 3);

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
(3, 'Mateusz', 'Olszewski', '20');

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
(3, 'standard');

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
  ADD KEY `car_id` (`car_id`);

--
-- Indeksy dla tabeli `reservation_archives`
--
ALTER TABLE `reservation_archives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indeksy dla tabeli `statuses`
--
ALTER TABLE `statuses`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `cars_prices`
--
ALTER TABLE `cars_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `reservation_archives`
--
ALTER TABLE `reservation_archives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `users_types`
--
ALTER TABLE `users_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`vehicle_class_id`) REFERENCES `cars_prices` (`id`),
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`);

--
-- Ograniczenia dla tabeli `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_details_id`) REFERENCES `addresses_details` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`card_details_id`) REFERENCES `cards_details` (`id`),
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`contact_details_id`) REFERENCES `contacts_details` (`id`),
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`user_details_id`) REFERENCES `users_details` (`id`),
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`user_type_id`) REFERENCES `users_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
