<?php
$conn = new mysqli("localhost", "root", "", "contact_db");
if ($conn->connect_error) {
    die("Can't connect: " . $conn->connect_error);
}
echo "Database is working!";
$conn->close();
?>