<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control:max-age=0, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 



if(isset($_POST)){
	
$arr_data=array();
$itemlist=array();
set_include_path($_SERVER['DOCUMENT_ROOT']);
if($_SERVER['HTTP_HOST']=='cpse.ijp.sgp.rd.hpicorp.net')
    include "php/util/json_pretty_print.php";
else
    include "cpe/php/util/json_pretty_print.php";

try {
	
$category = $_POST['category'];
$productname= $_POST['productname'];
$projectname= $_POST['projectname'];

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

/* check if fdudate, mfgdate, livedate input box are disabled, if so, assign "N/A" to them*/

$livedate = (isset($_POST['livedate'])?$_POST['livedate']:'N/A');
$fdudate = (isset($_POST['fdudate'])?$_POST['fdudate']:'N/A');
$mfgdate = (isset($_POST['mfgdate'])?$_POST['mfgdate']:'N/A');


//echo '<pre>'.'Posted Data'.'</pre>';
//echo '<pre>'.var_export($livedate, true).'</pre>';
//echo '<pre>'.var_export($fdudate, true).'</pre>';
//echo '<pre>'.var_export($mfgdate, true).'</pre>';

$pjsummary= array (

'revision'=>$_POST['revision'],
'skus'=>$_POST['skus'],
'uniquefw'=>$_POST['uniquefw'],
'cat'=>$_POST['pjcat'],
'roi'=>$_POST['roi'],
'datevr'=>$_POST['datevr'],
'livedate'=>$livedate,
'fdudate'=>$fdudate,
'mfgdate'=>$mfgdate,
'pm'=>$_POST['pm'],
'sq'=>$_POST['sq'],
'fw'=>$_POST['fw'],
'defectcount'=>$_POST['defectcount'],
'featurecount'=>$_POST['featurecount'],
'sha'=>$_POST['sha'],
'signature'=>$_POST['signature'],
'branch'=> $_POST['branch'],
'fwlink'=> $_POST['fwlink'],

);

/*replace old data with posted key->value pair */
foreach ($pjsummary as $key=>$value){
	
$arr_data[$productname]['projectlist'][$projectname][$key] = $value;

}

/* construct the itemlist from posted arrays if it exist */

if (isset($_POST['itemnumber']))
{
$totalnumber= sizeof($_POST['itemnumber']);
for ($i=0; $i<$totalnumber; $i++)
{

$summary = mb_convert_encoding($_POST['summary'][$i], "UTF-8");

$itemlist[$i] = array(
   'itemnumber'=> $_POST['itemnumber'][$i],
   'crid'=> $_POST['crid'][$i],
   'type'=> $_POST['type'][$i],
   'summary'=> $summary,
   'requestor'=> $_POST['requestor'][$i],
   'fixer'=> $_POST['fixer'][$i],
   'testteam'=> $_POST['testteam'][$i],
   'products'=> $_POST['products'][$i],	 
   'component'=>$_POST['component'][$i],
	);
}

$arr_data[$productname]['projectlist'][$projectname]['itemlist'] = $itemlist;

}



$jsondata= json_encode($arr_data, 128);

$jsondata=prettyPrint($jsondata);

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



