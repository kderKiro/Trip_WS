<?php
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['reservation_id'])) {
    echo json_encode(["success" => false, "error" => "Reservation ID required"]);
    exit;
}

try {
    $db = connectDB();
    $stmt = $db->prepare("
        UPDATE hotel_reservations
        SET status = 'Cancelled'
        WHERE hreservation_id = :id
    ");
    $stmt->execute([':id' => $data['reservation_id']]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
