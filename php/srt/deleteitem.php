
<?php

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

$itemid= intval($_POST['id']);

try {
$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stm = $conn->prepare("DELETE FROM itemlist WHERE id=:itemid");
$stm->bindParam(':itemid', $itemid, PDO::PARAM_INT);
$stm->execute();

} catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

}

echo "SUCCESS";


?>
