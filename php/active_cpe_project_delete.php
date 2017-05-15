<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 
if(isset($_POST)){

$myFile="../data/dashboard.json";
$arr_data=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);
    
if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

try{

$proj=$_POST['selectedProj'];


//echo '<pre>'.'Posted Data'.'</pre>';
//echo '<pre>'.var_export(gettype($proj), true).'</pre>';

//option need to be TRUE, or else the output is object.
$arr_data=json_decode(file_get_contents($myFile), true);


//search for the project name in the category of dashboard.json, and return the index.
$catIndex= array_search($proj, $arr_data['category']);

//remove the selected project from category.
array_splice($arr_data['category'], $catIndex, 1);



/*remove the selected project from main list*/

//get index of the project in arr_data
$summaryIndex= array_search($proj, array_keys($arr_data));

array_splice($arr_data, $summaryIndex, 1);


/*remove the selected project from the date list */

array_splice ($arr_data['dates'], 3*$catIndex, 3);


//number of dates
$nod = sizeof($arr_data['dates']);


//reindex the X value for the graph
for ($i=0; $i<$nod; $i++)
{
	$arr_data['dates'][$i]['x']= intval($i/3);
	
}


$json_data=prettyPrint(json_encode($arr_data, 128));

if(file_put_contents($myFile, $json_data))
{}
else 
	echo "error - data not saved";

}
   catch (Exception $e) {
         echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
   
 $pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:6; url='.$pre_page.'#/activeproject');
} 

?>

<html lang="en">
<head>
  <title>Delete Project</title>
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
	  <p id="progresstext">Saving New Entry</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>

