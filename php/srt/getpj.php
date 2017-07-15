<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$pjid = $_POST['value'];
$returndata = array();



$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//get project data 

try {

$stm= $conn->prepare("SELECT * FROM project WHERE id=:pjid");
$stm->bindParam(':pjid', $pjid, PDO::PARAM_STR);
$stm->execute();

$pjdata=$stm->fetchAll(PDO::FETCH_ASSOC);

$stm_b = $conn->prepare("SELECT * FROM itemlist WHERE project_id=:pjid");
$stm_b->bindParam(':pjid', $pjid, PDO::PARAM_STR);
$stm_b->execute();

$itemlist=$stm_b->fetchAll(PDO::FETCH_ASSOC);
} 
catch (Exception $e)
{

 $returndata['state'] ='ERROR';
 echo json_encode($returndata, JSON_PRETTY_PRINT);
 exit();
}

$returndata['state'] = 'SUCCESS';
$returndata['pjdata'] = $pjdata;
$returndata['itemlist'] = $itemlist;


echo json_encode($returndata, JSON_PRETTY_PRINT);

?>