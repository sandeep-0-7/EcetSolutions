<?php
    $dir = "./discussion/";
    $n = scandir($dir);
    $c = count($n)-1;
   
    $location = "discussion/".$c.".jpg";
    if(move_uploaded_file($_FILES['file']['tmp_name'],$location))
    {
        echo $location;
    }
    else
        echo "not uploaded";

?>