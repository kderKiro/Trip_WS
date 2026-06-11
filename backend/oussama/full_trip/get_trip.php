<?php
include "./db.php";

$tripId = $_GET['trip_id'] ?? 1;

// Trip
$tripQuery = $conn->prepare("SELECT * FROM full_trips WHERE trip_id = ?");
$tripQuery->bind_param("i", $tripId);
$tripQuery->execute();
$trip = $tripQuery->get_result()->fetch_assoc();

// Includes
$includes = [];
$res = $conn->query("SELECT icon, label FROM full_trip_includes WHERE trip_id = $tripId");
while ($row = $res->fetch_assoc()) {
    $includes[] = $row;
}

// Highlights
$highlights = [];
$res2 = $conn->query("SELECT highlight FROM full_trip_highlights WHERE trip_id = $tripId");
while ($row = $res2->fetch_assoc()) {
    $highlights[] = $row['highlight'];
}

echo json_encode([
    "success" => true,
    "trip" => $trip,
    "includes" => $includes,
    "highlights" => $highlights
]);
