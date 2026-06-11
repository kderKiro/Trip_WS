<?php

// Only allow production origin
$allowed_origins = [
  'https://full-trip-ws-i6fv.onrender.com'
];
header('Access-Control-Allow-Origin: https://full-trip-ws-i6fv.onrender.com');
header('Vary: Origin');

header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit(0);
}

require_once __DIR__ . '/db.php';

$endpoint = $_GET['endpoint'] ?? null;

switch ($endpoint) {
  case 'users':
    require_once __DIR__ . '/routes/user.php';
    break;

  case 'feedback':
    require_once __DIR__ . '/routes/feedback.php';
    break;

  case 'cities':
    require_once __DIR__ . '/routes/cities.php';
    break;

  case 'flights':
    require_once __DIR__ . '/routes/flights.php';
    break;

  case 'hotels':
    require_once __DIR__ . '/routes/hotels.php';
    break;

  case 'login':
    require_once __DIR__ . '/routes/login.php';
    break;

  case 'logout':
    require_once __DIR__ . '/routes/logout.php';
    break;

  case 'me':
    require_once __DIR__ . '/routes/me.php';
    break;

  default:
    http_response_code(404);
    echo json_encode(["error" => "Unknown endpoint"]);
}
