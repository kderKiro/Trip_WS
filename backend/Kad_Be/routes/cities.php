<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if (strlen($query) < 3) {
  echo json_encode(['data' => []]);
  exit;
}

$url = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
  'q' => $query,
  'format' => 'json',
  'limit' => 5,
  'addressdetails' => 0
]);

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'User-Agent: Full_Trip_App'
  ],
  CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($curlError) {
  http_response_code(500);
  echo json_encode(['error' => 'cURL Error: ' . $curlError]);
  exit;
}

if ($httpCode !== 200) {
  http_response_code(500);
  echo json_encode(['error' => 'Nominatim API returned status ' . $httpCode]);
  exit;
}

$results = json_decode($response, true) ?: [];

$cities = array_map(function($item) {
  return [
    'id' => $item['place_id'],
    'name' => $item['display_name'],
    'lat' => $item['lat'],
    'lon' => $item['lon']
  ];
}, $results);

echo json_encode(['data' => $cities]);
?>
