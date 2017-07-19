<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

$formdata= $_POST;

$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$cname_str = array_reduce(array_keys($formdata),'UtilityFunc::flatten');
$cvalue_str = array_reduce(array_values($formdata),'UtilityFunc::flattenQuote');


//it's safer to use single quote around the external variables to avoid SQL injection attack, however
// the safest way is using bindParam() in production code.
try  {
$stm = $conn -> prepare("INSERT INTO itemlist ({$cname_str}) VALUES ({$cvalue_str})");
$stm->execute();

}
catch (Exeception $e){

echo "ERROR writing to SQL database";
exit();

}

echo "SUCCESS";

?>