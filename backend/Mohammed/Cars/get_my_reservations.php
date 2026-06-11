<?php
// File: backend/Mohammed/Cars/get_my_reservations.php

header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

try {
    if (!isset($_GET['user_id'])) {
        throw new Exception("User ID is required");
    }
    
    $userId = intval($_GET['user_id']); 
    $db = connectDB();

    // ---------------------------------------------------------
    // LOGIC FIX: Update status from 'active' to 'Complete'
    // ---------------------------------------------------------
    $updateSql = "UPDATE car_reservations 
                  SET status = 'Complete' 
                  WHERE return_d < CURRENT_DATE 
                  AND status = 'active'";
    $db->query($updateSql);

    // 4. Fetch Reservations with JOIN
    $sql = "SELECT 
                r.creservation_id, 
                r.pickup_d, 
                r.return_d, 
                r.pickup_l, 
                r.return_l, 
                r.status,
                r.created_at,        
                c.car_brand, 
                c.model, 
                c.car_type, 
                c.transmission,
                c.fuel_type,
                c.car_passengers,
                c.price, 
                c.car_image_url
            FROM car_reservations r
            LEFT JOIN cars c ON r.car_id = c.car_id
            WHERE r.user_id = :uid
            ORDER BY r.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute([':uid' => $userId]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If no reservations, return empty array instead of null
    echo json_encode($reservations ? $reservations : []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>