<?php
require_once('DB.php');

if ($_POST['name'] === 'foreward') {
    if ($_POST['status'] === 'ENABLE') {
        $connect->query("ALTER EVENT symulation_foreward ENABLE");
        $connect->query("ALTER EVENT symulation_backward DISABLE");
    } else {
        $connect->query("ALTER EVENT symulation_foreward DISABLE");
    }
} else {
    if ($_POST['status'] === 'ENABLE') {
        $connect->query("ALTER EVENT symulation_backward ENABLE");
        $connect->query("ALTER EVENT symulation_foreward DISABLE");
    } else {
        $connect->query("ALTER EVENT symulation_backward DISABLE");
    }
}


$connect->close();
echo json_encode($_POST['status']);
