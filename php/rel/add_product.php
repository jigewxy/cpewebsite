<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

if (isset($_POST)){
    

/*include utility class for reusable functions*/
include '../util/xmldomutil.php';


$year = $_POST['year'];
$cat = $_POST['cat'];
$product= $_POST['product'];
$product_trimed = str_replace(' ', '', $_POST['product']);

try {
 /*get file name and category name in productlist */
$filename = DomUtility::getDbFile($cat);
$cattag= DomUtility::getCatTag($cat);

/*load the XMLDom for product list and relevant database */

$pjdb= new DOMDocument('1.0'); 
$pjdb -> formatOutput=true;
$pjdb -> preserveWhiteSpace=false;

$plist = new DomDocument('1.0');
$plist -> formatOutput=true;
$plist -> preserveWhiteSpace=false;

/*load database file, for example: ojpro_release.xml */
$pjdb -> load($filename);

/*product_list.xml path*/
$plist ->load(DomUtility::dirList);

$pjdb->formatOutput=true;
$plist->formatOutput=true;


/*set XPATH for later use */
$dbPath= new DOMXPath($pjdb);
$listPath= new DOMXPath($plist);



/* use XPATH to query different categories, which will return a Nodelist */

$productNode = $listPath->query("//".$cattag);

/*create child node using posted $product as value */
/*LEARNING $newNode is DomElement Class , not DomNode or Domdocument */
$newNode= $plist->createElement("product", $product);

/* create attribute node and assign value */
$newAttr = $plist->createAttribute("year");
$newAttr->value=$year;

/*append attribute node */
$newNode->appendChild($newAttr);
$productNode->item(0)->appendChild($newNode);

$rootNode = $dbPath -> query("//productroot");

$newDbNodeName = strtolower($product_trimed).'root';
$newDbNode= $pjdb->createElement($newDbNodeName);

$rootNode->item(0)->appendChild($newDbNode);




$productListNode= $dbPath ->query ("//productlist");


/*LEARNING try to find the <year> element with value $year, determines whether we should create new <year> element */
if ($dbPath->query('//year[.='.$year.']')->length==0)
{
 $newYearNode = $pjdb -> createElement('year', $year);
    /* insert year at last */
 $productListNode->item(0)-> appendChild($newYearNode);
   
}

/*new node in product list */
$newPlNode = $pjdb -> createElement('product', $product);
$newYearAttr = $pjdb -> createAttribute("year");
$newYearAttr ->value =$year;

$newPlNode->appendChild($newYearAttr);

$productListNode->item(0)->appendChild($newPlNode);

/*save database xml file */

    
    
if ($pjdb->save($filename) && $plist->save(DomUtility::dirList))
 print json_encode($_POST);
else 
    echo 'Something is wrong';
}
    
catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

}
?>
