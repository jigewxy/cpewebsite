<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc


$returndata=array();

try {
$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stm= $conn->prepare("SELECT pj.id, pj.project_name, pj.revision,pd.year, pd.product_name, pd.division FROM project AS pj INNER 
                 JOIN product AS pd ON pj.product_id=pd.id WHERE pj.currentstate='Completed'");

$stm->execute();            

$pjlist=$stm->fetchAll(PDO::FETCH_ASSOC);
$returndata['pjlist']= $pjlist;

//get full product lsit
$stm_pl = $conn -> prepare("SELECT * FROM product");
$stm_pl->execute();

$pdlist = $stm_pl->fetchAll(PDO::FETCH_ASSOC);

$returndata['state'] ="SUCCESS";
$returndata['pdlist']= $pdlist;


echo json_encode($returndata, JSON_PRETTY_PRINT);
} catch (Exception $e){
    
    $returndata['state'] ="FAIL";
    $returndata['msg'] = $e->getMessage();

echo json_encode($returndata, JSON_PRETTY_PRINT);
}


?>