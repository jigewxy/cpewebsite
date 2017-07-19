<?php header("content-type:text/html; charset:utf-8");

//LEARNING: $_POST can't parse the content-type/JSON format 
//Angular $http service send JSON format by default, there are two solutions: 
// 1. change the default Content-Type and requestTransform in $httpProvider 
// 2. use file_get_contents("php://input") to get the RAW data;

//$content = file_get_contents("php://input");
//$pjstate = json_decode($content, JSON_OBJECT_AS_ARRAY)['pjstate'];
//echo $pjstate;

require_once '../util/ServerConfig.class.php'; //CLASS ServerConfig
error_reporting(0);
//set up product list array
$pdarr = array(
    
    'ojpro'=>[],
    'oj'=>[],
    'pws'=>[],
    'ics'=>[],
    'mobile'=>[]
);


try {
    //setup output array
    $returndata = array();

    //setup project array
    $pjarr = array();

    // Set the PDO based on server host and database name;
    $conn = ServerConfig::setPdo(PJDB);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // read active project list and add product category in the query result as well
    $stm = $conn-> prepare ("SELECT pj.*, pd.division FROM project as pj  INNER JOIN product as pd ON pj.product_id = pd.id WHERE pj.currentstate='Active' ");
    $stm -> execute();

    $result = $stm->fetchAll(PDO::FETCH_ASSOC);

    //loop through the active project list and get corresponding itemlist
    foreach($result as $key=>$value){
    $pjid = $value['id'];
    $pjname= $value['project_name'];

    $stm=$conn->prepare("SELECT * FROM itemlist WHERE project_id=:pjid");
    $stm->bindValue(':pjid', $pjid);

    $stm->execute();

    $itemlist=$stm->fetchAll(PDO::FETCH_ASSOC);
    $result[$key]['itemlist']=$itemlist;

    $pjarr[$pjname] = $result[$key];

    //clone the data with a new key $pjname for later use.
    //LEARNING --can't do below as the $key might coincide with $pjname
    //$result[$pjname]=$result[$key];
    //delete the original key-value pair;//1
    //unset($result[$key]);

    }


    //get product list and save it for later use.

    $stm2 = $conn-> prepare ("SELECT id,product_name,division FROM product ORDER BY division");
    $stm2 -> execute();

    $pdlist = $stm2->fetchAll(PDO::FETCH_ASSOC);

    //map product id to product name;
    foreach($pdlist as $key=>$value){

    switch ($value['division'])
    {
    case 'Officejet Pro':
        $pdarr['ojpro'][$value['id']] =$value['product_name'];
        break;
    case 'Officejet':
        $pdarr['oj'][$value['id']] =$value['product_name'];
        break;
        case 'Page Wide':
        $pdarr['pws'][$value['id']] =$value['product_name'];
        break;
        case 'Consumer':
        $pdarr['ics'][$value['id']] =$value['product_name'];
        break;
        case 'Mobile':
        $pdarr['mobile'][$value['id']] =$value['product_name'];
        break;

    }

    }

    $returndata['pj'] = $pjarr;
    $returndata['pdlist'] = $pdarr;
    $returndata['state'] = "SUCCESS";

    echo json_encode($returndata, JSON_PRETTY_PRINT);

}
catch (Exeception $e){
    $returndata['state'] ="FAIL";
    $returndata['msg'] = $e->getMessage();

echo json_encode($returndata, JSON_PRETTY_PRINT);
}



?>