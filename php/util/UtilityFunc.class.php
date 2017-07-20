<?php

class UtilityFunc {

    //flatten associative array with double quote
    public static function flattenQuote($carry, $item){
        $item = addslashes(trim($item));
        if(isset($carry))
        return $carry.','.'"'.$item.'"';
        else
        return '"'.$item.'"';
    }

    //flatten associative array
    public static function flatten($carry, $item){
        //LEARNING: another alternative is to use mysqli_real_escape_string()
        $item = addslashes(trim($item));
        if(isset($carry))
        return $carry.','.$item;
        else
        return $item;
    }

    /* FUNCTION to get project_id  from project table*/
    public static function getPjId($pjname, $conn)
    {

        $stm = $conn -> prepare("SELECT id FROM project WHERE project_name=?");
        $stm->bindParam(1, $pjname, PDO::PARAM_STR);

        $result = $stm-> execute();

        if($result)
        {$pjid = $stm->fetch(PDO::FETCH_ASSOC);
        return $pjid;}

        else 
        return false;

    }

    /*Function to unset multiple keys in an array */
    public static function unsetKeys($arr, $keys){

        foreach ($keys as $value){
        unset($arr[$value]);
        };

        return $arr;

    }

    /*Function to process form data for SQL UPDATE statement */

    public static function getSqlUpdateStmt($data)
        {
            $stm_str ='';
            foreach($data as $key=>$value){
            if($stm_str=='')
            $stm_str.= $key."=\"".addslashes($value)."\"";
            else
            $stm_str.= ",".$key."=\"".addslashes($value)."\"";
            }

            return $stm_str;
       }

    //Function to do authentication check
  public static function authCheck() {
            
            session_start();

            if($_SESSION['auth'] != 'pass')
            { 
            
            echo 'AUTHERROR';
            exit();
            } 
            else  return;

       }

    //Function to do authentication check
  public static function authCheckReturnObj() {
            
            session_start();
            $authResp = array(); 

            if($_SESSION['auth'] != 'pass')
            { 
            $authResp['state'] = "AUTHERROR";
            echo json_encode($authResp, JSON_PRETTY_PRINT);
            exit();
            } 
            else  return;

       }


}

?>

