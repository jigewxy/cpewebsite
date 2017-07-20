<?php
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
//get project data 
$stm= $conn->prepare("INSERT INTO product (product_name, year, division) VALUES (:pdname, :year, :div)");
$stm->bindParam(':pdname', $_POST['productname'], PDO::PARAM_STR);
$stm->bindParam(':year', $_POST['year'], PDO::PARAM_STR);
$stm->bindParam(':div', $_POST['division'], PDO::PARAM_STR);

$stm->execute();
} catch (Exception $e)
{
    echo "Caught exception: ".$e->getMessage()."\n";
}

echo "SUCCESS";



?>