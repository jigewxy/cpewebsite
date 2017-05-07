<?php

/* function to reindex the entries in database */
function reindex($arr_data) {	


 foreach ($arr_data['releases'] as $key => $value )
 {
	$value['rootindex']=$key+1;	 
	$arr_data['releases'][$key]=$value;
 }

 return $arr_data;
}


function reindexitem($itemlist){
	
	for ($i=0; $i< sizeof ($itemlist); $i++)
{
	$itemlist[$i]['itemnumber'] = $i+1;

}

return $itemlist;
	
	
}

?>