<?php
session_start();
require_once 'DB.php';

$sql = "INSERT INTO `reservation` (
    `user_id`,
    `car_id`,
    `start_date`,
    `finish_date`
    )
    values(
        '$_SESSION[id]',
        '$_POST[car_id]',
        '$_POST[start_date]',
        '$_POST[finish_date]'
        )";

$res = mysqli_query($connect, $sql);

if ($res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
