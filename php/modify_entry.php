<?php header('Content-type: text/html; charset=utf-8');
header("Cache-Control: max-age=0, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 

$xml_doc= new DOMDocument;
$xml_doc->load('../data/oj_release.xml');

$product_root=$xml_doc->getElementsBytagName($_POST["productid"].'root')->item(0);
for ($array_index=0;$array_index<$_POST["totalentry"];$array_index++)
	
	{
		
		//create new nodes from PHP posted data
$new_version_node=$xml_doc->createElement('version', $_POST["version"][$array_index]);
$new_fwversion_node=$xml_doc->createElement('fwversion', $_POST["fwversion"][$array_index]);
$new_date_node=$xml_doc->createElement('date',$_POST["date"][$array_index]);
$new_arel_node=$xml_doc->createElement('arel',$_POST["arel"][$array_index]);
$new_sarel_node=$xml_doc->createElement('sarel',$_POST["sarel"][$array_index]);
$new_narel_node=$xml_doc->createElement('narel',$_POST["narel"][$array_index]);
$new_branch_node=$xml_doc->createElement('branch',$_POST["branch"][$array_index]);
$new_type_node=$xml_doc->createElement('type',$_POST["type"][$array_index]);

//get the corresponding node in XML file from index parameter	
$entry_to_replace = $product_root->getElementsBytagName('release')->item($array_index);	

//get old node position
$old_version_node=$entry_to_replace->getElementsBytagName('version')->item(0);
$old_fwversion_node=$entry_to_replace->getElementsBytagName('fwversion')->item(0);
$old_date_node=$entry_to_replace->getElementsBytagName('date')->item(0);
$old_arel_node=$entry_to_replace->getElementsBytagName('arel')->item(0);
$old_sarel_node=$entry_to_replace->getElementsBytagName('sarel')->item(0);
$old_narel_node=$entry_to_replace->getElementsBytagName('narel')->item(0);
$old_branch_node=$entry_to_replace->getElementsBytagName('branch')->item(0);
$old_type_node=$entry_to_replace->getElementsBytagName('type')->item(0);

//replace old node with new nodes
$entry_to_replace->replaceChild($new_version_node, $old_version_node);
$entry_to_replace->replaceChild($new_fwversion_node, $old_fwversion_node);
$entry_to_replace->replaceChild($new_date_node, $old_date_node);
$entry_to_replace->replaceChild($new_arel_node, $old_arel_node);
$entry_to_replace->replaceChild($new_sarel_node, $old_sarel_node);
$entry_to_replace->replaceChild($new_narel_node, $old_narel_node);
$entry_to_replace->replaceChild($new_branch_node, $old_branch_node);
$entry_to_replace->replaceChild($new_type_node, $old_type_node);

	}

//save XML file
$done=$xml_doc->save("../data/oj_release.xml");
$pre_page = $_SERVER['HTTP_REFERER'];
header('Refresh:5; url='.$pre_page);
?>

<html lang="en">
<head>
  <title>Modify Entry</title>
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
	  <p id="progresstext">Saving changes</p> 
    </div>
  </div>
</div>

<p id="redirect" center><p>

</body>
</html>