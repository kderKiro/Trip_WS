<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
$trip_id = $data['trip_id'] ?? null;
$tickets = $data['tickets'] ?? 1;
$total_price = $data['total_price'] ?? 0;

if (!$user_id || !$trip_id) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO full_trip_reservations
    (user_id, trip_id, tickets, total_price, payment_status)
    VALUES (?, ?, ?, ?, 'PAID')
");

$stmt->bind_param("iiid", $user_id, $trip_id, $tickets, $total_price);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
