<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

include '../util/xmldomutil.php';
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

/*special note -- instead of modifying the corresponding Node directly, the old node was deleted first, and then insert the new node by comparing the node value of <date/>, this is to make sure release entry are re-arranged in chronological order */
if(isset($_POST)){
$pname = $_POST['product'];
$cat = $_POST['cat'];
$index = $_POST['deletion'];


try {
$pjdb = new DOMDocument('1.0');
$pjdb -> formatOutput=true;
$pjdb -> preserveWhiteSpace=false;

$dbFile=DomUtility::getDbFile($cat);
$pjdb->load($dbFile);

$dbPath= new DOMXpath($pjdb);

$pnode = $dbPath -> query('//'.$pname)->item(0);

$relNodes = $dbPath -> query('//'.$pname.'//release');

$nodeToDel = $relNodes -> item($index);

$pnode -> removeChild($nodeToDel);


$version = $nodeToDel->getElementsByTagName('version')[0]->nodeValue;

$returnData=array(
'version'=>$version,
'index'=>$index
);

if($pjdb -> save($dbFile))
    print json_encode($returnData);
else 
    echo 'Something is wrong';
}
    
catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

}


?>
