<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 
header('Pragma: no-cache');
if(isset($_POST)){
$xml_doc=new DomDocument;
$xml_doc->load ('../data/oj_release.xml');
$product_root=$xml_doc->getElementsBytagName($_POST["productid"].'root')->item(0);
$new_release=$xml_doc->createElement('release');
$product_root->appendchild($new_release);

$new_version=$xml_doc->createElement('version', $_POST["version"]);
$new_release->appendchild($new_version);
$new_fwversion=$xml_doc->createElement('fwversion', $_POST["fwversion"]);
$new_release->appendchild($new_fwversion);
$new_date=$xml_doc->createElement('date', $_POST["date"]);
$new_release->appendchild($new_date);
$new_arel=$xml_doc->createElement('arel', $_POST["arel"]);
$new_release->appendchild($new_arel);
$new_sarel=$xml_doc->createElement('sarel', $_POST["sarel"]);
$new_release->appendchild($new_sarel);
$new_narel=$xml_doc->createElement('narel', $_POST["narel"]);
$new_release->appendchild($new_narel);
$new_branch=$xml_doc->createElement('branch', $_POST["branch"]);
$new_release->appendchild($new_branch);
$new_type=$xml_doc->createElement('type', $_POST["type"]);
$new_release->appendchild($new_type);

$done=$xml_doc->save("../data/oj_release.xml");
$pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:5; url='.$pre_page);}
?>
<html lang="en">
<head>
  <title>Add Entry</title>
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
	  <p id="progresstext">Saving</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>
