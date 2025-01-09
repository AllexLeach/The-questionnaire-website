<?php
$connection = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "mysql");

$query = "SELECT * FROM users";
$result = $connection->query($query);
$ajax_answer = '';

while ($row = $result->fetch()) {
   $ajax_answer = $ajax_answer.$row['id_user'].'|'.$row['fio'].'/'.$row['age'].';';
}

echo $ajax_answer;
?>