<?php
require_once 'DB.php';

$usernames_sql = "SELECT username FROM users";
$stmt = $connect->prepare($usernames_sql);
$stmt->execute();
$usernames = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

foreach ($usernames as $key => $value) {
    if ($_POST['username'] === $value['username']) {
        $response['msg'] = 'duplicated';
        echo json_encode($response);
        exit();
    }
}


$id_sql = "SELECT id FROM users ORDER BY id DESC LIMIT 1";
$stmt = $connect->prepare($id_sql);
$stmt->execute();
$id = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]['id'] + 1;

$house_number = intval($_POST['house_number']);

$address_sql = "INSERT INTO `addresses_details`(
    `id`,
    `street`,
    `house_number`,
    `apartment_number`,
    `city`,
    `postcode`
    )
    values(?, ?, ?, ?, ?, ?)";

$stmt = $connect->prepare($address_sql);

if (intval($_POST['apartment_number'])) {
    $apartment_number = intval($_POST['apartment_number']);
    $stmt->bind_param('isiiss', $id, $_POST['street'], $house_number, $apartment_number, $_POST['city'], $_POST['postcode']);
} else {
    $apartment_number = null;
    $stmt->bind_param('isisss', $id, $_POST['street'], $house_number, $apartment_number, $_POST['city'], $_POST['postcode']);
}

$address_res = $stmt->execute();

$card_sql = "INSERT INTO `cards_details` (
    `id`,
    `owner_firstname`,
    `owner_lastname`,
    `card_number`,
    `expiry_date`,
    `cvv2`)
    values(?, ?, ?, ?, ?, ?)";

$stmt = $connect->prepare($card_sql);
$stmt->bind_param('isssss', $id, $_POST['owner_firstname'], $_POST['owner_lastname'], $_POST['card_number'], $_POST['expiry_date'], $_POST['cvv2']);
$card_res = $stmt->execute();

$phone = intval($_POST['phone']);
$contact_sql = "INSERT INTO `contacts_details`(
    `id`,
    `phone`,
    `email`
    )
    values(?, ?, ?)";

$stmt = $connect->prepare($contact_sql);
$stmt->bind_param('iis', $id, $phone, $_POST['email']);
$contact_res = $stmt->execute();

$details_sql = "INSERT INTO `users_details`(
    `id`,
    `firstname`,
    `lastname`,
    `age`
    )
    values(?, ?, ?, ?)";

$stmt = $connect->prepare($details_sql);
$stmt->bind_param('isss', $id, $_POST['firstname'], $_POST['lastname'], $_POST['age']);
$details_res = $stmt->execute();

$user_sql = "INSERT INTO `users`(
    `id`,
    `username`,
    `password`,
    `user_details_id`,
    `contact_details_id`,
    `address_details_id`,
    `card_details_id`)
    values(?, ?, ?, ?, ?, ?, ?)";

$stmt = $connect->prepare($user_sql);
$stmt->bind_param('issiiii', $id, $_POST['username'], $_POST['password'], $id, $id, $id, $id);
$user_res = $stmt->execute();
$connect->close();


if ($address_res && $card_res && $contact_res && $details_res && $user_res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

$response['msg'] = $msg;
echo json_encode($response);
