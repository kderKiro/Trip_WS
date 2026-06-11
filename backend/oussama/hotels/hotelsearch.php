<?php
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");        
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$input = json_decode(file_get_contents("php://input"));

$place  = isset($input->place) ? trim($input->place) : '';
$budget = isset($input->budget) ? $input->budget : '';

try {
    $pdo = connectDB();

    $sql = "SELECT hotel_id, h_name, h_location, h_rating, h_stars, h_image_url, amenities, description, price 
            FROM hotels 
            WHERE 1=1";
    
    $params = [];

    if (!empty($place)) {
        $sql .= " AND (h_location ILIKE :place OR h_name ILIKE :place)";
        $params[':place'] = "%" . $place . "%";
    }

    if (!empty($budget) && is_numeric($budget)) {
        $sql .= " AND price <= :budget";
        $params[':budget'] = $budget;
    }

    $sql .= " ORDER BY h_rating DESC, price ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($hotels);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>