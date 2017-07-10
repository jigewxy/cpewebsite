<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 


include '../util/xmldomutil.php';
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

if (isset($_POST)){


if (trim($_POST['sarel'])==false)
    $sarel = 'NA';
else 
    $sarel = $_POST['sarel'];
    

$formdata= array(

  'version' => $_POST['version'],
  'fwversion' => $_POST['fwversion'],
  'date' => $_POST['date'],
  'arel' => $_POST['arel'],
  'sarel' => $sarel,
  'narel' => $_POST['narel'],
  'branch' => $_POST['branch'],
  'type' => $_POST['type'],
  'owner' => $_POST['owner']
);
    
$pname =$_POST['product'];
$cat=$_POST['cat'];


    try{
        



 /*remember to format the XMLDOM */
$pjdb = new DOMDocument('1.0');
$pjdb -> formatOutput=true;
$pjdb -> preserveWhiteSpace=false;

$dbFile=DomUtility::getDbFile($cat);
$pjdb->load($dbFile);

$dbPath= new DOMXpath($pjdb);

/*query the product node */ 
$pnode = $dbPath -> query('//'.$pname)->item(0);

        
        
$time =$_POST['date'];
$relNodes = $dbPath -> query('//'.$pname.'//release');

        
/*create new node <release></release>*/
$newEntry = $pjdb-> createElement('release');

        
/*loop through the formdata and create new node based on the value */
        

foreach ($formdata as $key=>$value){
    
$newEntry->appendChild($pjdb->createElement($key,$value));
    
    
}

 /*find the node to insertBefore, if no node is found, then just append */
$nodeToInsert = DomUtility::findNodeToInsert($relNodes, $time);
        

if (isset($nodeToInsert))
$pnode->insertBefore($newEntry, $nodeToInsert);
else
$pnode->appendChild($newEntry);

        
        
//if ($pjdb->save($dbFile))
if($pjdb->save($dbFile))
 print json_encode($_POST);
else 
    echo 'Something is wrong';
}
    
catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

}

?>
