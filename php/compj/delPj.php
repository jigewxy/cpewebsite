<?php
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try{

    $stm = $conn->prepare("DELETE FROM project WHERE project_name = :pjname");
    $stm->bindParam(":pjname", $_POST['pjToDel'], PDO::PARAM_STR);

    $stm->execute();

} catch (Exception $e)
{

    echo "Caught exception: ".$e->getMessage()."\n";
}


echo "success";

?>