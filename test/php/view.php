<?php
$connection = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "mysql");

$query = "SELECT * FROM answer";
$result = $connection->query($query);
$ajax_answer = '';

while ($row = $result->fetch()) {
   $ajax_answer = $ajax_answer.$row['fio'].'|'.$row['number_q'].'/'.$row['ans'].';';
}

echo $ajax_answer;
// echo '<table><tr><th>ФИО</th><th>Номер вороса</th><th>Ответ</th></tr>';
// while ($row = $result->fetch()) {
//    echo "<tr><td>".$row['fio']."</td><td>".$row['number_q']."</td><td>".$row['ans']."</td></tr>";
// }
// echo '</table>';
?>