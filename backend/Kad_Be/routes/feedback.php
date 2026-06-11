<?php
require_once __DIR__ . '/../db.php';

$db = connectDB();

$method = $_SERVER['REQUEST_METHOD'];

  $data = json_decode(file_get_contents("php://input"));
  $stmt = $db->prepare('insert into feedbacks (email,feedback) values(:email,:feedback)');
  $success = $stmt->execute([
    ':email' => $data->email,
    ':feedback' => $data->feedback
  ]);

if ($success) {
  echo json_encode(['success' => 'Feedback Added Successfuly']);
              } 
  else {
  http_response_code(401);
  echo json_encode(['error' => 'There is a problem in the backend of the feedback']);
       }
