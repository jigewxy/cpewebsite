<?php 
include 'template/setcookie.php';
?>
<html>
<head>
<title>CPE Projects</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="content" content="CPE active and completed projects">
<meta http-equiv="expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta charset="UTF-8">
<!--meta http-equiv="cache-control" content="max-age=0"-->
<!--meta http-equiv="cache-control" content="no-store"-->
<script src="framework/jquery-3.1.1.min.js"></script>
<script src ="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
<script src="framework/angular.min.js"></script>
<script src="framework/angular-route.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="framework/moment.js"></script>
<script src="framework/highcharts.js"></script>
<script src="framework/highcharts-more.js"></script>
<script src="framework/exporting.js"></script>
<script src="framework/underscore-min.js"></script>
<script src="framework/utility.js"></script>
<script src="js/pj/appCpe.js"></script>
<script src="js/pj/activepj.js"></script>
<script src="js/pj/completedpj.js"></script>
<script src="js/pj/report.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" >
<link rel="stylesheet" href="style/unified.css">
<link rel="stylesheet" href="style/cpe_projects.css">
</head>
<body ng-app="myApp" ng-controller="cpeCtrl">

<nav class="navbar navbar-default">
<div class="container-fluid">
  <ul class="nav navbar-nav">
    <li class="nav-menu" id="li-db"><a href="#dashboard">Dashboard</a></li>
    <li class="nav-menu" id="li-ap"><a href="#active">Active</a></li>
    <li class="nav-menu" id="li-cp"><a href="#completed">Completed</a></li>
  	<li class="nav-menu" id="li-cr"><a href="#statistics">Statistics</a></li>
	</ul>
 <form class="navbar-form navbar-left">
	<div id="search-box" class="input-group">
	<input  type="text" class="form-control" placeholder="Search" ng-model="keyword">
	<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>
	</div>
</form>
    <ul class="nav navbar-nav navbar-right">
        <?php include 'template/navlist.php'; ?>
    </ul>
</div>
</nav>
<div ng-view>

</div>

</body>

</html>
