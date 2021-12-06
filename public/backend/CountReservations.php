<?php
require_once('DB.php');

$sql = "SELECT COUNT(*)
        FROM reservation
        WHERE `car_id` = $_POST[id];";

$result = mysqli_query($connect, $sql);
$response = mysqli_fetch_assoc($result)['COUNT(*)'];

echo json_encode($response);
