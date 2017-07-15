<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$pjcat = $_POST['value'];
$returndata = array();



$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//get project data 

try {
if($pjcat == "ACTIVE")
{ $stm= $conn->prepare("SELECT * FROM project WHERE state IN ('Ongoing', 'On Hold', 'Upcoming')"); } 
else
{$stm= $conn->prepare("SELECT * FROM project WHERE state='Completed'");}

$stm->execute();

} 
catch (Exception $e)
{
 $returndata['state'] ='ERROR';
 echo json_encode($returndata, JSON_PRETTY_PRINT);
 exit();
}

$entries=$stm->fetchAll(PDO::FETCH_ASSOC);
$returndata['state'] ='SUCCESS';
$returndata['entries'] = $entries;


echo json_encode($returndata, JSON_PRETTY_PRINT);

?>