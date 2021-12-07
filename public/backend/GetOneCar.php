<?php
require_once('DB.php');

$sql = "SELECT * FROM cars
        INNER JOIN cars_prices
        ON cars.vehicle_class_id = cars_prices.id
        INNER JOIN cars_statuses
        ON cars.status_id = cars_statuses.id
        WHERE cars.id = '$_POST[id]'";

$result = mysqli_query($connect, $sql);
$response = array();
$infoKey = ['id', 'mark', 'model', 'price', 'vehicle_class_id', 'status_id', 'status_name', 'vehicle_class'];

if ($result) {
    while ($rows = mysqli_fetch_assoc($result)) {
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

echo json_encode($response);
