<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

include '../util/xmldomutil.php';
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

/*special note -- instead of modifying the corresponding Node directly, the old node was deleted first, and then insert the new node by comparing the node value of <date/>, this is to make sure release entry are re-arranged in chronological order */

if(isset($_POST)){

if (empty(trim($_POST['sarel'])))
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

    
$pname = $_POST['product'];
$cat = $_POST['cat'];
$pjindex = $_POST['index'];

try {
    
    
$dbFile = DomUtility::getDbFile($cat);

$pjdb = new DOMDocument('1.0');
$pjdb -> formatOutput = true;
$pjdb -> preserveWhiteSpace = false;


$pjdb -> load($dbFile);
$dbPath = new DOMXpath($pjdb);
    

/*create new node <release></release>*/
$newEntry = $pjdb-> createElement('release');

        
/*loop through the formdata and create new node based on the value */      
foreach ($formdata as $key=>$value){  
$newEntry->appendChild($pjdb->createElement($key,$value));  
}

/* Remove the node first and add again, this is to ensure the insertion is in chronological order */
$pnode = $dbPath -> query('//'.$pname)->item(0);
$nodeToEdit= $pnode ->getElementsByTagName('release')[$pjindex];
$pnode->removeChild($nodeToEdit);

 /*]find the node to insertBefore, if no node is found, then just append */
$relNodes = $dbPath -> query('//'.$pname.'//release');
$time= $_POST['date'];
$nodeToInsert = DomUtility::findNodeToInsert($relNodes, $time);
        

if (isset($nodeToInsert))
$pnode->insertBefore($newEntry, $nodeToInsert);
else
$pnode->appendChild($newEntry);


if ($pjdb->save($dbFile))
 print $_POST['version'];
else 
    echo 'Something is wrong';
}
    
catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

}

?>
