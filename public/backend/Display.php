<?php
require_once('DB.php');

$sql = 'SELECT * FROM cars
        INNER JOIN cars_prices
        ON cars.vehicle_class_id = cars_prices.id
        INNER JOIN statuses
        ON cars.status_id = statuses.id';

$result = mysqli_query($connect, $sql);
$response = array();

while ($row = mysqli_fetch_assoc($result))
    $response[] = $row;

echo json_encode($response);
