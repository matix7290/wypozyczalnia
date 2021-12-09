<?php
session_start();
require_once('DB.php');

$response = array();

$sql = "SELECT `users`.`id`, `username`, `users_details`.`firstname`, `users_details`.`lastname`,
                `user_type_id`, `active`
        FROM `users`
        INNER JOIN `users_details` ON `users`.`user_details_id` = `users_details`.id
        INNER JOIN `users_types` ON `users`.`user_type_id` = `users_types`.id
        WHERE `user_type_id` = 2 OR `user_type_id` = 3
        ORDER BY `users`.`id` ASC";

$stmt = $connect->prepare($sql);
$res = $stmt->execute();

if ($res) {
    $response = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $response = 'fail';
}


$connect->close();

echo json_encode($response);
