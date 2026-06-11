<?php
require '../Headers.php';
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require '../../Database.php';
session_start();



$db = connectDB();


$json = file_get_contents('php://input');
$Tour_Data = json_decode($json, true);

// Check if JSON is valid
if ($Tour_Data === null && json_last_error() !== JSON_ERROR_NONE) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid JSON format received.']);
    exit;
}



$errors = [];

// --- Helper function for cleaner code ---
function get_val($data, $key, $default = null)
{
    return isset($data[$key]) ? $data[$key] : $default;
}

// 2. Validate Basic Form Data
$fields = [
    'tourName'    => 'Tour Name is required',
    'destination' => 'Destination is required',
    'description' => 'Description is required',
    'duration'    => 'Duration is required',
    'amount'      => 'Amount is required'
];

foreach ($fields as $key => $msg) {
    if (empty(trim(get_val($Tour_Data, $key, '')))) {
        $errors[$key] = $msg;
    }
}

// 3. Validate Departure_Dates (Array of Objects)
$dDates = get_val($Tour_Data, 'Departure_Dates', []);
if (!is_array($dDates) || empty($dDates)) {
    $errors['Departure_Dates'] = "At least one departure date is required.";
} else {
    foreach ($dDates as $index => $item) {
        if (empty($item['Date'])) $errors["Date_$index"] = "Date is missing in item $index";
        if (!isset($item['Spots']) || !is_numeric($item['Spots'])) {
            $errors["Spots_$index"] = "Valid number of spots required for date $index";
        }
    }
}

// 4. Validate Highlights (Array of Strings)
$highlights = get_val($Tour_Data, 'Highlights', []);


// 5. Validate Inclusions (Array)
$inclusions = get_val($Tour_Data, 'Inclusions', []);


// --- Final Response ---
if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
} else {
    $highlights = filter_var_array($highlights, FILTER_SANITIZE_SPECIAL_CHARS);

    $tourname = filter_var($Tour_Data['tourName'], FILTER_SANITIZE_SPECIAL_CHARS);
    $destination = filter_var($Tour_Data['destination'], FILTER_SANITIZE_SPECIAL_CHARS);
    $description = filter_var($Tour_Data['description'], FILTER_SANITIZE_SPECIAL_CHARS);
    $duration = filter_var($Tour_Data['duration'], FILTER_SANITIZE_NUMBER_INT);
    $amount = filter_var($Tour_Data['amount'], FILTER_SANITIZE_NUMBER_INT);


    //Insertion:
    try {


        $db->beginTransaction();
        // 1. The SQL with named placeholders
        $sql = "INSERT INTO tours ( user_id,
            tour_name, rating, rate_count, location,description, duration, price, flight, hotel, meals, guided_tours
        ) VALUES (:user_id,
            :tour_name, :rating, :rate_count, :location,:description, :duration, :price, :flight, :hotel, :meals, :guided_tours
        ) ";

        $stmt = $db->prepare($sql);

        // 2. Execute with the data array
        $stmt->execute([
            'user_id'        => $_SESSION['user_id'],
            'tour_name'      => $tourname,
            'rating'         => 5,
            'rate_count'     => 0,
            'location'       => $destination,
            'description'    => $description,
            'duration'       => $duration,
            'price'          => $amount,
            'flight'         => (int)in_array("Flight", $inclusions),
            'hotel'          => (int)in_array("Hotel", $inclusions),
            'meals'          => (int)in_array("Meals", $inclusions),
            'guided_tours'   => (int)in_array("Guided_Tours", $inclusions)
        ]);

        $tour_id = $db->lastInsertId();

        //insert into heighlights:

        $sql_2 = "Insert Into highlights(tour_id,description) values(:tour_id,:description)";
        $stmt_2 = $db->prepare($sql_2);
        foreach ($highlights as $highlight) {
            $H_desc = $highlight['Highlight_Detail'];

            $stmt_2->execute([
                "tour_id" => $tour_id,
                "description" => $H_desc
            ]);
        }


        //insert into Departure Dates:
        $sql_3 = "Insert into departure_dates(tour_id,date,spot,reserved_spots) values(:tour_id,:date,:spot,:reserved_spots)";
        $stmt_3 = $db->prepare($sql_3);

        foreach ($dDates as $DDate) {

            $Date = $DDate['Date'];
            $Spots = $DDate['Spots'];

            $stmt_3->execute([
                "tour_id" => $tour_id,
                "date" => $Date,
                "spot" => $Spots,
                "reserved_spots" => 0
            ]);
        }


        $db->commit();
        echo "Transaction Completed";
    } catch (\Throwable $th) {
        $db->rollBack();
        echo "Transaction Failed \n" . $th->getMessage();
    }
}
