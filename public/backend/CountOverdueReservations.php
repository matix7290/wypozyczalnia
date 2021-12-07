<?php
session_start();
require_once('DB.php');

$statuses = ['waiting', 'accepted', 'overdue'];
$response = array();

$sql = "SELECT COUNT(*)
        FROM `reservation`
        INNER JOIN `reservation_statuses`
        ON `reservation`.`status_id` = `reservation_statuses`.`id`
        WHERE `reservation`.`user_id` = $_SESSION[id] AND `reservation_statuses`.`status_name` = 'overdue'";

$result = mysqli_query($connect, $sql);
$response = mysqli_fetch_assoc($result)['COUNT(*)'];

echo json_encode($response);
