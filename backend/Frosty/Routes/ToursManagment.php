<?php
require '../Headers.php';
require '../../Database.php';
$db = connectDB();

$SESSION_TIMEOUT = 60 * 60 * 24 * 7;
session_set_cookie_params([
    'lifetime' => $SESSION_TIMEOUT,
    'path' => '/',
    'httponly' => true,
    'secure' => true,
    'samesite' => 'None'
]);

session_start();


try {

    $data = array();




    $sql = "Select * from tours where user_id= {$_SESSION['user_id']}";

    $result = $db->query($sql);

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {

        $highlights = $db->query("Select description from highlights where tour_id= {$row['tour_id']} ");
        $DepartureDates = $db->query("Select * from departure_dates where tour_id= {$row['tour_id']} ");

        $highlight_arr = array();
        $DDates_arr = array();

        while ($highlight = $highlights->fetch(PDO::FETCH_ASSOC)) {

            array_push($highlight_arr, $highlight['description']);
        }
        while ($DDate = $DepartureDates->fetch(PDO::FETCH_ASSOC)) {

            array_push($DDates_arr, $DDate);
        }

        $row['highlights'] = $highlight_arr;
        $row['departure_dates'] = $DDates_arr;

        array_push($data,$row);
    }

    echo json_encode($data);

} catch (\Throwable $th) {

    echo "Getting Data Failed: " . $th->getMessage();
}
