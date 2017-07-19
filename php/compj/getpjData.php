<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

try {
$pjid = $_POST['value'];
$returndata = array();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


//get project data 
$stm= $conn->prepare("SELECT * FROM project WHERE id=:pjid");
$stm->bindParam(':pjid', $pjid, PDO::PARAM_STR);

$stm->execute();

$pjdata=$stm->fetchAll(PDO::FETCH_ASSOC);
$returndata['pjdata'] = $pjdata[0];

//get itemlist
$stm_item = $conn->prepare("SELECT * FROM itemlist WHERE project_id=:pjid");
$stm_item->bindParam(':pjid', $pjid, PDO::PARAM_STR);
$stm_item->execute();

$itemlist = $stm_item->fetchAll(PDO::FETCH_ASSOC);

$returndata['state'] ="SUCCESS";
$returndata['itemlist'] = $itemlist;


echo json_encode($returndata, JSON_PRETTY_PRINT);
} catch (Exception $e){
    
    $returndata['state'] ="FAIL";
    $returndata['msg'] = $e->getMessage();

echo json_encode($returndata, JSON_PRETTY_PRINT);


}

?>