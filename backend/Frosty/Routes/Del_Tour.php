<?php
require '../Headers.php';
require '../../Database.php';

$db = connectDB();

// Support GET (query param) or JSON body
$json = file_get_contents('php://input');
$payload = json_decode($json, true);
$tour_id = $payload['id'] ?? $_GET['id'] ?? null;

if (!$tour_id) {
    echo json_encode(["success" => false, "message" => "No tour id provided"]);
    exit;
}

try {
    $db->beginTransaction();

    // 1. Delete reservations for this tour
    $stmt = $db->prepare("DELETE FROM tour_reservations WHERE tour_id = :id");
    $stmt->execute([':id' => $tour_id]);

    // 2. Delete departure dates
    $stmt = $db->prepare("DELETE FROM departure_dates WHERE tour_id = :id");
    $stmt->execute([':id' => $tour_id]);

    // 3. Delete highlights
    $stmt = $db->prepare("DELETE FROM highlights WHERE tour_id = :id");
    $stmt->execute([':id' => $tour_id]);

    // 4. Delete the tour itself
    $stmt = $db->prepare("DELETE FROM tours WHERE tour_id = :id");
    $stmt->execute([':id' => $tour_id]);

    $db->commit();

    echo json_encode(["success" => true]);
} catch (\Throwable $th) {
    $db->rollBack();
    echo json_encode(["success" => false, "message" => $th->getMessage()]);
}

