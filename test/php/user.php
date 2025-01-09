<?php
$connection = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "mysql");

$input_data = $_REQUEST['q'];
$user_info = explode("/", $input_data);

$params = [
   'fio' => '',
   'age' => ''
];

$length = count($user_info);
for ($i=0; $i<$length; $i++) {
   if ($i==0) {
      $params['fio'] = $user_info[$i];
   } else {
      $params['age'] = $user_info[$i];
   }
}

$sql = "INSERT INTO users (fio, age) VALUE (:fio, :age)";
$query = $connection->prepare($sql);
$query->execute($params);
?>