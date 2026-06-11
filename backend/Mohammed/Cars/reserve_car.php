<?php
// backend/Mohammed/Cars/reserve_car.php

header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php'; 

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!$input) {
        throw new Exception("No data received");
    }

    $db = connectDB();

    // -------------------------------------------------------------
    // STEP 1: STRICT OVERLAP CHECK
    // -------------------------------------------------------------
    // We explicitly cast ::date to ensure Postgres doesn't treat them as strings
    $checkSql = "SELECT COUNT(*) FROM car_reservations 
                 WHERE user_id = :uid 
                 AND car_id = :cid 
                 AND status = 'active'
                 AND (pickup_d::date <= :new_return::date 
                      AND return_d::date >= :new_pickup::date)";

    $checkStmt = $db->prepare($checkSql);
    
    // Parameters for the check
    $checkParams = [
        ':uid' => $input['user_id'],
        ':cid' => $input['car_id'],
        ':new_return' => $input['return_d'], 
        ':new_pickup' => $input['pickup_d']
    ];
    
    $checkStmt->execute($checkParams);
    $count = $checkStmt->fetchColumn();

    // -------------------------------------------------------------
    // DEBUGGING BLOCK (Removable later)
    // -------------------------------------------------------------
    // If you open the Network Tab in your browser > Response, you will see this
    if ($count > 0) {
        echo json_encode([
            "success" => false, 
            "error" => "Dates overlap! You already booked this car.",
            "debug_count" => $count,
            "debug_params" => $checkParams
        ]);
        exit;
    }

    // -------------------------------------------------------------
    // STEP 2: INSERT IF CLEAR
    // -------------------------------------------------------------
    $sql = "INSERT INTO car_reservations 
            (user_id, car_id, pickup_d, return_d, pickup_l, return_l, status) 
            VALUES 
            (:uid, :cid, :pickup_d, :return_d, :pickup_l, :return_l, 'Pending')"; 

    $stmt = $db->prepare($sql);
    
    $stmt->execute([
        ':uid' => $input['user_id'],
        ':cid' => $input['car_id'],
        ':pickup_d' => $input['pickup_d'],
        ':return_d' => $input['return_d'],
        ':pickup_l' => $input['pickup_l'],
        ':return_l' => $input['return_l']
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "Reservation created",
        "debug_note" => "No overlap found (Count was 0)"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>