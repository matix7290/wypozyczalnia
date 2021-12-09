<?php
session_start();
require_once 'DB.php';

$qr_code_number = rand(1, 7);

$sql = "INSERT INTO `reservation` (
    `user_id`,
    `car_id`,
    `start_date`,
    `finish_date`,
    `qr_code_number`
    )
    values(?, ?, ?, ?, ?)";

if (isset($_SESSION['id']) && isset($_POST['car_id']) && isset($_POST['start_date']) && isset($_POST['finish_date'])) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param('iissi', $_SESSION['id'], $_POST['car_id'], $_POST['start_date'], $_POST['finish_date'], $qr_code_number);
    $res = $stmt->execute();
    $connect->close();

    if ($res) {
        $msg = 'successfully';
    } else {
        $msg = 'failed';
    }
} else {
    $msg = 'failed';
}


$response['msg'] = $msg;

echo json_encode($response);
