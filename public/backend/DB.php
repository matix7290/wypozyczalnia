<?php
$server = 'localhost';
$user = 'root';
$password = '';
$db = 'car-sharing';

$connect = @new mysqli($server, $user, $password, $db);

if ($connect->connect_errno) die('Nie ma połączenia z MySQL');
