<?php
// search_cars.php

// 1. CORS Headers
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// 2. Receive Data from React
$input = json_decode(file_get_contents("php://input"));

// Extract variables
$carType = isset($input->car_type) ? trim($input->car_type) : '';
$brandModel = isset($input->brand_model) ? trim($input->brand_model) : '';
// ✅ NEW: Receive Location
$location = isset($input->location) ? trim($input->location) : '';

try {
    $pdo = connectDB();

    // 3. Base Query
    // ✅ ADDED: 'location' to the SELECT list so it shows on the card
    $sql = "SELECT car_id, car_type, car_brand, model, price, car_image_url, transmission, fuel_type, car_passengers, location 
            FROM cars 
            WHERE 1=1";
    
    $params = [];

    // 4. Filter by Car Type
    if (!empty($carType) && $carType !== "All Types" && $carType !== "Select a car") {
        $sql .= " AND car_type ILIKE :carType";
        $params[':carType'] = trim($carType);
    }

    // 5. Filter by Brand/Model
    if (!empty($brandModel)) {
        $sql .= " AND (car_brand ILIKE :search OR model ILIKE :search)";
        $params[':search'] = "%" . $brandModel . "%";
    }

    // 6. ✅ NEW: Filter by Location
    if (!empty($location)) {
        // We use wildcards (%) so "Algiers" finds "Algiers Airport"
        $sql .= " AND location ILIKE :location";
        $params[':location'] = "%" . $location . "%";
    }

    // Order by Price
    $sql .= " ORDER BY price ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($cars);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>