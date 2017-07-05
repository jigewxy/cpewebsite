<?php
class DomUtility
{
   // date_default_timezone_set('Asia/Singapore');
    
  public static $DbMap = array (
        'Officejet Pro'=> "../../data/cpereleases/ojpro_release.xml",
        'Officejet'=> "../../data/cpereleases/oj_release.xml",
        'Pagewide' => "../../data/cpereleases/pws_release.xml",
        'Consumer' => "../../data/cpereleases/ics_release.xml",
        'Mobile' => "../../data/cpereleases/mobile_release.xml",
        
    );
    
  public static $CatMap = array (
        'Officejet Pro'=> "ojpro",
        'Officejet'=> "oj",
        'Pagewide' => "pws",
        'Consumer' => "consumer",
        'Mobile' => "mobile",
        
    );  

 const dirList = '../../data/cpereleases/product_list.xml';
    
   public function getDbFile($arg) {
       
       return self::$DbMap[$arg];
       
   }
    
   public function getCatTag($arg){
       
       return self::$CatMap[$arg];
   }
    
    
    
    
    /*find the appropriate node to create new node 
find nodedate > $time, and insert before that node, if can't find, then just append */  
/*arg1 is a nodelist contains <release/>, arg2 is the posted $time */
public function findNodeToInsert($arg1, $arg2) 
{
$t=new DateTime('2000-01-01'); //dummy date
    
$arg2 = strtotime($arg2);
foreach($arg1 as $x){
    
$t=strtotime($x->getElementsByTagName('date')->item(0)->nodeValue);
/*loop until it finds a date later than the posted date and then insert */
if ($t >$arg2) 
    return $x;
else
    continue;
 
}
    /* if no node find later than posted date, just return null and append */
return null;
    
}

    
    
    
    
    
   
}

/*Iterate Nodelist and copy it to a temp dom - learning purpose only*/
/* LEARNING ** need to copy $x node and then append, can't directly append as $x node belongs to the other DOMdocument */

/*$temp_dom = new DOMDocument('1.0');
$i=0;

foreach ($products as $x){

 $temp_dom->appendChild( $temp_dom->importNode($x, true));

$i++;
echo 'i='.$i;
} 
echo gettype($temp_dom);

echo '<pre> xpath is </pre>';
echo '<pre>'.$temp_dom->saveXML().'</pre>'; */


?>
