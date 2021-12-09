<?php
require_once('DB.php');

$sql = "DELETE FROM `reservation` WHERE `reservation`.`id` = ?";

if (isset($_POST['id'])) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("i", $_POST['id']);
    $stmt->execute();
    $res = $stmt->execute();
    $connect->close();

    if ($res) {
        $msg = 'successfully';
    } else {
        $msg = 'failed';
    }
} else {
    $msg = 'fail';
}

$response['msg'] = $msg;

echo json_encode($response);
