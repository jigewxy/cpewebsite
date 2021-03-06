<?php
include 'template/setcookie.php';

?>

<html>

<head>
<title> CPE home page </title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta chartset="UTF-8">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src ="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
<script src="framework/angular.min.js"></script>
<script src="framework/angular-route.min.js"></script>
<script src="framework/utility.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="style/unified.css">
</head>
<body>

<div class="jumbotron">
    <center> <img src="images/hp-logo.jpg"></center>
   <br>
       <center><p>Welcome to &#12302Current Product Soltion Engineering&#12303 Teamsite</p> </center>
</div>


<div class="container-fluid">

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="cpe_releases.php">
    <center>
    <img src= "images/releases.png">
    <p> CPE Releases</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="srt_releases.php">
    <center>
    <img src= "images/srt.png">
    <p> SRT Releases</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="cpe_projects.php">
    <center>
    <img src= "images/projects.png">
    <p> CPE Projects</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="cpe_projects.php">
    <center>
    <img src= "images/knowledge.svg">
    <p>Learnings</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="cpe_tools.php">
    <center>
    <img src= "images/tools.png">
    <p> Tools</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="orgchart.php">
    <center>
    <img src= "images/orgchart.png">
    <p> Org Chart</p>
    </center>
    </a>
</div>

<div class="col-md-1 col-sm-1 col-xs-1"> 
    <a href="cpe_process.php">
    <center>
    <img src= "images/process.png">
    <p>CPE Process</p>
    </center>
    </a>
</div>
</div>
</body>
</html>
