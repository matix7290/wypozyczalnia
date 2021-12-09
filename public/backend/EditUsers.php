<?php
require_once('DB.php');

$data = json_decode($_POST['data']);
$msg = 'success';

$sql = "UPDATE `users` SET `user_type_id` = ?, `active` = ? WHERE `id` = ?";

foreach ($data as $key => $value) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param('sss', $value[0], $value[1], $value[2]);
    $res = $stmt->execute();

    if (!$res) {
        $msg = 'fail';
    }
}

$connect->close();
echo json_encode($msg);
