<?php
// backend/Mohammed/Attractions/search_attractions.php

// 1. Handle CORS first
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle Preflight Request (The "OPTIONS" check)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// 3. Get Input
$input = json_decode(file_get_contents("php://input"));
$searchTerm = isset($input->city) ? trim($input->city) : '';
$category = isset($input->category) ? trim($input->category) : '';

try {
    $pdo = connectDB();

    // 4. Build Query
    $sql = "SELECT attrac_id, name, location, category, price, rating, attrac_img_url 
            FROM attractions 
            WHERE 1=1";
    
    $params = [];

    // Search by Name OR Location (using ILIKE for case-insensitive search)
    if (!empty($searchTerm)) {
        $sql .= " AND (name ILIKE :search OR location ILIKE :search)";
        $params[':search'] = "%" . $searchTerm . "%";
    }

    // Filter by Category
    if (!empty($category)) {
        $sql .= " AND category = :category";
        $params[':category'] = $category;
    }

    // Optional: Limit results to prevent massive payloads if search is empty
    $sql .= " LIMIT 50";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $attractions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Always return an array, even if empty
    echo json_encode($attractions ?: []);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}