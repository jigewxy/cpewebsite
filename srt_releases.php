<?php 
include 'template/setcookie.php';
?>
<html>
<head>
<title>SRT Releases</title>
<meta charset ="UTF-8">
<meta http-equiv="Expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="framework/angular.min.js"></script>
<script src="framework/underscore-min.js"></script>
<script src="framework/angular-route.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src ="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
<script src="framework/highcharts.js"></script>
<script src="framework/moment.js"></script>
<script src="framework/highcharts-more.js"></script>
<script src="framework/utility.js"></script>
<script src="js/utility/ang-util.js"></script>
<script src="js/srt/srtApp.js"></script>
<script src="js/srt/activesrt.js"></script>
<script src="js/srt/compsrt.js"></script>
<script src="js/srt/dashbd.js"></script>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" >
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="style/custom_srt.css">

</head>
<body>
<div class="container-fluid" ng-app="srtApp" ng-controller ="srtCtrl as mainCtrl">

<div id="srt-release-container container-fluid">
<nav class="navbar navbar-default">
<div class="container-fluid">
 <ul id="tab-list" class="nav navbar-nav">
    <!-- LEARNING:ng-class doesn't need expression {{}}-->
<li id="dash-tab" class="nav-menu tab-menu"><a href="#dashboard">Dashboard</a></li>
<li id="active-tab" class="nav-menu tab-menu"><a href="#active">Projects Active</a></li>
<li id="completed-tab" class="nav-menu tab-menu"><a href="#completed">Project Completed</a></li>
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
</div>

<!-- place holder for the ngRoute -->
<div ng-view>

</div>

</div>


</body>

</html>

