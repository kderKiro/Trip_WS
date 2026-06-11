<?php
// ✅ PATH FIXED: db.php is in the same folder
require_once __DIR__ . '/db.php'; 

try {
    $db = connectDB();
    
    // This SQL command fixes the counter for 'creservation_id'
    $sql = "SELECT setval(pg_get_serial_sequence('car_reservations', 'creservation_id'), COALESCE(MAX(creservation_id) + 1, 1), false)";
    
    $stmt = $db->query($sql);
    echo "<h1>✅ Database Fixed!</h1><p>You can now go back to React and reserve a car.</p>";
    
} catch (Exception $e) {
    echo "<h1>❌ Error</h1><p>" . $e->getMessage() . "</p>";
}
?>