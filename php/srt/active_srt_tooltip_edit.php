
<?php

if (isset($_POST)){


$myFile= '../../data/srt/srt_release_active.json';
include '../../php/util/json_pretty_print.php';

$rootindex = $_POST['rootindex'];
$tooltip = $_POST['tooltip'];


}
//json_decode() - When TRUE, returned objects will be converted into associative arrays.


try {
$arr_data = array();


$arr_data= json_decode(file_get_contents($myFile),true);


$arr_data['releases'][$rootindex-1]['tooltip'] = $tooltip;


$json_data= prettyPrint(json_encode($arr_data, 128));

if(file_put_contents($myFile, $json_data))
 echo 'Tooltips updated successfully';
else
 echo "Update failed";
}  catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
   }


?>