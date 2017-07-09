<?php header("content-type:text/html; charset:utf-8");

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc
//PJDB = 'CPEPROJECTS'

$conn = ServerConfig::setPdo(TOOLS);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


//authentication check
UtilityFunc::authCheck();

try{

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//$stm = $conn -> prepare('INSERT INTO cpetool values(?,?,?,?)');
$stm = $conn -> prepare("INSERT INTO CPETOOL values(:entryid, :title, :link, :description)");
$stm->bindValue(':entryid', $_POST['entryid']);
$stm->bindValue(':title', $_POST['title']);
$stm->bindValue(':link', $_POST['link']);
$stm->bindValue(':description', $_POST['description']);

$stm->execute();


echo 'SUCCESS';
} catch(Exception $e){

    echo 'something is wrong'.$e->getMessage();
}


?>