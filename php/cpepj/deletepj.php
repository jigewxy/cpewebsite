<?php

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
// Set the PDO based on server host and database name;

$returndata = array();
$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$pjname = $_POST['pj'];

try {
$stm = $conn -> prepare("DELETE FROM project WHERE project_name=?");
$stm->bindParam(1, $pjname, PDO::PARAM_STR);
$stm-> execute();
} catch (Exception $e)
{
    $returndata['state'] = "ERROR";
    $returndata['errmsg'] = $e -> getMessage();
    
    echo json_encode($returndata, JSON_PRETTY_PRINT);
    exit();
}

$returndata['state'] = "SUCCESS";
$returndata['pj'] = $pjname;
echo json_encode($returndata, JSON_PRETTY_PRINT);




?>