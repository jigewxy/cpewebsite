<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 


//echo 'posted data';
//echo '<pre>'.var_export($_POST, true).'</pre>';

if(isset($_POST)){

$myFile="../../data/srt/srt_release_completed.json";
$arr_data=array();

$arr_data=json_decode(file_get_contents($myFile), true);
set_include_path($_SERVER['DOCUMENT_ROOT']);

if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

try 
{ 

//track the index number of project 
$rootindex=$_POST['rootindex'];

/* only update the item list when there is item available */
if(isset($_POST['itemnumber']))
{
$itemnumber=array();
$itemnumber=$_POST['itemnumber'];

for($i =0; $i<sizeof($itemnumber); $i++)
{

  	$summary = mb_convert_encoding($_POST['summary'][$i], "UTF-8");
$formdata_item[$i]= array(
		
 'itemnumber'=> $_POST['itemnumber'][$i],
 'crid'=> $_POST['crid'][$i],
  'type'=> $_POST['type'][$i],
 'summary'=>$summary,
 'fixer'=>$_POST['fixer'][$i],
 'testteam'=>$_POST['testteam'][$i],
 'products'=>$_POST['products'][$i],
  'component'=>$_POST['component'][$i],
  /* not needed for completed Project 
 'status'=>$_POST['status'][$i],*/
		);
		
		
	}
	
//update corresponding project itemlist
$arr_data['releases'][$rootindex-1]['itemlist']= $formdata_item;	

}
 

$arr_append= array (
 
 'customer'=>$_POST['customer'],
 'feature'=>$_POST['feature'],
 'product'=> $_POST['product'],
 'revenue'=>$_POST['revenue'],
 'region'=> $_POST['region'],
 'requestor'=>$_POST['requestor'],
 'requestdate'=>$_POST['requestdate'],
 'fcdate'=>$_POST['fcdate'],
 'rcdate'=>$_POST['rcdate'],
 'vrdate'=>$_POST['vrdate'],
 'developer'=>$_POST['developer'],
 'branch'=>$_POST['branch'],
 'fwlink'=>$_POST['fwlink'],
 'state'=>$_POST['state'],
);

foreach ($arr_append as $key=>$value)
{
	$arr_data['releases'][$rootindex-1][$key]=$value;
		
}

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
header('Refresh:5; url='.$pre_page.'#/completedproject');

?>

<html lang="en">
<head>
  <title>Modify Item</title>
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



