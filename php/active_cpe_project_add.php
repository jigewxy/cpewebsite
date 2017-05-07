<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 
//learning: 
// 1). to assign a key value pair, the simplest way is to use the direct assignment if key is known: array[$key]= $value, array_push() will not push the keys but only values.
if(isset($_POST)){

$myFile="../data/dashboard.json";
$arr_data=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);

if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";
//convert YYYY-MM-DD to YYYY,MM-1,DD for highchart
function processDates($date)
{
$monthstart=stripos($date, '-');
$monthend=strrpos($date, '-');


//get year, month, day value
$year=substr($date, 0, 4);
$month=substr($date, 5, $monthend-$monthstart-1);


$day=substr($date, $monthend+1, strlen($date));


//calculate the UTC month, which is the real month number minus one. need type conversion here.

$month= (string)((int)$month - 1);

 
 //concat year, month, day together in UTC format - Date.UTC(2017, 1, 25)
$date= 'Date.UTC('.$year.','.$month.','.$day.')';

return $date;	
	
}
	

try {
	
$formdata= array (

'projectname'=>$_POST['projectname'],
'skus'=>$_POST['skus'],
'datestart'=>$_POST['datestart'],
'datefc'=>$_POST['datefc'],
'daterc'=>$_POST['daterc'],
'datevr'=>$_POST['datevr'],
'pm'=>$_POST['pm'],
'fw'=>$_POST['fw'],
'sq'=>$_POST['sq'],
'uniquefw'=>$_POST['uniquefw'],
'branch'=>$_POST['branch'],
'cat'=>$_POST['cat'],
);

$projectname = $formdata['projectname'];

$arr_data= json_decode(file_get_contents($myFile), true);

//add new project name entry
array_push ($arr_data['category'], $formdata['projectname']);

//assign new key-value pairs to the array data, 
$new_summary_arr = array (

'itemlist'=> array(),
'skus'=>$formdata['skus'],
'uniquefw'=>$formdata['uniquefw'],
'pm'=>$formdata['pm'],
'fw'=>$formdata['fw'],
'sq'=>$formdata['sq'],
'branch'=>$formdata['branch'],
'cat'=>$formdata['cat'],
'datestart'=>$formdata['datestart'],
'datefc'=>$formdata['datefc'],
'daterc'=>$formdata['daterc'],
'datevr'=>$formdata['datevr'],
);

$arr_data[$projectname]= $new_summary_arr;



//add datestart, datefc, daterc, datevr to the [dates] section for highchart

$dateindex = sizeof($arr_data['dates'])/3;

$new_date_arr1 = array (
'x'=> $dateindex,
'low'=> processDates($formdata['datestart']),
'high'=>processDates($formdata['datefc']),
'name'=> 'FC cycle',
'color'=> 'deepskyblue',

);

$new_date_arr2 = array (
'x'=> $dateindex,
'low'=> processDates($formdata['datefc']),
'high'=>processDates($formdata['daterc']),
'name'=> 'RC cycle',
'color'=> 'lemonchiffon',

);

$new_date_arr3 = array (
'x'=> $dateindex,
'low'=> processDates($formdata['daterc']),
'high'=>processDates($formdata['datevr']),
'name'=> 'VR cycle',
'color'=> 'pink',

);

array_push($arr_data['dates'], $new_date_arr1, $new_date_arr2, $new_date_arr3);

$json_data= json_encode($arr_data, 128);
$jsondata=prettyPrint($jsondata);

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
  <title>Add Project</title>
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

