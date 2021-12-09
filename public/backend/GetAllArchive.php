<?php
session_start();
require_once('DB.php');
$response = array();

$sql = "SELECT `reservation_archives`.`id`, `cars`.`mark`, `cars`.`model`, `reservation_archives`.`start_date`,
                `reservation_archives`.`finish_date`, `reservation_statuses`.`status_name`, `users`.`username`
            FROM `reservation_archives`
            INNER JOIN `cars`
            ON `reservation_archives`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation_archives`.`status_id` = `reservation_statuses`.`id`
            INNER JOIN `users`
            ON `reservation_archives`.`user_id` = `users`.`id`
            ORDER BY `reservation_archives`.`timestamp` ASC";

$stmt = $connect->prepare($sql);
$res = $stmt->execute();

if ($res) {
    $response = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $response = 'fail';
}

echo json_encode($response);
