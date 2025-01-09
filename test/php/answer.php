<?php
$connection = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "mysql");

$q = $_REQUEST['q'];

$a = explode("|", $q);
$r = explode(";", $a[0]);
array_pop($r);

$length = count($r);
for ($i=0; $i<$length; $i++) {
   $r[$i] = explode("/", $r[$i]);
}
$a[0] = $r;

$rows = [];
for ($i=0; $i<$length; $i++) {
   $rows[$i] = [$a[1], $a[0][$i][0], $a[0][$i][1]];
}



$row_length = count($rows[0]);
$nb_rows = count($rows);
$length = $nb_rows * $row_length;

/* Fill in chunks with '?' and separate them by group of $row_length */
$args = implode(',', array_map(
   function ($el) {
      return '('.implode(',', $el).')';
   },
   array_chunk(array_fill(0, $length, '?'), $row_length)
));


$params = array();
foreach($rows as $row) {
   foreach($row as $value) {
      $params[] = $value;
   }
}

$query = "INSERT INTO answer (fio, number_q, ans) VALUES ".$args;
$stmt = $connection->prepare($query);
$stmt->execute($params);
?>