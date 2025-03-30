<?php

$servername = "sql302.infinityfree.com";
$username = "if0_38579178";
$password = "pdaiZK0Q2LvJII";
$database = "if0_38579178_coffie";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve and sanitize inputs
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate inputs
if (empty($name) || empty($email) || empty($message)) {
    die("Some fields are empty. Please fill all the details.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email format.");
}

// Prepare the SQL query
$sql = "INSERT INTO contact_messages (name, email, message, submitted_at) VALUES (?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die("Error preparing statement: " . $conn->error);
}

// Bind parameters
$stmt->bind_param("sss", $name, $email, $message);

// Execute and check success
if ($stmt->execute()) {
    echo "Message submitted successfully!";
    header("Location: contact.html");
    exit;
} else {
    die("Execute failed: " . $stmt->error);
}

// Close resources
$stmt->close();
$conn->close();

?>
