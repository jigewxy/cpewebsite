

<?php header("content-type:text/html; charset:utf-8");

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



try{

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//$stm = $conn -> prepare('INSERT INTO cpetool values(?,?,?,?)');
$stm = $conn -> prepare("INSERT INTO CPETOOL values(:entryid, :title, :link, :description)");
$stm->bindValue(':entryid', $_POST['entryid']);
$stm->bindValue(':title', $_POST['title']);
$stm->bindValue(':link', $_POST['link']);
$stm->bindValue(':description', $_POST['description']);

$stm->execute();


echo $_POST['title'];
} catch(Exception $e){

    echo 'something is wrong'.$e->getMessage();
}


?>