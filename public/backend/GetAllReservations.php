<?php
session_start();
require_once('DB.php');

$statuses = json_decode($_POST['statusses']);
$response = array();


$sql = "SELECT `reservation`.`id`, `cars`.`mark`, `cars`.`model`, `reservation`.`start_date`,
                `reservation`.`finish_date`, `reservation`.`car_id`, `reservation_statuses`.`status_name`, `users`.`username`
            FROM `reservation`
            INNER JOIN `cars`
            ON `reservation`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation`.`status_id` = `reservation_statuses`.`id`
            INNER JOIN `users`
            ON `reservation`.`user_id` = `users`.`id`
            WHERE `reservation_statuses`.`status_name` = ?
            ORDER BY `reservation`.`timestamp` ASC";

foreach ($statuses as $key => $status) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param('s', $status);
    $res = $stmt->execute();

    if ($res) {
        $response[$status] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    } else {
        $response[$status] = 'fail';
    }
}

$connect->close();

echo json_encode($response);
