<?php 

class ServerConfig {

const LOCALHOST = "localhost:8080";
//const LOCALHOST_HTTPS = "localhost";
const PRODHOST = "cpse.ijp.sgp.rd.hpicorp.net";
//const PRODHOST_HTTPS = "cpse.ijp.sgp.rd.hpicorp.net:443";
const LOCALUSER = "root";
const PRODUSER = "cpeuser";
const PWD = "Changepwd@12"; 

public function setPdo($db)
{

if ($_SERVER['HTTP_HOST'] =="cpse.ijp.sgp.rd.hpicorp.net")
return new PDO("mysql:host=localhost; dbname=".$db, self::PRODUSER, self::PWD);

else 
return new PDO("mysql:host=localhost; dbname=".$db, self::LOCALUSER);

}

}

define ('PJDB', "cpeproject");
define ('TOOLS', "cpetools");
define('SRTDB', 'srtproject');



?>