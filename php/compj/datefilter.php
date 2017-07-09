<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$datestart = $_POST['datestart'];
$dateend = $_POST['dateend'];

$returndasta = array();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try{

    //get project data
$stm_pj= $conn->prepare("SELECT * FROM project  WHERE datevr >:datestart AND datevr < :dateend");

$stm_pj->bindParam(':datestart', $datestart, PDO::PARAM_STR);
$stm_pj->bindParam(':dateend', $dateend, PDO::PARAM_STR);

$stm_pj->execute();

$returndata['pjdata'] = $stm_pj->fetchAll(PDO::FETCH_ASSOC);


//get component count
$stm= $conn->prepare("SELECT component, COUNT(component) AS total FROM itemlist
      WHERE project_id IN (SELECT id FROM project WHERE datevr >:datestart AND datevr < :dateend )
      GROUP BY component ORDER BY total DESC");

$stm->bindParam(':datestart', $datestart, PDO::PARAM_STR);
$stm->bindParam(':dateend', $dateend, PDO::PARAM_STR);


$stm->execute();
$returndata['itemcount'] = $stm->fetchAll(PDO::FETCH_ASSOC);



//get Defect fix and New feature count;
$stm_type= $conn->prepare("SELECT type, COUNT(1) AS count FROM itemlist WHERE project_id IN 
(SELECT id FROM project WHERE datevr >:datestart AND datevr < :dateend )
GROUP BY type");

$stm_type->bindParam(':datestart', $datestart, PDO::PARAM_STR);
$stm_type->bindParam(':dateend', $dateend, PDO::PARAM_STR);

$stm_type->execute();

$returndata['typecount'] = $stm_type->fetchAll(PDO::FETCH_ASSOC);

//at last
$returndata['status'] ='success';

}
catch (Exception $e)
{

 echo "Caught exception: ".$e->getMessage()."\n";
}


echo json_encode($returndata, JSON_PRETTY_PRINT);




/*$pjid = $_POST['value'];
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

$returndata['itemlist'] = $itemlist;


echo json_encode($returndata, JSON_PRETTY_PRINT); */

?>