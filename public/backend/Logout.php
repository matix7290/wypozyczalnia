<?php
session_start();

$_SESSION['id'] = NULL;
$_SESSION['user_type_id'] = NULL;
$_SESSION['username'] = NULL;
$_SESSION['firstname'] = NULL;
$_SESSION['lastname'] = NULL;
$_SESSION['logged'] = false;


echo json_encode('successfully');
