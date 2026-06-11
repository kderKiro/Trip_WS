<?php
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$db = "full_trip";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB Connection failed"]);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$reservation_id = isset($data['reservation_id']) ? intval($data['reservation_id']) : 0;

if ($reservation_id === 0) {
    echo json_encode(["success" => false, "error" => "Invalid reservation ID"]);
    exit;
}

// Cancel flight (delete or set status to cancelled)
$sql = "UPDATE flight_reservations SET status='Cancelled' WHERE freservation_id=$reservation_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
