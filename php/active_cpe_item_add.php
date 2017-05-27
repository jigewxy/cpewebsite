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

try 
{ 
	$summary = utf8_encode($_POST['summary']);
	//get form data
 $formdata=array (
 
 'itemnumber'=> $_POST['itemnumber'],
 'crid'=> $_POST['crid'],
 'type'=> $_POST['type'],
 'summary'=>$summary,
 'requestor'=>$_POST['requestor'],
 'fixer'=>$_POST['fixer'],
 'testteam'=>$_POST['testteam'],
 'products'=>$_POST['products'],
  'component'=>$_POST['component'],
 'status'=>$_POST['status'],
 );
 

$projectname= $_POST['projectname'];



//get existing data

$existing_data=file_get_contents($myFile);
$arr_data=json_decode($existing_data, true);

//add form data to the 'itemlist' array
array_push($arr_data[$projectname]['itemlist'], $formdata);


//convert updated array to JSON
	
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
   
 $pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:6; url='.$pre_page.'#/activeproject');
} 

?>

<html lang="en">
<head>
  <title>Add Item</title>
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



