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
    $sql = "select users.user_id, 
    users.first_name,
    users.last_name,
    users.email,
    users.phone_num,
    users.created_at From tour_reservations join
    (Select tour_id from tours where user_id={$_SESSION['user_id']}) as tours_published ON tour_reservations.tour_id=tours_published.tour_id
    join
    users on users.user_id= tour_reservations.user_id;";


    $users = $db->query($sql);
    $data =array();


    while ($row = $users->fetch(PDO::FETCH_ASSOC)) {

        $sql = "select count_user_bookings({$row['user_id']},{$_SESSION['user_id']});";
        $bookings = $db->query($sql);
        $row['Bookings_num'] = $bookings->fetch(PDO::FETCH_ASSOC)['count_user_bookings'];
        array_push($data, $row);
    }

    echo json_encode([

        "success" => true,
        "UsersData" => $data

    ]);
} catch (\Throwable $th) {
    echo json_encode([
        
        "success" => false,
        "err" => $th
    ]);
}

