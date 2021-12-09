<?php
require_once('DB.php');

$sql = "UPDATE `reservation` SET `status_id` = 2 WHERE `id` = ?";
$stmt = $connect->prepare($sql);
$stmt->bind_param('i', $_POST['id']);
$res = $stmt->execute();
$connect->close();

if ($res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

echo json_encode($msg);
