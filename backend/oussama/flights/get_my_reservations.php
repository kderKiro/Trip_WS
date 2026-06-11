<?php
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$db = "full_trip";
$user = "root"; // your DB username
$pass = "";     // your DB password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if ($user_id === 0) {
    echo json_encode([]);
    exit;
}

// Fetch user's flight reservations
$sql = "SELECT * FROM flight_reservations WHERE user_id = $user_id";
$result = $conn->query($sql);

$flights = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $flights[] = [
            "freservation_id" => $row['freservation_id'],
            "Airline" => $row['airline'],
            "AirPlane_Id" => $row['airplane_id'],
            "DepartContry" => $row['depart_country'],
            "DepartAirport" => $row['depart_airport'],
            "DepartDate" => $row['depart_date'],
            "DepartTime" => $row['depart_time'],
            "DestinationCountry" => $row['destination_country'],
            "DestinationAirport" => $row['destination_airport'],
            "ArrivalDate" => $row['arrival_date'],
            "ArrivalTime" => $row['arrival_time'],
            "Duration" => $row['duration'],
            "Stops" => intval($row['stops']),
            "Class" => $row['class'],
            "Price" => $row['price'],
            "Status" => $row['status']
        ];
    }
}

echo json_encode($flights);
$conn->close();
