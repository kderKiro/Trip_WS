<?php
header("Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/db.php";

try {
    if (!isset($_GET['user_id'])) {
        throw new Exception("User ID required");
    }

    $uid = intval($_GET['user_id']);
    $db = connectDB();

    // Auto-complete expired reservations
    $db->query("
        UPDATE hotel_reservations
        SET status = 'Complete'
        WHERE end_d < CURRENT_DATE AND status = 'Active'
    ");

    $sql = "
        SELECT 
            r.hreservation_id,
            r.start_d,
            r.end_d,
            r.status,
            r.total,
            h.h_name,
            h.h_location,
            h.h_image_url,
            h.price
        FROM hotel_reservations r
        JOIN hotels h ON h.hotel_id = r.hotel_id
        WHERE r.user_id = :uid
        ORDER BY r.start_d DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([':uid' => $uid]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($rows as $row) {
        $start = new DateTime($row['start_d']);
        $end = new DateTime($row['end_d']);

        $data[] = [
            "hreservation_id" => $row['hreservation_id'],
            "h_name" => $row['h_name'],
            "h_location" => $row['h_location'],
            "h_image_url" => $row['h_image_url'],
            "price" => (float)$row['price'],
            "start_d" => $start->format("Y-m-d"),
            "end_d" => $end->format("Y-m-d"),
            "nights" => $start->diff($end)->days,
            "status" => $row['status'],
            "total" => (float)$row['total']
        ];
    }

    echo json_encode($data);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
