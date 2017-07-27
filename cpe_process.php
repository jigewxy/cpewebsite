<?php
include 'template/setcookie.php';
?>

<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="framework/utility.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="style/unified.css">
</head>
<body>

<div class="container-fluid">
<div id="nav-top">
    <nav class="navbar navbar-default container-fluid">
    <ul class="nav navbar-nav navbar-right">
        <?php include 'template/navlist.php'; ?>
    </ul>
    </nav>
 </div>

 <?php 
 $lib_img = array (
  'cpefw' => ['cpefw.png', 'CPE firmware project workflow'],
  'cpepor' => ['cpepor.png', 'CPE project POR process'],
  'cr' => ['cr.png', 'CPE change request process'],
  'lt' => ['lt.png', 'CPE learning transfer'],
  'transition' => ['transition.png', 'NPI to CPE product transition'],
  'triage' => ['triage.png', 'CPE request resolution process'],
 );

foreach($lib_img as $key=>$value){

echo  "<div class='col-md-4'> 
       <div class='thumbnail'>
       <a href='images/flows/{$value[0]}' target='_blank'>
        <img class='img-thumbnail' src='images/flows/{$value[0]}'>
           <div class='caption'>
            <center><kbd> {$value[1]}</kbd></center>
           </div>
       </div>
      </div>";

}

 ?>

</body>
</html>


