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
    
    if (!$input) {
        throw new Exception("No data received");
    }

    // Check if user is logged in
    if (empty($input['user_id'])) {
        throw new Exception("User ID is missing. Please log in.");
    }

    $db = connectDB();

    // 2. Insert Command (Updated for 'flight_reservations')
    // We are only inserting into the columns that exist in your screenshot.
    // The credit card info is received but not stored (since there are no columns for it).
    
    $sql = "INSERT INTO flight_reservations 
            (user_id, flight_id, total, status) 
            VALUES 
            (:uid, :fid, :total, 'confirmed')";

    $stmt = $db->prepare($sql);
    
    // 3. Execute
    $stmt->execute([
        ':uid'   => $input['user_id'],
        ':fid'   => $input['flight_id'],
        ':total' => $input['amount']  // React sends 'amount', we save it as 'total'
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "Flight booked successfully!",
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