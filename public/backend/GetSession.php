<?php
session_start();

$names = json_decode($_POST['names']);
$response = array();

foreach ($names as $key => $name) {
    $response[$name] = $_SESSION[$name];
}

echo json_encode($response);
