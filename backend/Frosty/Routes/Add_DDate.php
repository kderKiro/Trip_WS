<?php
require '../Headers.php';
require '../../Database.php';

$db = connectDB();

$json = file_get_contents('php://input');
$Data = json_decode($json, true);

$date = $Data['Date'];
$Spots = $Data['Spots'];
$tour_id = $Data['tour_id'];

try {


    $sql = " INSERT INTO departure_dates(tour_id,date,spot,reserved_spots) VALUES(:tour_id,:date,:spot,0) ";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        "tour_id" => $tour_id,
        "date" => $date,
        "spot" => $Spots
    ]);

    echo json_encode([
        "success" => true,
        "date_id" => $db->lastInsertId()
    ]);
} catch (\Throwable $th) {
    echo json_encode([
        "success" => false,
        "error" => $th
    ]);
}
