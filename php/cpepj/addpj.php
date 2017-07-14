
<?php


require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
require_once '../util/UtilityFunc.class.php'; //class UtilityFunc
// Set the PDO based on server host and database name;

try {
//preprocess $_POST data to make it tally with column name
function preProcessor(){
$temp = $_POST;
$temp['product_id'] = substr($_POST['product'], 0, 1);
$temp['project_name'] = $_POST['projectname'];
$temp['currentstate'] = 'Active';
unset($temp['product']);
unset($temp['projectname']);
unset($temp['division']);
return $temp;

}

$db = 'cpeproject';

$conn = ServerConfig::setPdo(PJDB);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$formdata = preProcessor();
$cname = array_keys($formdata); //column name 
$cvalue =array_values($formdata); //column value


$cname_str = array_reduce($cname,'UtilityFunc::flatten');
$cvalue_str = array_reduce($cvalue,'UtilityFunc::flattenQuote');


//it's safer to use single quote around the external variables to avoid SQL injection attack, however
// the safest way is using bindParam() in production code.
$stm = $conn -> prepare("INSERT INTO project ({$cname_str}) VALUES ({$cvalue_str})");


//LEARNING - Can't set multiple parameters using a single string variable, it won't work. 
//bindParam() or bindValue() is only for SQL query parameters like column name, id..etc, it is not a slice of statement.
//$stm->bindParam(':colname', $cname_str, PDO::PARAM_STR);
//$stm->bindParam(':colvalue', $cvalue_str, PDO::PARAM_STR);

$result= $stm->execute();

if ($result){
//echo $stm;

$feedback = array( 
'state' => 'success',
'pjname' =>$_POST['projectname']
);

echo json_encode($feedback);

} else
{
echo "ERROR writting to SQL Database";

}
}
catch (Exeception $e){

echo "Caught exception: ".$e->getMessage()."\n";

}


?>