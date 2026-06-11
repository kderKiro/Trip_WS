<?php

require '../../Database.php';
require '../Headers.php';

$SESSION_TIMEOUT = 60 * 60 * 24 * 7;
session_set_cookie_params([
    'lifetime' => $SESSION_TIMEOUT,
    'path' => '/',
    'httponly' => true,
    'secure' => true,
    'samesite' => 'None'
]);


session_start();
$db = connectDB();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    try {
        // 1. Prepare the query with a placeholder
        $sql = "SELECT * FROM users WHERE user_id = :id";
        $stmt = $db->prepare($sql);

        // 2. Execute with the session ID
        $stmt->execute(['id' => $_SESSION['user_id']]);

        // 3. Fetch the result
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Send data with a 200 OK status
            echo json_encode([
                "status" => "success",
                "data" => $user
            ]);
        } else {
            // User not found
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "User not found"
            ]);
        }
    } catch (PDOException $e) {
        // Database error
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // 1. Basic trimming to remove accidental whitespace

    $json = file_get_contents('php://input');
    $User_Data = json_decode($json, true);

    $first_name = trim($User_Data['firstName']);
    $last_name  = trim($User_Data['lastName']);
    $email      = trim($User_Data['email']);
    $phone_num  = trim($User_Data['phoneNumber']);

    // 2. Validation Logic
    if (empty($first_name) || empty($last_name)) {
        die("Name fields cannot be empty.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }

    // Simple regex for phone numbers (adjust based on your required format)
    if (!preg_match('/^[0-9+ \-()]{7,20}$/', $phone_num)) {
        die("Invalid phone number format.");
    }

    try {
        // Assuming $pdo is your existing PDO connection object

        // The SQL query with named placeholders
        $sql = "UPDATE users 
            SET first_name = :fname, 
                last_name = :lname, 
                phone_num = :phone ,
                email = :email
                WHERE user_id={$_SESSION['user_id']}";

        $stmt = $db->prepare($sql);

        // Binding the parameters to the placeholders
        $stmt->bindParam(':fname', $first_name);
        $stmt->bindParam(':lname', $last_name);
        $stmt->bindParam(':phone', $phone_num);
        $stmt->bindParam(':email', $email);

        // Execute the statement
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Update failed.";
        }
    } catch (PDOException $e) {
        echo "Database error: " . $e->getMessage();
    }
};
