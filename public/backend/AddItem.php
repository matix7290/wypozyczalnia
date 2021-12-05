<?php
require_once 'DB.php';

$sql = "SELECT id FROM users ORDER BY id DESC LIMIT 1";

$res = mysqli_query($connect, $sql);
$id = intval(mysqli_fetch_assoc($res)['id']) + 1;

$house_number = intval($_POST['house_number']);

$address = "INSERT INTO `addresses_details`(
    `id`,
    `street`,
    `house_number`,
    `apartment_number`,
    `city`,
    `postcode`
    )
    values(
    '$id',
    '$_POST[street]',
    '$house_number',";

if (intval($_POST['apartment_number'])) {
    $apartment_number = intval($_POST['apartment_number']);
    $address = $address . "'$apartment_number',";
} else {
    $address = $address . "NULL,";
}

$address = $address . "'$_POST[city]','$_POST[postcode]')";

$card = "INSERT INTO `cards_details` (
    `id`,
    `owner_firstname`,
    `owner_lastname`,
    `card_number`,
    `expiry_date`,
    `cvv2`)
    values(
        '$id',
        '$_POST[owner_firstname]',
        '$_POST[owner_lastname]',
        '$_POST[card_number]',
        '$_POST[expiry_date]',
        '$_POST[cvv2]'
        )";

$phone = intval($_POST['phone']);
$contact = "INSERT INTO `contacts_details`(
    `id`,
    `phone`,
    `email`
    )
    values(
    '$id',
    '$phone',
    '$_POST[email]'
    )";

$details = "INSERT INTO `users_details`(
    `id`,
    `firstname`,
    `lastname`,
    `age`
    )
    values(
    '$id',
    '$_POST[firstname]',
    '$_POST[lastname]',
    '$_POST[age]'
    )";

$user = "INSERT INTO `users`(
    `id`,
    `username`,
    `password`,
    `user_details_id`,
    `contact_details_id`,
    `address_details_id`,
    `card_details_id`)
    values(
        '$id',
        '$_POST[username]',
        '$_POST[password]',
        '$id',
        '$id',
        '$id',
        '$id'
        )";

$address_res = mysqli_query($connect, $address);
$card_res = mysqli_query($connect, $card);
$contact_res = mysqli_query($connect, $contact);
$details_res = mysqli_query($connect, $details);
$user_res = mysqli_query($connect, $user);

if ($res) {
    if ($address_res && $card_res && $contact_res && $details_res && $user_res) {
        $msg = 'successfully';
    } else {
        $msg = 'failed';
    }
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;

echo json_encode($response);
