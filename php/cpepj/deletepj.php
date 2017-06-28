<?php

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
// Set the PDO based on server host and database name;

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$pjname = $_POST['pj'];

$stm = $conn -> prepare("DELETE FROM project WHERE project_name=?");
$stm->bindParam(1, $pjname, PDO::PARAM_STR);

$stm-> execute();

echo $pjname;




?>