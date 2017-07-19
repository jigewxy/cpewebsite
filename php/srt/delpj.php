<?php

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
// Set the PDO based on server host and database name;

UtilityFunc::authCheck();

$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pjid = $_POST['value'];

try {
$stm = $conn->prepare("DELETE FROM project WHERE id=?");
$stm->bindParam(1, $pjid, PDO::PARAM_INT);

$stm-> execute();
} catch (Exception $e)
{
    echo $e->getMessage();
    exit();
}

echo "SUCCESS";




?>