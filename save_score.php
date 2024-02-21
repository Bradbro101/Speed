<?php



require 'get_db_connection.php';
$conn = get_db_connection();

if (!array_key_exists("player_name", $_GET) || $_GET["player_name"] == "") {
    $_GET["player_name"] = "Anon";
}
if (!array_key_exists("player_score", $_GET) || $_GET["player_score"] == "") {
    $_GET["player_score"] = 0;
}

$query = $conn -> prepare("INSERT INTO highscores (player_name, player_score) VALUES(:player_name, :player_score)");

$player_name = $_GET['player_name'];
$player_score = intval($_GET['player_score']);
$query->bindParam(':player_name', $_GET['player_name']);
$query->bindParam(':player_score', $_GET['player_score']);

$query-> execute();

$query = null;
$conn = null;