<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

if (isset($_POST)){

$activepj=array();
$arr_data=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);
    
if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

$livedate = (isset($_POST['livedate'])?$_POST['livedate']:'N/A');
$fdudate = (isset($_POST['fdudate'])?$_POST['fdudate']:'N/A');
$mfgdate = (isset($_POST['mfgdate'])?$_POST['mfgdate']:'N/A');

try {
$arr_append= array (

'revision'=>$_POST['revision'],
'roi'=>$_POST['roi'],
'defectcount'=>$_POST['defectcount'],
'featurecount'=>$_POST['featurecount'],
'livedate'=>$livedate,
'fdudate'=>$fdudate,
'mfgdate'=>$mfgdate,
'sha'=>$_POST['sha'],
'signature'=>$_POST['signature'],
'branch'=> $_POST['branch'],
'fwlink'=> $_POST['fwlink'],
);


	
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
 $activepj=json_decode(file_get_contents("../data/dashboard.json"),true);
 
 
 $productname=$_POST['parentproduct'];
 $projectname=$_POST['project'];
 
  
 
 foreach ($arr_append as $key=> $value)
 {
 $activepj[$projectname][$key]=$value;
 }

$arr_data[$productname]['projectlist'][$projectname]= $activepj[$projectname];
 


 $json_data = json_encode($arr_data, 128);
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
header('Refresh:6; url='.$pre_page.'#/completedproject');

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

