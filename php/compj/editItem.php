<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc


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

echo "success";

/*Array
(
    [cat] => Major roll
    [revision] => 001.1648A
    [skus] => Weber Mid; Weber Base
    [uniquefw] => 2
    [roi] => $100000
    [datevr] => 2016-11-15
    [livedate] => 2017-01-09
    [fdudate] => 2017-02-07
    [mfgdate] => 2017-02-23
    [pm] => Cliff Wang
    [fw] => Ravi Shankar
    [sq] => Duma Gaylord
    [scmkey] => 
    [signature] => 123123sdfsdf
    [branch] => frz_2016_weber_base_mid_vr1_3
    [fwlink] => \\blrsvr1.psr.rd.hpicorp.net\release\sh_release\weber_base_mid_vr1_3
    [project_id] => 45
    [tooltip] => Project Terminated
    [crid] => Array
        (
            [0] => 367812
            [1] => 392876
            [2] => 378722
        )

    [type] => Array
        (
            [0] => Defect Fix
            [1] => Defect Fix
            [2] => Defect Fix
        )

    [summary] => Array
        (
            [0] => Dynamic Pen security
            [1] => <script>alert("hello world!)</script>
            [2] => WSD fixes
        )

    [requestor] => Array
        (
            [0] => SIE
            [1] => SIE
            [2] => CA
        )

    [fixer] => Array
        (
            [0] => Erik Ness
            [1] => Erik Ness
            [2] => Neeraj
        )

    [testteam] => Array
        (
            [0] => SQ
            [1] => SQ
            [2] => SQ
        )

    [products] => Array
        (
            [0] => 123SDF
            [1] => 123SDF
            [2] => Weber Base; Weber Mid
        )

    [sha] => Array
        (
            [0] => ASDFASDF
            [1] => ASDFASDF
            [2] => sd123124
        )

    [id] => Array
        (
            [0] => 176
            [1] => 177
            [2] => 178
        )

    [component] => Array
        (
            [0] => UI
            [1] => UI
            [2] => UI
        )

) */




?>