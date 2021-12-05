<?php
session_start();

$value = $_POST['value'] === 'true' ? true : $_POST['value'];
$value = $_POST['value'] === 'false' ? false : $_POST['value'];

$_SESSION[$_POST['name']] = $value;

echo json_encode($_SESSION[$_POST['name']]);
