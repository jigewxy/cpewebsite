<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
  
if(isset($_POST)){


//learning, 1. array_filter() need to work with array_values() to re-index the new array
// 2. when using array_splice(), can replace the removed element with empty string first, in order to keep the item index correct in the for loop.

set_include_path($_SERVER['DOCUMENT_ROOT']);

if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

function is_not_empty($var)
{
	return !empty($var);
	
}
$myFile="../data/dashboard.json";
$arr_data=array();


try{
	
$existing_data=file_get_contents($myFile);
$arr_data=json_decode($existing_data, true);



$rawdata=$_POST;
$postedkeys=array_keys($_POST);

//get the project name in order to find the right location
$projectname= $rawdata['projectname'];




$projectitems=$arr_data[$projectname]['itemlist'];

//loop to remove all selected radio button items, need to substract by 1 before last item is "projectname"
//replace the deleted item with empty array during the loop to keep the index number correct.

for ($i=0; $i<sizeof($postedkeys)-1;$i++)

{

array_splice($projectitems, $postedkeys[$i], 1, "");

}





//remove those arrays replaced by empty strings
$projectitems=array_filter($projectitems, "is_not_empty");

//need to apply array_values() because the array_filter will still keep the old key index -eg : a[2], a[4] instead of a[0], a[1]
$projectitems=array_values($projectitems);

//reindex the array data after removing items;
$updatedlength=sizeof ($projectitems);


for ($j=0; $j<$updatedlength;$j++)
{
if (array_key_exists('itemnumber', $projectitems[$j])){
$projectitems[$j]['itemnumber']= $j+1;}
}

//copy back the $projectitems to $arr_data

$arr_data[$projectname]['itemlist']=$projectitems;

//echo '<pre>'.'show filtered array'.'</pre>';
//echo '<pre>'.var_export($arr_data[$projectname]['itemlist'], true).'</pre>';


//convert to json data
$jsondata=json_encode($arr_data, 128);
$jsondata=prettyPrint($jsondata);

	//Write json data into srt_release.php file
if(file_put_contents($myFile, $jsondata)){
	}
	else 
     echo "Error"; 
   }
   catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
   
}
   
$pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:6; url='.$pre_page.'#/activeproject');

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
	  <p id="progresstext">Modifying Database</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>



