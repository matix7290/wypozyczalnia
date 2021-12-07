<?php
session_start();
require_once('DB.php');

$statuses = ['waiting', 'accepted', 'overdue'];
$response = array();

foreach ($statuses as $key => $status) {
    $sql = "SELECT `reservation`.`id`, `cars`.`mark`, `cars`.`model`, `reservation`.`start_date`,
                `reservation`.`finish_date`, `reservation_statuses`.`status_name`, `reservation`.`qr_code_number`
            FROM `reservation`
            INNER JOIN `cars`
            ON `reservation`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation`.`status_id` = `reservation_statuses`.`id`
            WHERE `reservation`.`user_id` = $_SESSION[id] AND `reservation_statuses`.`status_name` = '$status'
            ORDER BY `reservation`.`timestamp` ASC";

    $result = mysqli_query($connect, $sql);
    $response[$status] = array();

    while ($row = mysqli_fetch_assoc($result))
        $response[$status][] = $row;
}

$sql = "SELECT `reservation_archives`.`id`, `cars`.`mark`, `cars`.`model`, `reservation_archives`.`start_date`,
                `reservation_archives`.`finish_date`, `reservation_statuses`.`status_name`, `reservation_archives`.`qr_code_number`
            FROM `reservation_archives`
            INNER JOIN `cars`
            ON `reservation_archives`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation_archives`.`status_id` = `reservation_statuses`.`id`
            WHERE `reservation_archives`.`user_id` = $_SESSION[id]
            ORDER BY `reservation_archives`.`timestamp` ASC";

$result = mysqli_query($connect, $sql);

while ($row = mysqli_fetch_assoc($result))
    $response['archives'][] = $row;

$response['user']['firstname'] = $_SESSION['firstname'];
$response['user']['lastname'] = $_SESSION['lastname'];

echo json_encode($response);
