<?php
require_once('DB.php');

$sql = 'SELECT cars.id, mark, model, vehicle_class, price
        FROM cars
        INNER JOIN cars_prices
        ON cars.vehicle_class_id = cars_prices.id
        INNER JOIN cars_statuses
        ON cars.status_id = cars_statuses.id';

$stmt = $connect->prepare($sql);
$stmt->execute();
$response = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$connect->close();

echo json_encode($response);
