<?php

// Edel Sherratt October 2022
// random leaderboard demo.
// retrieve the top n (name, score)s from the database

// open a connection to the database as a PDO
require 'get_db_connection.php';
$conn = get_db_connection();

// a single query with no parameters, no need for a prepared statement
$query = "SELECT player_name, player_score FROM highscores ORDER BY player_score DESC LIMIT 10";

$result = $conn->query($query);

// pass an array of names and scores back to the JavaScript program
echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));

// close the connection
$conn = null;

