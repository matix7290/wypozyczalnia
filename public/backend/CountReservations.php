<?php
require_once('DB.php');

$sql = "SELECT COUNT(*)
        FROM reservation
        WHERE `car_id` = ?";

if (isset($_POST['id'])) {
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("i", $_POST['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $response = $result->fetch_all(MYSQLI_ASSOC)[0]['COUNT(*)'];
        $connect->close();
} else {
        $response = 'fail';
}

echo json_encode($response);
