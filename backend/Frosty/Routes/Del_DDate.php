<?php

require '../Headers.php';
require '../../Database.php';
$db = connectDB();

$id = $_GET['id'] ?? null;



if ($id) {
    $sql = "DELETE FROM departure_dates WHERE ddate_id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute([':id' => $id]);

    echo json_encode([
        "success" => true, 
        "rows_affected" => $stmt->rowCount()
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No ID provided"]);
}