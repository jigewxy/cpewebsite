<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 



if(isset($_POST)){
	
$arr_data=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);
if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";
//echo '<pre>'.'Posted Data'.'</pre>';
//echo '<pre>'.var_export($_POST, true).'</pre>';

$category = $_POST['category'];
$productname= $_POST['productname'];
$projectname= $_POST['projectname'];


try {
/*slice the array contains the checked item index, be careful with the sequence of array_keys and array_slice */
$checkeditem= array_slice(array_keys($_POST), 0, -3);


switch ($_POST['category'])

 {
	 case 'Officejet Pro':
     $myFile="../data/pjcompleted/ojpro_completed.json";
	 break;
	 case 'Officejet':
     $myFile="../data/pjcompleted/oj_completed.json";
	 break;
	 case 'Page Wide':
     $myFile="../data/pjcompleted/pws_completed.json";
	 break;
	 case 'Consumer':
     $myFile="../data/pjcompleted/ics_completed.json";
	 break;
	 case 'Mobile':
     $myFile="../data/pjcompleted/mobile_completed.json";
     break;
	 default:
	 echo 'Product Category no match';
	 break;
 }

$arr_data=json_decode(file_get_contents($myFile),true);
 
/* remove the selected entry, $index is the value of the $checkeditem array, not the key */
 foreach ($checkeditem as $index ){
	 
 unset($arr_data[$productname]['projectlist'][$projectname]['itemlist'][$index]); 
  $index=$index-1;	 
	 
 }
 
 
 /*rebase the project data */
 $arr_data[$productname]['projectlist'][$projectname]['itemlist'] = array_values($arr_data[$productname]['projectlist'][$projectname]['itemlist']);
 
 /*reindex the itemnumber in the project data */
 
 $currentitem=sizeof($arr_data[$productname]['projectlist'][$projectname]['itemlist']);
 
 for ($i=0; $i<$currentitem;$i++)
 {
	$arr_data[$productname]['projectlist'][$projectname]['itemlist'][$i]['itemnumber']= $i+1; 
 }
 
 
$jsondata= json_encode($arr_data, 128);
$jsondata=prettyPrint($jsondata);


if(file_put_contents($myFile, $jsondata)){
	}
	else 
     echo "Error"; 
   }
   catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
   
 $pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:6; url='.$pre_page.'#/completedproject');
} 



?>

<html lang="en">
<head>
  <title>Delete Item</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script>
  $(document).ready(function(){
  progressBarTranshalf();
  timedTrans();
  progressBarRedirect();
  }
  );
  
  function progressBarTranshalf()
  {
    $("#progressing").attr({
  "style":"width:50%"
  });
  }
  
  function progressBarTrans()
  {
    $("#progressing").attr({"style":"width:100%"});
    $("#progresstext").text("Data successfully saved");

  }
  
    function progressBarRedirect()
  {
   setTimeout(function(){$("#progresstext").text("Redirecting Now...");}, 2000);
  }
  
  
  function timedTrans()
  
  {
  setTimeout(function(){progressBarTrans();},1000);
  }
  </script>
  
  
</head>
<body>

<div class="container">
  <div class="progress">
    <div id="progressing" class="progress-bar progress-bar-striped active" role="progressbar" style="width:0%">
	  <p id="progresstext">Deleting Item</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>



