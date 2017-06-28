<?php 

class ServerConfig {

const LOCALHOST = "localhost:8080";
const PRODHOST = "cpse.ijp.sgp.rd.hpicorp.net";
const LOCALUSER = "root";
const PRODUSER = "cpeuser";
const PWD = "Changepwd@12"; 

public function setPdo($db)
{

if ($_SERVER['HTTP_HOST'] == self::LOCALHOST)
return new PDO("mysql:host=localhost; dbname=".$db, self::LOCALUSER);

else 
return new PDO("mysql:host=cpse.ijp.sgp.rd.hpicorp.net; dbname=".$db, self::PRODUSER, self::PWD);

}

}

define ('PJDB', "cpeproject");




?>