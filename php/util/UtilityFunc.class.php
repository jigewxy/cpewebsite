<?php

class UtilityFunc {

//flatten associative array with double quote
public static function flattenQuote($carry, $item){
$item = addslashes(trim($item));
if(isset($carry))
return $carry.','.'"'.$item.'"';
else
return '"'.$item.'"';
}

//flatten associative array
public static function flatten($carry, $item){
//LEARNING: another alternative is to use mysqli_real_escape_string()
$item = addslashes(trim($item));
if(isset($carry))
return $carry.','.$item;
else
return $item;
}

/* FUNCTION to get project_id  from project table*/
public static function getPjId($pjname, $conn)
{

$stm = $conn -> prepare("SELECT id FROM project WHERE project_name=?");
$stm->bindParam(1, $pjname, PDO::PARAM_STR);

$result = $stm-> execute();

if($result)
{$pjid = $stm->fetch(PDO::FETCH_ASSOC);
return $pjid;}

else 
return false;

}


}

?>

