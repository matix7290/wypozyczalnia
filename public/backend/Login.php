<?php
require_once 'DB.php';

session_start();

$sql = "SELECT `users`.`id`, `users`.`password`, `users`.`user_details_id`, `users`.`user_type_id`, `users_details`.`firstname`, `users_details`.`lastname`
FROM `users`
INNER JOIN `users_details`
ON `users`.`user_details_id` = `users_details`.`id`
WHERE `username` = '$_POST[username]'";

$res = mysqli_query($connect, $sql);
$response = array();

while ($row = mysqli_fetch_assoc($res))
    $response[] = $row;

$password = $response[0]['password'];

if ($password !== null && $password === $_POST['password']) {
    $msg = 'successfully';
    $_SESSION['id'] = $response[0]['id'];
    $_SESSION['user_type_id'] = $response[0]['user_type_id'];
    $_SESSION['username'] = $_POST['username'];
    $_SESSION['firstname'] = $response[0]['firstname'];
    $_SESSION['lastname'] = $response[0]['lastname'];
    $_SESSION['logged'] = true;
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
