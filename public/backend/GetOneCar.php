<?php
require_once('DB.php');

$sql = "SELECT * FROM cars
        INNER JOIN cars_prices
        ON cars.vehicle_class_id = cars_prices.id
        INNER JOIN cars_statuses
        ON cars.status_id = cars_statuses.id
        WHERE cars.id = ?";

$response = array();
$infoKey = ['id', 'mark', 'model', 'price', 'vehicle_class_id', 'status_id', 'status_name', 'vehicle_class'];

if (isset($_POST['id'])) {
    $stmt = $connect->prepare($sql);
    $stmt->bind_param('i', $_POST['id']);
    $res = $stmt->execute();


    if ($res) {
        $res = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        foreach ($res as $key => $rows) {
            foreach ($rows as $key => $row) {
                if (in_array($key, $infoKey)) {
                    $response['info'][$key] = $row;
                } else {
                    $response['data'][$key] = $row;
                }
            }
        }


        $response['res'] = 'success';
    } else {
        $response['res'] = 'fail';
    }

    $connect->close();
} else {
    $response['res'] = 'fail';
}

echo json_encode($response);
