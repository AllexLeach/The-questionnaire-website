<?php
$connection = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "mysql");

$query = "SELECT * FROM question";
$result = $connection->query($query);

while ($row = $result->fetch()) {
   echo $row['number_q'].'|'.$row['text_q'].'|'.$row['ans'].';';
}
?>