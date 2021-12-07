<?php
session_start();
require_once 'DB.php';

$qr_code_number = rand(1, 8);

$sql = "INSERT INTO `reservation` (
    `user_id`,
    `car_id`,
    `start_date`,
    `finish_date`,
    `qr_code_number`
    )
    values(
        '$_SESSION[id]',
        '$_POST[car_id]',
        '$_POST[start_date]',
        '$_POST[finish_date]',
        '$qr_code_number'
        )";

$res = mysqli_query($connect, $sql);

if ($res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
