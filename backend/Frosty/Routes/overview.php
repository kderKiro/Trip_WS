<?php
require '../../Database.php';
require '../Headers.php';




$SESSION_TIMEOUT = 60 * 60 * 24 * 7;
session_set_cookie_params([
    'lifetime' => $SESSION_TIMEOUT,
    'path' => '/',
    'httponly' => true,
    'secure' => true,
    'samesite' => 'None'
]);

session_start();


$db = connectDB();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "Failed", "message" => "User not logged in"]);
    exit(); // Stop the script! Don't run the SQL.
}


try {

    $sql = " SELECT tour_reservations.treservation_id as id,
                users.first_name as first_name ,
                users.last_name as last_name,
                tours.tour_name as tour_name,
                tour_reservations.reserved_at as reserved_at,
                tour_reservations.status as status FROM 
                tour_reservations JOIN (SELECT tour_id FROM tours 
                where user_id={$_SESSION['user_id']}) as tours_published ON
                tour_reservations.tour_id= tours_published.tour_id
                JOIN
                users ON tour_reservations.user_id = users.user_id
                JOIN 
                tours ON tours.tour_id=tour_reservations.tour_id
                
                ORDER BY reserved_at
                limit 10;
                ;";
    $data = array();


    $result = $db->query($sql);


    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {

        array_push($data, $row);
    }

    echo json_encode([
        "status"=>"success",
        "data"=> $data
    ]);

} catch (\Throwable $th) {
        echo json_encode([
        "status"=>"Failed",
        "ERR"=> $th
    ]);
}
