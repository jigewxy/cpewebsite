<html>
<head>
<meta charset="UTF-8">
</head>
<body>
    
<div class='input-group'>
    
<input type="text" id= "name">
<input type="text" id ="age">

<div>
    
<p id="first-p"> hello</p>
<p id="second-p"> nihao</p>
<p id="third-p"> bonjour</p>
<?php
$servername = "localhost";
$username = "cpeuser";
$password = "Changepwd@12";

print_r(PDO::getAvailableDrivers());  

try {
    $conn = new PDO("mysql:host=$servername;dbname=testDB", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn -> prepare("SELECT * FROM WEBERPDL WHERE itemnumer=1");
    $stmt-> execute();
    $result = $stmt->fetchALL(PDO::FETCH_ASSOC);
    foreach($result as &$value)
{
    //echo '<pre>'.utf8_encode($value['summary']).'<pre>';
// mb_detect_encoding($value['summary'],'UTF-8');

   $value['summary'] = utf8_encode($value['summary']).'hello';

} 

unset($value);

print_r($result);

    $result=json_encode($result, JSON_PRETTY_PRINT);

    $err= json_last_error();
    echo $err;
    echo '<pre>'.var_export($result, true).'<pre>';
    echo "Connected successfully"; 

    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
?>

</div>
    
</div>
    

    
<textarea id='text-editor'></textarea>
    
    
    
    
    
    
    
    
    
    
    
    
</body>
</html>
