<?php
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


try{
$stm = $conn->prepare("DELETE FROM product WHERE product_name = :pdname");
$stm->bindParam(":pdname", $_POST['product'], PDO::PARAM_STR);

$stm->execute();

//$stmb= $conn->prepare("DELETE FROM project WHERE product_id=(SELECT id FROM PRODUCT WHERE product_name =:pdname)");
//$stmb->bindParam(":pdname", $_POST['product'], PDO::PARAM_STR);

//$stmb->execute();
} catch (Exception $e)
{

 echo "Caught exception: ".$e->getMessage()."\n";
}


echo "SUCCESS";

?>