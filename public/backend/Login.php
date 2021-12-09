<?php
require_once 'DB.php';
session_start();

$sql = "SELECT `users`.`id`, `users`.`password`, `users`.`user_details_id`, `users`.`user_type_id`, `users_details`.`firstname`, `users_details`.`lastname`, `users`.`active`
FROM `users`
INNER JOIN `users_details`
ON `users`.`user_details_id` = `users_details`.`id`
WHERE `users`.`username` = ?";

if (isset($_POST['username']) && isset($_POST['password'])) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param('s', $_POST['username']);
    $access = $stmt->execute();

    if ($access) {
        $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $password = $res[0]['password'];
        $status = $res[0]['active'];

        if ($password === $_POST['password'] && $status == 1) {
            $msg = 'successfully';
            $_SESSION['id'] = $res[0]['id'];
            $_SESSION['user_type_id'] = $res[0]['user_type_id'];
            $_SESSION['username'] = $_POST['username'];
            $_SESSION['firstname'] = $res[0]['firstname'];
            $_SESSION['lastname'] = $res[0]['lastname'];
            $_SESSION['logged'] = true;
        } else if ($status == 0) {
            $msg = 'deactivated';
        } else {
            $msg = 'failed';
        }
    } else {
        $msg = 'failed';
    }

    $connect->close();
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
