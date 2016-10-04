<?php
    require("class.pdo.php");
    $pdo = new pdo_class("localhost", "root", "", "configurable-dashboard");

    switch($_GET['action']){
        case "getSetting":
            if(isset($_POST['setting']) && !empty($_POST['setting'])){
                $settingName = $_POST['setting'];

                $result = $pdo->query("fetch", "SELECT `action` FROM `settings` WHERE `setting` = :setting", array(":setting"=>$settingName));
                echo($result['action']);
            }
            break;
        case "updateSetting":
            if(isset($_POST['setting']) && !empty($_POST['setting'] && isset($_POST['action'] && !empty($_POST['action']))){
                $settingName = $_POST['setting'];
                $action = $_POST['action'];
                
                $pdo->execQuery("UPDATE `settings` SET `action` = :action WHERE `setting` = :setting", array(":action"=>$action, ":setting"=>$settingName));
                echo("true");
            }
            
            break;
    }

          
?>