<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

if (isset($_POST)){
    
/*include utility class for reusable functions*/
include '../util/xmldomutil.php';

//echo '<pre> posted data is </pre>';
//echo '<pre>'.var_export($_POST, true).'</pre>';

$pname = $_POST['product'];
$cat= $_POST['cat'];
    
/* trim and remove the whitespace in the product name for later use*/
$pname_trimmed = str_replace(' ', '', strtolower($pname));


try {
    
$cattag = DomUtility::getCatTag($cat);

/*LEARNING format XML using formatOutput and preserveWhiteSpace, and it has to be in the beginning when the DOMDocument is declared in empty */
$pjdb = new DOMDocument('1.0');
$pjdb->formatOutput = TRUE;
$pjdb->preserveWhiteSpace = FALSE; 


$plist = new DOMDocument('1.0');
$plist->formatOutput = TRUE;
$plist->preserveWhiteSpace = FALSE; 


/* Section to remove product from product list */
$plist ->load(DomUtility::dirList);

$listPath = new DOMXpath($plist);

/*query 'oj' tag */
/**LEARNING -- XPATH query always return Nodelist, and can't use removeChild method, since everytime only one product is being deleted, so item(0) can be used to get the node */

$nodeToDel = $listPath->query('//'.$cattag.'/product[.="'.$pname.'"]');
$nodeParent = $listPath->query('//'.$cattag);


$nodeParent->item(0)->removeChild($nodeToDel->item(0));



/*Section to remove product in database */

$dbFilename = DomUtility::getDbFile($cat);
$pjdb -> load($dbFilename);
$dbPath = new DOMXpath($pjdb);


$nodeInList = $dbPath ->query('//productlist/product[.="'.$pname.'"]')->item(0);
$nodeInListParent = $dbPath -> query('//productlist')->item(0);

$nodeInListParent ->removeChild($nodeInList);



$nodeInDb = $dbPath ->query('//'.$pname_trimmed.'root')->item(0);
$nodeInDbParent = $dbPath ->query('/productroot')->item(0);

$nodeInDbParent ->removeChild($nodeInDb);


if (($pjdb->save($dbFilename)) && ($plist->save(DOMUtility::dirList)))
    echo json_encode($_POST);
else 
    echo "Something went wrong";
}   catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
}

?>
