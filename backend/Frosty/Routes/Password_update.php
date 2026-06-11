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

if ($_SERVER['REQUEST_METHOD'] == "GET") {

    try {
        $SQL = "SELECT password from users 
    where user_id={$_SESSION['user_id']};";

        $result = $db->query($SQL);

        if ($result->rowCount() > 0) {
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $hashed_pass = $row['password'];
        }


        $password = $_GET['curr_pass'];

        if (password_verify($password, $hashed_pass)) {
            echo "Password Match";
        } else {
            echo "Current Password Doesn't match";
        }
    } catch (\Throwable $th) {
        echo "failed to verify password: " . $th;
    }
} elseif ($_SERVER['REQUEST_METHOD'] == "POST") {


    $json = file_get_contents('php://input');
    $password_data = json_decode($json, true);

    $new_password = trim($password_data['new_password']);
    $confirmed_password = trim($password_data['confirmed_pass']);

    if ($new_password == $confirmed_password) {

        try {
            $hashed_pass = password_hash($new_password, PASSWORD_DEFAULT);

            $sql = "UPDATE users SET password = :pass WHERE user_id = :id";
            $stmt = $db->prepare($sql);

            // 3. Execute and pass the data as an array
            $user_id=$_SESSION['user_id'];

            $stmt->execute([
                "pass"=>$hashed_pass,
                "id"=>$user_id
            ]);
            echo "password updated";
        } catch (\Throwable $th) {

            echo "Failed to Update Password: " . $th;
        }
    } else {
        echo "not confirmed";
    }
}
