
<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc

$pdname = trim($_POST['product']);

$formdata = $_POST;

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


try {
$stm= $conn->prepare("SELECT id FROM product WHERE product_name=:pdname");
$stm->bindParam(':pdname', $pdname, PDO::PARAM_STR);

$stm->execute();

$temp=$stm->fetch(PDO::FETCH_ASSOC);

//below function will not work because array_splice() always insert with key[0, 1, 2...]
//array_splice($formdata, 0, 2, $pdid);
//array_splice($formdata, 0, 2);
//$formdata['product_id'] = $temp['id'];
$keysToDel=['division', 'product'];
$formdata = UtilityFunc::unsetKeys($formdata, $keysToDel);
$formdata['product_id'] = $temp['id'];

//set default value for defectcount and featurecount while adding new project;

$column_name_str = array_reduce(array_keys($formdata),'UtilityFunc::flatten');
$column_value_str= array_reduce(array_values($formdata),'UtilityFunc::flattenQuote');

$stm = $conn -> prepare("INSERT INTO project ({$column_name_str}) VALUES ({$column_value_str})");
$stm->execute();

} catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

}


echo "success";


?>