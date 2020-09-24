<?php
    session_start();

    header('Access-Control-Allow-Origin: *'); 
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    require_once("lib/USER.php");
    require_once("lib/BBDD.php");
    require_once("lib/PARQUE.php");
    require_once("lib/ATRACCION.php");
    require_once("lib/func.php");

    //SE RECOGE EL JSON CON LOS DATOS RECIBIDOS DEL CLIENTE Y SE INTRODUCEN EN UN OBJETO PARA TRATARLOS
    $json = file_get_contents('php://input');
    $params=json_decode($json);
    //SE CREA EL OBJETO QUE CONTENDRÁ LOS DATOS QUE SE DEVOLVERÁN AL CLIENTE
    class Result{}
    $response=new Result();
    //SE COMPRUEBA LA SESION DEL USUARIO
    if (@!$_SESSION["user"]){
        $_SESSION["user"]=null;
    }
    $accion=@$_GET["accion"]??null;//SE ESCOGE LA OPCIÓN ADECUADA SEGÚN LA URL
    //PRUEBAS: print_r($params);
    switch($accion){
        //------------------------------------------FUNCIONES DE SESION DEL USUARIO----------------------------------------------------------
        //FUNCION DE INICIO DE SESIÓN
        case "login": 
            $datosUser=loginUser($params->username,$params->password);
            if (!(empty($datosUser))){//Si se obtienen datos, el inicio de sesión habrá sido exitoso
                $response->result="OK";
                //Se construye un nuevo usuario y se establece ese usuario en la sesion
                $usuario=new USER($datosUser["Username"],$datosUser["Password"],$datosUser["email"],
                                  $datosUser["fecha_alta"],$datosUser["puntos"],
                                  $datosUser["img_perfil"],$datosUser["tipo"]);
                $_SESSION["user"]=$usuario->getUsername();
                //Se guardan los datos del usuario conectado en la variable que se enviará al cliente
                $usuario->guardarUsuario($response);
            }else{//Si no se obtienen datos, el inicio de sesión habrá fallado
                $response->result="FAILED";
            }
        break;
        //FUNCION DE REGISTRO DE USUARIO
        case "register":
            $response->result=register($params->username,$params->password,$params->email);
            switch($response->result){
                case "OK":
                    /**
                     * SE ENVIA EL CORREO DE AUTENTICACION DEL USUARIO*
                     */
                break;
            }
        break;
        //FUNCION DE CERRAR SESIÓN
        case "logout": 
            //Se construye un usuario nulo y se establece el usuario de la sesion nulo
            $_SESSION["user"]=null;
            $usuario=new USER();
            //Se guardan los datos del usuario desconectado en la variable que se enviará al cliente
            $usuario->guardarUsuario($response);
            $response->result="OK";
        break;
        //------------------------------------------------LEER INFORMACION DE ATRACCIONES Y PARQUES----------------------------------------------------------
        //FUNCION PARA OBTENER TODA LA INFORMACION DE LOS PARQUES
        case "infoParque": 
            //Se obtiene la información del parque buscado
           $datosParque=obtenerDatosParque($params->nombreParque);
           //Si la variable tiene datos de un parque
           if (!(empty($datosParque))){
                //Se creará un objeto parque con los datos para enviarlos al cliente
                $fecha=date_parse($datosParque["fecha_construccion"]);
                $fechaConstruida=$fecha['day']."/".$fecha['month']."/".$fecha['year'];
                $parque=new PARQUE($datosParque["nombre"],$datosParque["localizacion"],$datosParque["aforo"],
                                    $fechaConstruida,$datosParque["logo"],$datosParque["img_mapa"]);
                //Una vez creado el objeto, se guardará en la variable que se enviará al cliente
                $parque->guardarParque($response);

                //Si se ha obtenido datos de un parque, se obtendrán también los datos relacionados con ese parque
                //de otras tablas relacionadas sin problemas

                //Obtención de zonas pertenecientes al parque
                $zonas=obtenerZonasParque($params->nombreParque);
                $response->zonas=$zonas;

                //Obtención de los textos pertenecientes a cada zona del parque
                $textoZonas=obtenerTextoZonas($zonas);
                $response->textoZonas=$textoZonas;

                //Obtención de las atracciones pertenecientes a cada zona del parque
                $atracciones=obtenerAtraccionesParque($params->nombreParque);
                $response->atracciones=$atracciones;

                //Obtencion de los textos de cada parque
                $textos=obtenerTextosParque($params->nombreParque);
                $response->textos=$textos;

                $response->result="OK";//Se han recogido los datos sin problemas
           }else{
                //Si no se obtienen datos de un parque, se enviará al cliente un fallo de recogida 
                $response->result="FAILED";
           }
        break;
        //FUNCION PARA OBTENER TODA LA INFORMACION DE CADA ATRACCIÓN
        case "infoAtraccion":
            //Se obtiene la información de la atracción buscada
            $datosAtraccion=obtenerDatosAtraccion($params->nombreAtraccion);
            //Si se obtienen datos de la atraccion
            if (!(empty($datosAtraccion))){
                //Se creará un objeto atraccion con los datos para enviarlos al cliente
                $atraccion=new ATRACCION($datosAtraccion["nombre"],$datosAtraccion["parque"],$datosAtraccion["zona"]
                                        ,$datosAtraccion["categoria"],$datosAtraccion["fabricante"],$datosAtraccion["altura"]
                                        ,$datosAtraccion["longitud"],$datosAtraccion["inversiones"],$datosAtraccion["velocidad"]
                                        ,$datosAtraccion["video_onride"]);
                //Una vez creado el objeto, se guardará en la variable que se enviará al cliente
                $atraccion->guardarAtraccion($response);

                //Si se ha obtenido datos de una atraccion, se obtendrán también los datos relacionados con esa
                //atraccion de otras tablas relacionadas sin problemas

                //Obtencion de los textos de la atraccion
                $textos=obtenerTextosAtraccion($params->nombreAtraccion);
                $response->textosAtraccion=$textos;

                //Obtencion de las imagenes de la atraccion
                $img=obtenerImgAtraccion($params->nombreAtraccion);
                $response->img=$img;

                $response->result="OK";//Se han recogido los datos sin problemas
            }else{
                //Si no se obtienen datos de una atraccion, se enviará al cliente un fallo de recogida 
                $response->result="FAILED";
            }
        break; 
        //------------------------------------------COMPONENTE COMENTARIOS----------------------------------------------------------
        //FUNCION PARA MOSTRAR TODOS LOS COMENTARIOS DE UNA PÁGINA ESPECIFICA
        case "comentariosPagina":
           $comentarios=obtenerComentariosPagina($params->nombrePagina);
           if (!(empty($comentarios))){
                $response->result="OK";

                $response->comentarios=$comentarios;
            }else{
                $response->result="FAILED";
            }
        break; 
        //FUNCION PARA ESCRIBIR UN COMENTARIO EN UNA PÁGINA ESPECIFICA
        case "publicarComentario":
            $response->puntos=publicarComentario($params->comentario,$params->pagina,$params->user);
            $response->result="OK";
        break; 
        //------------------------------------------COMPONENTE VALORACIONES----------------------------------------------------------
        //FUNCION PARA HACER UNA VALORACION DE UN PARQUE O ATRACCION
        case "nuevaValoracion": 
            $resultado=nuevaValoracion($params->valoracion,$params->pagina,$params->user);
            $response->result=$resultado[0];
            if (!empty($resultado[1])){
                $response->puntos=$resultado[1];
            }
        break;
        //FUNCION PARA OBTENER LA MEDIA DE VALORACIONES DE UN PARQUE O ATRACCION
        case "mediaValoraciones": 
            $response->media=obtenerMedia($params->pagina);

            $response->result="OK";
        break;
        //FUNCION PARA OBTENER LA VALORACION EN UNA PAGINA ESPECIFICA DEL USUARIO QUE ESTA CONECTADO 
        case "valoracionUser": 
            $response->valoracion=obtenerValoracionUser($params->user,$params->pagina);

            $response->result="OK";
        break;
        //------------------------------------------PERFIL DE USUARIO----------------------------------------------------------
        //FUNCION PARA OBTENER LOS DATOS QUE SE MOSTRARAN EN EL PERFIL DE USUARIO
        case "perfilUsuario": 
            $datosUsuario=obtenerUsuario($params->perfilUser);
            if (!empty($datosUsuario)){
                $usuario=new USER($datosUsuario["Username"],null,$datosUsuario["email"],
                                  $datosUsuario["fecha_alta"],$datosUsuario["puntos"],
                                  $datosUsuario["img_perfil"],$datosUsuario["tipo"]);
                //Se guarda en la variable que se enviará al cliente los datos del perfil de usuario
                $usuario->guardarUsuario($response);
                $usuario->obtenerComentarios($response);
                $usuario->obtenerValoraciones($response);

                $response->result="OK";
            }else{
                $response->result="NO EXISTE";
            }
        break;
        //------------------------------------------ENVIO DE SOLICITUD--------------------------------------------------------
        //FUNCION PARA ENVIAR UN CORREO A UN ADMINISTRADOR DE LA PAGINA
        case "envioMail": 
            $emisor=$params->emisor;
            $asunto=$params->asunto;
            $mensaje=$params->mensaje;
            if (enviarSolicitud($emisor,$asunto,$mensaje)){//Si se ha enviado el mensaje
                $response->result="OK";
            }else{
                $response->result="FAILED";
            }
        break;
        //------------------------------------------GESTION DE USUARIOS----------------------------------------------------------
        //FUNCION PARA OBTENER TODA LA INFORMACION DE LOS USUARIOS Y PODER GESTIONARLOS
        case "obtenerTodosUsuarios":
            $usuarios=obtenerInfoUsuarios();
            $response->usuarios=$usuarios;
            $response->result="OK";
        break;
        //FUNCION PARA ELIMINAR LOS DATOS DE UN USUARIO DE LA BD
        case "eliminarUsuario":
            $response->result=eliminarUsuario($params->usuario);
        break;
        //FUNCION PARA SUBIR Y GUARDAR EN EL SERVIDOR UNA NUEVA IMAGEN SUBIDA POR ALGUN USUARIO
        case "subirImagen":
            if ($params->file->base64textString){//Si se trata de una nueva imagen, se trabajará con su informacion
                $archivo=$params->file->base64textString;
                $nombreArchivo = $params->file->nombreArchivo;//Se obtiene rel nombre del archivo
                $archivo = base64_decode($archivo);//Se decodifica el archivo
                //Se guarda la imagen con el nombre escogido
                $filePath = $_SERVER['DOCUMENT_ROOT']."/CoasterWorld/server/img/user/".$nombreArchivo;
                file_put_contents($filePath, $archivo);
                //Se devuelve la ruta de la imagen y el resultado de la operacion
                $response->ruta="http://localhost/CoasterWorld/server/img/user/".$nombreArchivo;
                $response->result="OK";
            }else{
                $response->result="FAILED";
            }
        break;
        //FUNCION PARA MODIFICAR LOS DATOS DE UN USUARIO
        case "modificarUser":
            $response->result=modificarUser($params->username,$params->puntos,
                                            $params->tipo,$params->img,$params->userMod);
        break;
    }
    //SE DEVUELVEN LOS DATOS AL CLIENTE
    header("Content-Type: application/json");
    echo(json_encode($response));