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
<script src="framework/jquery.orgchart.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="style/jquery.orgchart.css">
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
<center><h4>Singapore CPE Team (HPS & HCS)</h4>
<div id="sg-cpe" ></div>
<h4> Bangalore CPE Team</h4>
<div id="bl-cpe"></div>
<h4> Vancouver CPE Team (Pagewide)</h4>
<div id="vc-cpe"></div></center>

</div>



<script>
(function($){

  $(function() {

    var datasrc = {
    
    sgcpe: {
      'name': 'Thum Kok Leong',
      'title': 'FW Section Manager',
      'children': [ { 'name': 'Nigel Loh', 'title': 'CPE Program Manager' },
                    { 'name': 'Hajar Senohadi Susilo', 'title': 'SRT Program Manager'},
                    { 'name': 'Cliff Wang', 'title': 'System Engineer' },
                    { 'name': 'Simrat Siddhu', 'title': 'System Engineer' },
                    { 'name': 'Rajendran Subhasree ', 'title': 'ICS Program Manager' },
                    { 'name': 'Lee Cheah Seng', 'title': 'CPE Test Lead' },
                    { 'name': 'Duma Gaylord', 'title': 'CPE Test Lead' },
                    { 'name': 'Ote, Juan Carlos', 'title': 'CPE Test Lead' }]
    },
    blcpe:{
      'name': 'Ravichandran B',
      'title': 'Firmware Project Manager',
      'children': [ { 'name': 'Ravi Shankar B S', 'title': 'CPE Firmware Lead' },
                    { 'name': 'Ravindra Khot', 'title': 'Firmware Engineer'},
                    { 'name': 'Gaurav Saini Mohinder', 'title': 'Firmware Engineer' },
                    { 'name': 'Kinnal Shankar', 'title': 'Firmware Integrator' },
                    { 'name': 'Sanjay Rautela', 'title': 'Firmware Engineer' },
                    { 'name': 'Mohd Waris Ansari', 'title': 'Firmware Engineer' },
                    { 'name': 'Robert Karan', 'title': 'Firmware Engineer' }]
    },
    vccpe:{
      'name': 'Carl Peterson',
      'title': 'CPE Project Manager',
      'children': [ { 'name': 'Jeff Hale', 'title': 'SRT Program Manager'},
                    { 'name': 'Tina Kaetz', 'title': 'Firmware Integrator' },
                    { 'name': 'Mammmie C Lee', 'title': 'Firmware Engineer' },
                    { 'name': 'Talal Sadak', 'title': 'Firmware Integrator' },
                    { 'name': 'Kevin Tang', 'title': 'Firmware Engineer' },
                    { 'name': 'Joe Eckardt', 'title': 'Firmware Engineer' },
                    { 'name': 'Haily Eli Holt', 'title': 'Firmware Engineer' }]

    }

}



    var sgoc = $('#sg-cpe').orgchart({
      'data' : datasrc.sgcpe,
      'depth': 2,
      'nodeContent': 'title'
    });

    var bloc = $('#bl-cpe').orgchart({
      'data' : datasrc.blcpe,
      'depth': 2,
      'nodeContent': 'title'
    });

   var vcoc = $('#vc-cpe').orgchart({
      'data' : datasrc.vccpe,
      'depth': 2,
      'nodeContent': 'title'
    });

  });

})(jQuery);
</script>
</body>
</html>


