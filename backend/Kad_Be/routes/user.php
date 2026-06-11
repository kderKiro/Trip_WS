<?php

$SESSION_TIMEOUT = 60 * 60 * 24 * 7;

session_set_cookie_params([
  'lifetime' => $SESSION_TIMEOUT,
  'path' => '/',
  'httponly' => true,
  'secure' => true,
  'samesite' => 'None'
]);

session_start();

if (isset($_SESSION['LAST_ACTIVITY'])) {
  if (time() - $_SESSION['LAST_ACTIVITY'] > $SESSION_TIMEOUT) {
    session_unset();
    session_destroy();

    http_response_code(401);
    echo json_encode(['error' => 'Session expired']);
    exit;
  }
}

$_SESSION['LAST_ACTIVITY'] = time();

error_log("Received " . $_SERVER['REQUEST_METHOD'] . " request to users endpoint");
error_log("Request body: " . file_get_contents('php://input'));

require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

$db = connectDB();

switch ($method) {
  case 'GET':
    $stmt = $db->query('select * from users order by created_at desc');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    break;

  case 'POST':
    $data = json_decode(file_get_contents('php://input'));
    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

    try {
      $stmt = $db->prepare(
        'insert into users 
        (first_name, last_name, email, country, state, currency, phone_num, password) 
        values 
        (:first_name, :last_name, :email, :country, :state, :currency, :phone_num, :password) returning *'
      );

      $stmt->execute([
        ':first_name' => $data->first_name,
        ':last_name' => $data->last_name,
        ':email' => $data->email,
        ':country' => $data->country,
        ':state' => $data->state,
        ':currency' => $data->currency,
        ':phone_num' => $data->phone_num,
        ':password' => $hashedPassword
      ]);

      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($user) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['email']   = $user['email'];

        http_response_code(201);
        echo json_encode(['success' => true, 'user' => $user]);
      } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user']);
      }
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => $e->getMessage()]);
    }

    break;

  case 'PUT':
    $data = json_decode(file_get_contents('php://input'));
    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('update users set first_name = :first_name ,last_name=:last_name ,email=:email,country=:country,state=:state,currency=:currency,phone_num =:phone_num ,password =:password where user_id =:user_id returning *');
    $stmt->execute([
      ':user_id' => $data->user_id,
      ':first_name' => $data->first_name,
      ':last_name' => $data->last_name,
      ':email' => $data->email,
      ':country' => $data->country,
      ':state' => $data->state,
      ':currency' => $data->currency,
      ':phone_num' => $data->phone_num,
      ':password' => $hashedPassword
    ]);
    break;

  case 'DELETE':
    $data = json_decode(file_get_contents('php://input'));
    $stmt = $db->prepare('delete from users where user_id =:user_id');
    $stmt->execute([
      'user_id' => $data->user_id
    ]);
    break;

  default:
    echo json_encode(["error" => "There is a fault in users.php"]);
}
