<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc


UtilityFunc::authCheck();

try{

    $conn = ServerConfig::setPdo(PJDB);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pjdata = array_slice($_POST, 0, 18);
    $itemdata = array_slice($_POST, 18);

    //prepare statements to update [project] table
    $pjdata['id'] =$pjdata['project_id'];
    $pjid= $pjdata['id'];
    unset($pjdata['project_id']);

    $pj_str ='';
    foreach($pjdata as $key=>$value){
    if($pj_str=='')
    $pj_str.= $key."=\"".addslashes($value)."\"";
    else
    $pj_str.= ",".$key."=\"".addslashes($value)."\"";

}

$stm = $conn -> prepare(" UPDATE project SET {$pj_str} WHERE id={$pjid}");
$stm->execute();

//prepare statements to update [itemlist] table

//get the size of item list

//only update itemlist where there are existing items
if(empty($itemdata)==false)
{
$count = sizeof($itemdata['id']);
$itemid_arr= $itemdata['id'];
$itemstr_arr = array();

for($i=0; $i<$count; $i++)
{
  $itemstr_arr[$i]='';
}
//iterate the $itemdata array and form the statement string
foreach ($itemdata as $colname=>$val_arr){

 foreach ($val_arr as $key=>$value){
if ($itemstr_arr[$key]=='')
$itemstr_arr[$key].= $colname."=\"".addslashes($value)."\"";
else
$itemstr_arr[$key].=",".$colname."=\"".addslashes($value)."\"";
}
}

//print_r($itemcol_value);

foreach($itemstr_arr as $key=>$value){
$itemid= $itemid_arr[$key];
$stm = $conn -> prepare(" UPDATE itemlist SET {$value} WHERE id={$itemid}");
$stm->execute();
}
}

} catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

} 

echo "SUCCESS";


?>