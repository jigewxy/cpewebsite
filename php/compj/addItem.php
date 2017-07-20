<?php
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$formdata = $_POST;

//unset redundant keys
$formdata = UtilityFunc::unsetKeys($formdata, ['pjname']);

$column_name_str = array_reduce(array_keys($formdata), 'UtilityFunc::flatten');
$column_value_str = array_reduce(array_values($formdata), 'UtilityFunc::flattenQuote');

try{
$stm = $conn->prepare("INSERT INTO itemlist ({$column_name_str}) VALUES ({$column_value_str})");
$stm->execute();
} catch(Exeception $e){
 echo "Caught exception: ".$e->getMessage()."\n";
}

echo "SUCCESS";


?>