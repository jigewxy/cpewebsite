<?php

require_once '../php/util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../php/util/UtilityFunc.class.php'; //class UtilityFunc

$username = $_POST['username'];
$password = $_POST['password'];
$user_arr = array();
$pwd_arr = array();

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stm = $conn->prepare("SELECT * FROM usertable");
$stm->execute();

$returndata = array();
$result = $stm->fetchAll(PDO::FETCH_ASSOC);


foreach($result as $key=>$value){

 array_push($user_arr, $value['username']);
 array_push($pwd_arr, $value['password']);

}

session_start();

if (in_array($username, $user_arr) == false) {

$_SESSION['auth'] = 'fail';
$returndata['state'] = "wrong username";
$returndata['auth'] = "fail";

} 
//get current key in $user_arr, and map with $pwd_arr, then verify the password hash
else if( password_verify($password, $pwd_arr[key($user_arr)]) == false)
{
$_SESSION['auth'] = 'fail';
$returndata['state'] = "wrong password";
$returndata['auth'] = "fail";

}

else 
{

$_SESSION['auth'] = "pass";
setcookie('auth', 'pass');
$returndata['state'] = "success";
$returndata['auth'] = "pass";

}

$_SESSION['ssid'] =session_id();

echo json_encode($returndata, JSON_PRETTY_PRINT);


?>