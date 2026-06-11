<?php
// 1. CORS Headers
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Correct Path to db.php
require_once __DIR__ . '/db.php'; 

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    // Basic validation
    if (!$input) {
        throw new Exception("No data received");
    }

    if (empty($input['user_id']) || empty($input['hotel_id'])) {
        throw new Exception("Missing required fields (user_id or hotel_id).");
    }

    $db = connectDB();

    // 2. Insert Command (Matches your 'hotel_reservations' table schema)
    // hreservation_id is generated automatically, so we skip it.
    
    $sql = "INSERT INTO public.hotel_reservations 
            (user_id, hotel_id, total, start_d, end_d, status) 
            VALUES 
            (:uid, :hid, :total, :start, :end, 'confirmed')";

    $stmt = $db->prepare($sql);
    
    // 3. Execute
    $stmt->execute([
        ':uid'   => $input['user_id'],
        ':hid'   => $input['hotel_id'],
        ':total' => $input['total_price'], // React sends 'total_price' -> DB column 'total'
        ':start' => $input['checkin'],     // React sends 'checkin'     -> DB column 'start_d'
        ':end'   => $input['checkout']     // React sends 'checkout'    -> DB column 'end_d'
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "Hotel reserved successfully!",
        "booking_id" => $db->lastInsertId() 
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>