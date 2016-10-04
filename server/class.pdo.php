<?php 
    /**
     * PDO Class
     *
     * PDO Class adds a shorter way to run PDO Queries with MySQL
     *
     * @author     StuartD <me@stuartd.co.uk>
     * @link       https://github.com/stuartajd/pdo-framework
     */

    class pdo_class{     
        private $conn; 
        public function __construct($db_host, $db_user, $db_pass, $db_data = null){  
            if(!in_array('PDO', get_loaded_extensions())) { 
                die("<strong>Fatal error:</strong> PDO Extension is not found"); 
            } 
            $options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');  
            try  
            {  
                if(is_null($db_data)){ 
                    $db = new PDO("mysql:host={$db_host};charset=utf8", $db_user, $db_pass, $options); 
                } else { 
                    $db = new PDO("mysql:host={$db_host};dbname={$db_data};charset=utf8", $db_user, $db_pass, $options);  
                } 
            } 
            catch(PDOException $ex)  
            {  
                echo($ex->getMessage()); 
                exit(); 
            } 
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); 
            $this->conn = $db; 
        } 
        public function execQuery($query, $query_params = null){ 
            try  
            {  
                $stmt = $this->conn->prepare($query); 
                if(!is_null($query_params)){ 
                    $result = $stmt->execute($query_params);  
                } else { 
                    $result = $stmt->execute();  
                } 
            }  
            catch(PDOException $ex)  
            {  
                die($ex->getMessage()); 
            }  
        }
        public function query($type = null, $query, $query_params = null){ 
            try  
            {  
                $stmt = $this->conn->prepare($query); 
                if(!is_null($query_params)){ 
                    $result = $stmt->execute($query_params);  
                } else { 
                    $result = $stmt->execute();  
                } 
            }  
            catch(PDOException $ex)  
            {  
                die($ex->getMessage()); 
            }  
            if(isset($type)){
                switch($type){ 
                    default: 
                    case "fetch": 
                        return $stmt->fetch(); 
                        break; 
                    case "rowcount":
                    case "count": 
                        return $stmt->rowcount(); 
                        break; 
                    case "fetchAll": 
                        return $stmt->fetchAll(); 
                        break;
                    case "boolean":
                        $count = $stmt->rowcount();
                        if($count > 0){ return true; } else { return false; }
                } 
            }
        } 
        public function setDB($db_data){ 
            $this->conn->exec("use ". $db_data); 
        } 
        public function getInsertID(){
            return $this->conn->lastInsertId(); 
        }
    }