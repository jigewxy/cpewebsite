<?php header('content-type: text/html; charset=utf-8');


if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
  {
$servername = "localhost";
$username = "cpeuser"; 
$password = "Changepwd@12";
$conn = new PDO("mysql:host=localhost; dbname=CPETOOLS", $username, $password);
  }
else
{

$servername = "localhost";
$username = "root";
$conn = new PDO("mysql:host=$servername; dbname=CPETOOLS", $username);
}

try {

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stm = $conn -> prepare ("SELECT * FROM CPETOOL");
$stm -> execute();

$result = $stm -> fetchALL(PDO::FETCH_ASSOC);

//LEARNING -- json_encode() return a STRING which is JSON-ALIKE, but not an actual object. so we can just use echo to output it.
$result = json_encode($result); 

//LEARNING - can't use echo "var_export($result)" here, as that will create an additional quote mark ', which cause the JSON_parse() failure;
echo $result;

} catch(Exception $e){

    echo 'sommary is wrong'.$e->getMessage();
}

?>
