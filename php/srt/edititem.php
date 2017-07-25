<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

UtilityFunc::authCheck();

try{

$conn = ServerConfig::setPdo(SRTDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pjdata = array_slice($_POST, 0, 17);
$itemdata = array_slice($_POST, 17);

//prepare statements to update [project] table
$pjid =$pjdata['project_id'];
unset($pjdata['project_id']);

$pj_str = UtilityFunc::getSqlUpdateStmt($pjdata);

$stm = $conn -> prepare(" UPDATE project SET {$pj_str} WHERE id={$pjid}");
$stm->execute();

//prepare statements to update [itemlist] table

//only update itemlist where there are existing items
if(empty($itemdata)==false)
{
    $count = sizeof($itemdata['id']);
    $itemid_arr= $itemdata['id'];

    $itemstr_arr = array_fill(0, $count, '');

//iterate the $itemdata array and form the statement string
foreach ($itemdata as $colname=>$val_arr){

 foreach ($val_arr as $key=>$value){
    if ($itemstr_arr[$key]=='')
    $itemstr_arr[$key].= $colname."=\"".addslashes($value)."\"";
    else
    $itemstr_arr[$key].=",".$colname."=\"".addslashes($value)."\"";
    }
}

foreach($itemstr_arr as $key=>$value){
    $itemid= $itemid_arr[$key];
    $stm = $conn -> prepare(" UPDATE itemlist SET {$value} WHERE id={$itemid}");
    $stm->execute();
}
}

echo "SUCCESS";


} catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

}

?>