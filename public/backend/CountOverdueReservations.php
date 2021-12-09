<?php
session_start();
require_once('DB.php');

$sql = "SELECT COUNT(*)
        FROM `reservation`
        INNER JOIN `reservation_statuses`
        ON `reservation`.`status_id` = `reservation_statuses`.`id`
        WHERE `reservation`.`user_id` = ? AND `reservation_statuses`.`status_name` = 'overdue'";

if (isset($_SESSION['id'])) {
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("i", $_SESSION['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $response = $result->fetch_all(MYSQLI_ASSOC)[0]['COUNT(*)'];
        $connect->close();
} else {
        $response = 'fail';
}

echo json_encode($response);
