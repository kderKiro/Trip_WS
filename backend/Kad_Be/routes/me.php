<?php

// Only allow production origin
$allowed_origins = [
  'https://full-trip-ws-i6fv.onrender.com'
];
header('Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com');
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit(0);
}

$SESSION_TIMEOUT = 60 * 60 * 24 * 7;
session_set_cookie_params([
  'lifetime' => $SESSION_TIMEOUT,
  'path' => '/',
  'httponly' => true,
  'secure' => true,
  'samesite' => 'None'
]);
session_start();

if (isset($_SESSION['user_id'])) {
  require_once __DIR__ . '/../db.php';
  try {
    $db = connectDB();
    $stmt = $db->prepare('SELECT user_id, first_name, last_name, email, country, state, currency, phone_num FROM users WHERE user_id = :uid LIMIT 1');
    $stmt->execute([':uid' => $_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
      echo json_encode(['logged_in' => true, 'user' => $user]);
      exit;
    }
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
  }
}

echo json_encode(['logged_in' => false]);
