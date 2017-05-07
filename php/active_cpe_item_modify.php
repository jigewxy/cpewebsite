<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

//Lession Learned: 
//1. The reason why $_POST will only contain the last Posted value with the same name is because PHP will basically just explode 
//and foreach over the raw query string to populate $_POST. When it encounters a name/value pair that already exists, it will overwrite the previous one.
//so the solution is to use array for the input name : name[] (activeproject.html -line 187), 
//alternative way is to get the raw input by "file_get_contents ('php://input') ", however a parser function is needed to parse the raw string.

//echo '<pre>'.'Show Posted Data'.'<pre>';
//echo '<pre>' . var_export($_POST, true) . '</pre>';

if(isset($_POST)){
//select data files and create container array;

$myFile="../data/dashboard.json";
$arr_data=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);
    

if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";
//define functions
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

//echo '<pre>'.'show the month after change'.'<pre>';
//echo '<pre>' . var_export($month, true) . '</pre>';
 
 //concat year, month, day together in UTC format - Date.UTC(2017, 1, 25)
$date= 'Date.UTC('.$year.','.$month.','.$day.')';

return $date;	
	
}

$arr_data=json_decode(file_get_contents($myFile), true);



try 
{ 

//track the project name 
$projectname=$_POST['projectname'];

//track the project name index in 'category' in dashboard.json
$projectnameindex=$_POST['projectnameindex'];

/* only update the item list when there is item available */
if(isset($_POST['itemnumber']))
{
$itemnumber=array();
$itemnumber=$_POST['itemnumber'];

for($i =0; $i<sizeof($itemnumber); $i++)
{
$formdata_item[$i]= array(
		
 'itemnumber'=> $_POST['itemnumber'][$i],
 'crid'=> $_POST['crid'][$i],
  'type'=> $_POST['type'][$i],
 'summary'=>$_POST['summary'][$i],
 'requestor'=>$_POST['requestor'][$i],
 'fixer'=>$_POST['fixer'][$i],
 'testteam'=>$_POST['testteam'][$i],
 'products'=>$_POST['products'][$i],
  'component'=>$_POST['component'][$i],
 'status'=>$_POST['status'][$i],
		);
		
		
	}
	
//update corresponding project itemlist
$arr_data[$projectname]['itemlist']= $formdata_item;	

}


$formdata_summary= array (

 'pjskus'=>$_POST['pjskus'],
 'startdate'=>$_POST['startdate'],
 'fcdate'=> $_POST['fcdate'],
 'rcdate'=> $_POST['rcdate'],
 'vrdate'=>$_POST['vrdate'],
 'pjmanager'=>$_POST['pjmanager'],
 'pjfwlead'=>$_POST['pjfwlead'],
 'pjsq'=>$_POST['pjsq'],
 'pjuniquefw'=>$_POST['pjuniquefw'],
 'pjbranch'=>$_POST['pjbranch'],
 'pjcat'=>$_POST['pjcat'],


);

//update the milestone dates in [dates] and [project] section.
$arr_data['dates'][3*$projectnameindex]['low'] = processDates($formdata_summary['startdate']);
$arr_data['dates'][3*$projectnameindex]['high'] = processDates($formdata_summary['fcdate']);
$arr_data['dates'][3*$projectnameindex+1]['low']= processDates($formdata_summary['fcdate']);
$arr_data['dates'][3*$projectnameindex+1]['high']= processDates($formdata_summary['rcdate']);
$arr_data['dates'][3*$projectnameindex+2]['low']= processDates($formdata_summary['rcdate']);
$arr_data['dates'][3*$projectnameindex+2]['high']= processDates($formdata_summary['vrdate']);

$arr_data[$projectname]['datestart']=$formdata_summary['startdate'];
$arr_data[$projectname]['datefc']=$formdata_summary['fcdate'];
$arr_data[$projectname]['daterc']=$formdata_summary['rcdate'];
$arr_data[$projectname]['datevr']=$formdata_summary['vrdate'];
//echo '<pre>'.'show the date after change'.'<pre>';
//echo '<pre>' . var_export($arr_data['dates'], true) . '</pre>';


//update corresponding project summary details - project manager, fw integrator, SQ lead.
$arr_data[$projectname]['skus']= $formdata_summary['pjskus'];
$arr_data[$projectname]['uniquefw']= $formdata_summary['pjuniquefw'];
$arr_data[$projectname]['pm']= $formdata_summary['pjmanager'];
$arr_data[$projectname]['fw']= $formdata_summary['pjfwlead'];
$arr_data[$projectname]['sq']= $formdata_summary['pjsq'];
$arr_data[$projectname]['branch']= $formdata_summary['pjbranch'];
$arr_data[$projectname]['cat']= $formdata_summary['pjcat'];



//convert to json data
$jsondata=json_encode($arr_data,128);
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



