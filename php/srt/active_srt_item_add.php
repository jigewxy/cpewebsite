<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

if(isset($_POST)){
	
$myFile="../../data/srt/srt_release_active.json";
$arr_data= array(); //create empty array

set_include_path($_SERVER['DOCUMENT_ROOT']);

if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

try {
	
$arr_data=json_decode (file_get_contents($myFile), true);


$rootindex = $_POST['rootindex'];
	$summary = mb_convert_encoding($_POST['summary'], "UTF-8");
$arr_append= array(

  'itemnumber' =>$_POST['itemnumber'],
  'crid' => $_POST['crid'],
  'type' => $_POST['type'],
  'summary' => $summary,
  'fixer' => $_POST['fixer'],
  'testteam' => $_POST['testteam'],
  'products' => $_POST['products'],
  'component' => $_POST['component'],
  'status' => $_POST['status'],

);

array_push($arr_data['releases'][$rootindex-1]['itemlist'], $arr_append);



$jsondata=json_encode($arr_data, 128);
$jsondata=prettyPrint($jsondata);

if(file_put_contents($myFile, $jsondata)){
		//echo 'Data successfully saved';
	}
	else 
     echo "Error"; 
	
   }
   catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
   }
   
 $pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:6; url='.$pre_page);
} 

?>

<html lang="en">
<head>
  <title>Add Release</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="js/jquery-3.1.1.min.js"></script>
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

