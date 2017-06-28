<?php 

//LEARNING: $_POST doesn't accept JSON strings, it only accept: 
//application/x-www-form-urlencoded (standard content type for simple form-posts) or
//multipart/form-data-encoded (mostly used for file uploads)

 
require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$content = file_get_contents("php://input");

$result=json_decode($content, true);
$pjid = array_pop($result);


$stmt_keys = array();
$stmt_vals = array();

try {

$stmt_del = $conn -> prepare("DELETE FROM itemlist WHERE project_id={$pjid}");
$stmt_del->execute();

foreach($result as $index=>$item)
{
//array_splice($item, 0, 1);
unset($item['itemnumber']);
$item['project_id'] = $pjid;
$stmt_keys[$index] = array_reduce(array_keys($item), "UtilityFunc::flatten");
$stmt_vals[$index] = array_reduce(array_values($item), "UtilityFunc::flattenQuote");
$stmt = $conn->prepare("INSERT INTO itemlist ({$stmt_keys[$index]}) VALUES ({$stmt_vals[$index]})");
$stmt->execute();
}

} catch (Exception $e)
{
    echo "Caught exception: ".$e->getMessage()."\n";
}

echo 'success';



?>