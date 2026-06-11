<?php
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $resId = $input['reservation_id'] ?? null;

    if (!$resId) {
        throw new Exception("Reservation ID missing");
    }

    $db = connectDB();

    $sql = "DELETE FROM car_reservations WHERE creservation_id = :rid";
    $stmt = $db->prepare($sql);
    $stmt->execute([':rid' => $resId]);

    echo json_encode(["success" => true, "message" => "Reservation cancelled"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>