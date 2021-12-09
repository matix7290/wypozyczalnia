<?php
session_start();
require_once('DB.php');

$sql = "SELECT `reservation`.`id`, `cars`.`mark`, `cars`.`model`, `reservation`.`start_date`,
                `reservation`.`finish_date`, `reservation_statuses`.`status_name`, `users`.`username`
            FROM `reservation`
            INNER JOIN `cars`
            ON `reservation`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation`.`status_id` = `reservation_statuses`.`id`
            INNER JOIN `users`
            ON `reservation`.`user_id` = `users`.`id`
            WHERE `reservation`.`id` = ?
            ORDER BY `reservation`.`timestamp` ASC";

$stmt = $connect->prepare($sql);
$stmt->bind_param('i', $_POST['id']);
$res = $stmt->execute();

if ($res) {
    $response = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $response = 'fail';
}

$connect->close();

echo json_encode($response);
