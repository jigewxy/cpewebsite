<?php
 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc
//PJDB = 'CPEPROJECTS'

try {
$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//create a shallow copy of $_POST array;
$formdata = array_slice($_POST, 0);

try{
$pjid = UtilityFunc::getPjId($formdata['project_name'], $conn)['id'];

if($pjid==false){ throw new Exception("Something wrong with the database connection, please contact Admin."); }
 }
  catch (Exeception $e)
{
   echo 'Failed:'.$e->getMessage();
}

unset($formdata['project_name']);
$formdata['project_id'] = $pjid;


$columns = array_reduce(array_keys($formdata), "UtilityFunc::flatten");
$values = array_reduce(array_values($formdata), "UtilityFunc::flattenQuote");





$stm = $conn->prepare("INSERT INTO itemlist({$columns}) VALUES ({$values})");

$result = $stm->execute();

if($result) { echo "success";}
else  throw new Exception("Something wrong with the database connection, please contact Admin.");
} 
catch(Exeption $e)

{
   echo 'Failed:'.$e->getMessage();
}


?>