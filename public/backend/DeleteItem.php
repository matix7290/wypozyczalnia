<?php
require_once('DB.php');

$sql = "DELETE FROM samochody WHERE id = '$_POST[id]'";
$resoult = mysqli_query($connect, $sql);
$msg = '';
$code = 0;

if ($resoult) {
    $code = 1;
    $msg = 'succesfully';
} else {
    $code = -1;
    $msg = mysqli_errno($connect);
}

echo json_encode(array('msg' => $msg, 'code' => $code, 'sql' => $sql));
