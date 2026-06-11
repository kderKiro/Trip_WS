<?php

// Only allow production origin
$allowed_origins = [
  'https://full-trip-ws-i6fv.onrender.com'
];
header('Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com');
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

session_unset();
session_destroy();

setcookie(session_name(), '', [
  'expires' => time() - 3600,
  'path' => '/',
  'secure' => false,
  'httponly' => true,
  'samesite' => 'None'
]);

echo json_encode(['success' => true]);
