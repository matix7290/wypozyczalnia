<?php
require_once('DB.php');

$sql = "DELETE FROM `reservation` WHERE `reservation`.`id` = $_POST[id]";

$result = mysqli_query($connect, $sql);

if ($result) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
