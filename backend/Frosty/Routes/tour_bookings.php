<?php

require '../Headers.php';
require '../../Database.php';


$db = connectDB();




try {


    $json = file_get_contents('php://input');
    $payload = json_decode($json, true);
    $tour_id = $payload['id'] ?? $_GET['id'] ?? $_POST['id'] ?? null;

    if ($tour_id === null) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing 'id' in request"
        ]);
        exit;
    }

    $sql = "SELECT users.first_name, users.last_name, users.user_id, users.email, users.phone_num,
                departure_dates.date,
                tour_reservations.reserved_at,
                tour_reservations.tickets_n,
                t_published.price,
                tour_reservations.status FROM
                tour_reservations 
                JOIN
                (select tour_id, price from tours where tour_id= :id) as t_published ON tour_reservations.tour_id = t_published.tour_id
                JOIN
                departure_dates ON departure_dates.tour_id= t_published.tour_id
                JOIN
                users ON users.user_id = tour_reservations.user_id;";
    $stmt = $db->prepare($sql);

    $stmt->execute([
        "id" => $tour_id
    ]);

    $data = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($data, $row);
    }

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
} catch (\Throwable $th) {
    echo "Error Fetching costumers: " . $th;
}
