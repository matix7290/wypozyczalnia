<?php
require_once('DB.php');

$foreward = "select status from information_schema.events where event_name = 'symulation_foreward'";
$backward = "select status from information_schema.events where event_name = 'symulation_backward'";

$stmt = $connect->prepare($foreward);
$stmt->execute();
$response['foreward'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]['status'];

$stmt = $connect->prepare($backward);
$stmt->execute();
$response['backward'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]['status'];

$connect->close();

echo json_encode($response);
