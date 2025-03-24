<?php
header("Content-Type: application/json");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "restaurant_orders_db"; // New database name

// Connect to new database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed!"]));
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['customer']) || empty($data['order'])) {
    echo json_encode(["status" => "error", "message" => "Invalid order data!"]);
    exit;
}

// Extract customer details
$name = $conn->real_escape_string($data['customer']['name']);
$phone = $conn->real_escape_string($data['customer']['phone']);
$address = $conn->real_escape_string($data['customer']['address']);

// Insert each item into customer_orders table
foreach ($data['order'] as $item) {
    $itemName = $conn->real_escape_string($item['name']);
    $quantity = intval($item['quantity']);
    $price = floatval($item['price']);

    $sql = "INSERT INTO customer_orders (customer_name, phone, address, item_name, quantity, total_price) 
            VALUES ('$name', '$phone', '$address', '$itemName', '$quantity', '$price')";

    if (!$conn->query($sql)) {
        echo json_encode(["status" => "error", "message" => "Order failed: " . $conn->error]);
        exit;
    }
}

// Success response
echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
$conn->close();
?>
