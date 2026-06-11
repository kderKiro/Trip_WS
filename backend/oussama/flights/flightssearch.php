<?php
// backend/oussama_Be/flights/flight_search.php

header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    $dbPath = '../db.php'; 
    if (!file_exists($dbPath)) $dbPath = 'db.php';
    if (!file_exists($dbPath)) throw new Exception("db.php not found");
    require_once $dbPath;
    $pdo = connectDB();

    $input = json_decode(file_get_contents("php://input"));
    
    $tripType = $input->tripType ?? 'oneWay';
    $from     = trim($input->from ?? '');
    $to       = trim($input->to ?? '');
    $depDate  = $input->departureDate ?? '';
    $retDate  = $input->returnDate ?? '';
    $class    = $input->flightClass ?? '';

    function searchFlights($pdo, $originCountry, $destCountry, $date, $classType) {
        // SELECT only needed columns
        $sql = "SELECT * FROM flights WHERE 1=1";
        $params = [];

        // --- STRICT COUNTRY SEARCH ---
        // This now looks ONLY at the 'depart_country' column
        if (!empty($originCountry)) {
            $sql .= " AND depart_country ILIKE :origin";
            $params[':origin'] = "%" . $originCountry . "%"; 
        }

        // This looks ONLY at the 'des_country' column
        if (!empty($destCountry)) {
            $sql .= " AND des_country ILIKE :dest";
            $params[':dest'] = "%" . $destCountry . "%";
        }

        // Date Search
        if (!empty($date)) {
            $sql .= " AND depart_date = :date";
            $params[':date'] = $date;
        }

        // Class Search
        if (!empty($classType)) {
            $sql .= " AND class ILIKE :class";
            $params[':class'] = $classType;
        }

        $sql .= " ORDER BY price ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Process results
        $processed = [];
        $now = new DateTime();

        foreach ($flights as $f) {
            // Combine Date & Time
            $depStr = $f['depart_date'] . ' ' . $f['depart_time'];
            $arrStr = $f['des_date'] . ' ' . $f['des_time'];
            
            $f['departure_full_iso'] = date('Y-m-d\TH:i:s', strtotime($depStr));
            $f['arrival_full_iso']   = date('Y-m-d\TH:i:s', strtotime($arrStr));

            // Format Duration
            $mins = intval($f['duration']);
            $h = floor($mins / 60);
            $m = $mins % 60;
            $f['duration_formatted'] = ($m > 0) ? "{$h}h {$m}m" : "{$h}h";

            // Status
            $depObj = new DateTime($depStr);
            $f['status'] = ($depObj > $now) ? "Scheduled" : "Departed";
            
            $f['airline_name'] = "Flight #" . $f['airplane_id']; 

            $processed[] = $f;
        }
        return $processed;
    }

    $outbound = searchFlights($pdo, $from, $to, $depDate, $class);
    
    $inbound = [];
    if ($tripType === 'roundTrip' && !empty($retDate)) {
        // Swap To/From for return trip
        $inbound = searchFlights($pdo, $to, $from, $retDate, $class);
    }

    echo json_encode([
        "status" => "success",
        "outbound" => $outbound,
        "return" => $inbound
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>