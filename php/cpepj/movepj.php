<?php 

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$formdata = $_POST;

$pjid = array_shift($formdata);

$formdata['currentstate'] = 'Completed';

$statement = UtilityFunc::getSqlUpdateStmt($formdata);

try {
$stm = $conn -> prepare(" UPDATE project SET {$statement} WHERE id={$pjid}");
$stm->execute();


} catch (Exception $e)
{
    echo "Caught exception: ".$e->getMessage()."\n";
}

echo 'success'; 


?>