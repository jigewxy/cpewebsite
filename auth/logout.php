<?php

session_start();
$_SESSION['auth'] = 'fail';
if($_SERVER['HTTP_HOST'] == 'localhost:8080')
{
header('refresh:4; url= http://localhost:8080/cpewebsite/');
}

else 
{
header('refresh:4; url= http://cpse.ijp.sgp.rd.hpicorp.net/');
}

?>

<html>
<head>
<script src="../framework/jquery-3.1.1.min.js"></script>
</head>
<body>
<div>
<p id="logout-msg">Log out successfully, now redirecting</p>
</div>
<script>
//show additional .. every second for 4 seconds
    $(document).ready(function(){

    var count=0;
    var content = $('p#logout-msg').text();
    console.log(content);
    $('p#logout-msg').css('color', 'blue');
    var timer = setInterval(function(){

        if(count<4)
        {
        content+='..';
        $('p#logout-msg').text(content);
        count++;
        }
        else 
        clearInterval(timer);

    }, 1000);
    });

</script>

</body>
</html>