<?php
     $HOST="localhost";
     $US="root";
     $PW="";
     $BD="coasterworld";

     
        $bbdd=new mysqli();
        $bbdd->connect($HOST,$US,$PW,$BD);
        $bbdd->query("SET NAMES 'utf8'");
        $sql="SELECT logo FROM parques WHERE nombre LIKE 'PortAventura'";
        $result=$bbdd->query($sql);
        while($row=mysqli_fetch_assoc($result)){
            $logo=$row["logo"];
        }
        $bbdd->close();
$ajax="<img src='$logo'>";
echo $ajax;
/*header("Content-Type: application/json");
json_encode($ajax);*/