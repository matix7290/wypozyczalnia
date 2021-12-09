<?php
session_start();
require_once('DB.php');

$statuses = json_decode($_POST['statusses']);
$response = array();

if (isset($_SESSION['id'])) {
    $sql = "SELECT `reservation`.`id`, `cars`.`mark`, `cars`.`model`, `reservation`.`start_date`,
                `reservation`.`finish_date`, `reservation_statuses`.`status_name`, `reservation`.`qr_code_number`
            FROM `reservation`
            INNER JOIN `cars`
            ON `reservation`.`car_id` = `cars`.`id`
            INNER JOIN `reservation_statuses`
            ON `reservation`.`status_id` = `reservation_statuses`.`id`
            WHERE `reservation`.`user_id` = ? AND `reservation_statuses`.`status_name` = ?
            ORDER BY `reservation`.`timestamp` ASC";

    foreach ($statuses as $key => $status) {
        $stmt = $connect->prepare($sql);
        $stmt->bind_param('is', $_SESSION['id'], $status);
        $res = $stmt->execute();

        if ($res) {
            $response[$status] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        } else {
            $response[$status] = 'fail';
        }
    }

    $response['user']['firstname'] = $_SESSION['firstname'];
    $response['user']['lastname'] = $_SESSION['lastname'];
    $connect->close();
} else {
    $response = 'fail';
}

echo json_encode($response);
