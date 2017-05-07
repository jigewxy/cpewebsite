<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

/* 1. various way of getting working directory $cwd= getcwd(); $_SERVER['DOCUMENT_ROOT']*/
/* 2. foreach ($arg1 as $key=> $value) {callback function } */


if(isset($_POST)){

$arr_data=array();

set_include_path($_SERVER['DOCUMENT_ROOT']);
    
if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
{include "php/util/srt_util_lib.php";
include "php/util/json_pretty_print.php";}

else
{  include "cpe/php/util/srt_util_lib.php";
    include "cpe/php/util/json_pretty_print.php";}

try {
$myFile="../../data/srt/srt_release_completed.json";

 $arr_data=json_decode (file_get_contents($myFile), true);

 
$rootindex=$_POST['project'][0];
$arrayindex= $rootindex -1;

array_splice($arr_data['releases'], $arrayindex, 1);

/*reindex() is available in utility library  - srt_util_lib.php */
$arr_data=reindex($arr_data);

$jsondata=json_encode($arr_data, 128);
$jsondata=prettyPrint($jsondata);
file_put_contents($myFile, $jsondata);
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
  <title>Delete Release</title>
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
    $("#progresstext").text("Changes successfully saved");

  }
  
    function progressBarRedirect()
  {
   setTimeout(function(){$("#progresstext").text("Redirecting Now...");}, 3000);
  }
  
  
  function timedTrans()
  
  {
  setTimeout(function(){progressBarTrans();},2000);
  }
  </script>
  
  
</head>
<body>

<div class="container">
  <div class="progress">
    <div id="progressing" class="progress-bar progress-bar-striped active" role="progressbar" style="width:0%">
	  <p id="progresstext">Saving Changes</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>

