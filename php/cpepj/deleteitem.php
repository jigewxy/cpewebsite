<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

try{
//extract the items to be deleted
$itemlist = array_keys($_POST);

$item_str = array_reduce($itemlist,'UtilityFunc::flatten');

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stm = $conn -> prepare("DELETE FROM itemlist WHERE id IN ({$item_str})");

$result = $stm->execute();

if(!$result){

 throw new Exception ("Fail to delete the entry or entry not found"); 
}

} catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

}

echo "SUCCESS";

?>