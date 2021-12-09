<?php
require_once('DB.php');

$sql = "UPDATE `reservation` SET `start_date` = ?, `finish_date` = ? WHERE `id` = ?";
$stmt = $connect->prepare($sql);
$stmt->bind_param('ssi', $_POST['start_date'], $_POST['finish_date'], $_POST['id']);
$res = $stmt->execute();
$connect->close();

if ($res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

echo json_encode($msg);
