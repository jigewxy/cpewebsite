<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 


if(isset($_POST)){
	
$activeDb="../../data/srt/srt_release_active.json";
$completedDb="../../data/srt/srt_release_completed.json";
$arr_active= array(); //create empty array
$arr_completed=array();

set_include_path($_SERVER['DOCUMENT_ROOT']);


if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";
    
try 
{ 
 
 $arr_active=json_decode (file_get_contents($activeDb), true);
 $arr_completed=json_decode (file_get_contents($completedDb), true);


// add new index number, this new index must be the indexnumber of last entry plus one,
// this will ensure there is no replicate index numbers for each item.

$index_from= $_POST['rootindex'];

$index_to=sizeof($arr_completed['releases'])+1;

/*re-assign the rootindex according to the size of completed proj */
$arr_active['releases'][$index_from-1]['rootindex'] = $index_to;

array_push($arr_completed['releases'], $arr_active['releases'][$index_from-1]);


	
$jsondata=json_encode($arr_completed, 128);
$jsondata=prettyPrint($jsondata);
	
	//Write json data into srt_release.php file
if(file_put_contents($completedDb, $jsondata)){
		//echo 'Data successfully saved';
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
  <title>Add Release</title>
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

