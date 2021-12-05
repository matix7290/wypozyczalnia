<?php
require_once 'DB.php';

$rok = intval($_POST['rok']);
$sql = "
UPDATE INTO samochody(marka,model,rocznik,kolor,stan)
values(
    '$_POST[marka]',
    '$_POST[model]',
    '$rok',
    '$_POST[kolor]',
    '$_POST[stan]'
)";

$res = mysqli_query($connect, $sql);

$msg = '';

if ($res) {
    $msg = 'successfully';
} else {
    $msg = 'failed';
}

$response = array('msg' => $msg);

echo json_encode($response);
