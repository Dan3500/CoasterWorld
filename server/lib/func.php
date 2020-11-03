<?php
    //----------------------------------------------------FUNCIONES DE LA PAGINA DE LOGIN/REGISTER--------------------------------------------------------

    /**
     * Funcion para iniciar sesión
     * @param user: String: Nombre de usuario
     * @param pass: String: Contraseña del usaurio
     * @return resultado: Array: Contiene todos los datos del usuario que acaba de iniciar sesión.
     * Si no se inicia sesión, el array se devolverá vacío
     */
    function loginUser($user,$pass) {
        $passMod=hash("sha256",$pass);//Se codifica la contraseña
        $bbdd=new BBDD();
            $resultado=$bbdd->logIn($user,$passMod);//Se llama al metodo para iniciar sesión en la base de datos
        unset($bbdd);
        return $resultado;
    }

    /**
     * Funcion para registrar el usuario
     * @param user: String: Nombre de usuario
     * @param pass: String: Contraseña del usaurio
     * @param email: String: Correo electronico del usuario
     * @return resultado: String: Indica si se existen errores a la hora de registrar el usuario (INVALID USERNAME, INVALID EMAIL, FAILED) o
     * si se registra el usuario de manera correcta (OK)
     */
    function register($user,$pass,$email){
        $bbdd=new BBDD();
        //Se comprueba si el nombre de usuario y el correo electronico con el que se va a registrar el usuario ya existen en la base de datos
            if ($bbdd->comprobarUsername($user)){
                if ($bbdd->comprobarEmail($email)){
                    $passMod=hash("sha256",$pass);//Se codifica la contraseña
                    //Se obtiene la fecha actual y se modifica para insertarlo de manera correcta en la base de datos
                    $fechaActual=getdate();
                    $fecha_alta=$fechaActual["year"]."-".$fechaActual["mon"]."-".$fechaActual["mday"];
                    //Se establece la imagen por defecto para la imagen de perfil del usuario
                    $img="http://localhost/CoasterWorld/server/img/user/default.png";
                    //Se registra el usuario en la base de datos
                    $resultado=$bbdd->register($user,$passMod,$email,$fecha_alta,$img);
                }else{//Si el correo ya esta registrado en la base de datos, se devolverá el siguiente error
                    $resultado="INVALID EMAIL";
                }
            }else{//Si el nombre de usuario ya esta registrado en la base de datos, se devolverá el siguiente error
                $resultado="INVALID USERNAME";
            }
        unset($bbdd);
        return $resultado;
    }

    //---------------------------------------------------------FUNCIONES DE LA PAGINA DE PARQUES-------------------------------------------------------

    /**
     * @param parque: Nombre del parque del que se va a obtener la informacion
     * @return resultado: Array que contiene los datos de un parque
     */
    function obtenerDatosParque($parque){
        $bbdd=new BBDD();
            //Se busca la información del parque en la base de datos y se recoge
            $resultado=$bbdd->comprobarParque($parque);
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para obtener los textos de cada parque que se mostrarán en la página
     * @param parque: Nombre del parque del que se obtendrán los ficheros de texto
     * @return resultado: Array que contiene todos los textos (Strings) obtenidos de archivos de texto
     */
    function obtenerTextosParque($parque){
        $resultado=array();
        $texto="";
        $bbdd=new BBDD();
            //Se obtienen de la BD los archivos de texto de cada parque
            $textos=$bbdd->obtenerTextosDeParque($parque);
            //Para cada archivo de texto, se abrirá el archivo y se obtendrá el texto que contenga.
            for ($i=0;$i<count($textos);$i++){
                $file=fopen($textos[$i],"r");
                    if ($file){
                        while(!feof($file)){
                            $texto=fgets($file);//Se obtiene todo el texto del fichero
                        }
                        array_push($resultado,$texto);//Se añade al array que se devolverá al cliente
                    }
                fclose($file);
            }
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para obtener una lista con la información de las zonas que pertenecen a cada parque
     * @param parque: Nombre del parque del que se quiere obtener la lista de zonas
     * @return resultado: Array que contiene todas las zonas y su información que pertenecen a un parque
     */
    function obtenerZonasParque($parque){
        $bbdd=new BBDD();
            //Se obtiene la lista de zonas de la BD
            $resultado=$bbdd->obtenerZonas($parque);
        unset($bbdd);
        return $resultado;
    }

    /**
     * 
     */
    function obtenerAtraccionesParque($parque){
        $resultado=array();
        $bbdd=new BBDD();
            //Se obtienen todas las zonas del parque
            $zonas=$bbdd->obtenerZonas($parque);
            //Para cada zona
            for ($i=0;$i<count($zonas);$i++){
                //Se guarda en un array los nombres de las atracciones de una zona
                //(formato Zona => array de los nombres de las atracciones de esa zona)
                $arrayAtraccionesZona=$bbdd->obtenerNombreAtraccionesDeZona($zonas[$i]['nombre_zona']);
                //Se guarda cada array de atracciones en un array que contendrá todas las zonas con todas
                //las atracciones de cada una
                $resultado+=$arrayAtraccionesZona;
            }
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para obtener el texto de cada zona del parque
     * @param zonas: Array que contiene todas las zonas pertenecientes a un parque
     * @return resultado: Array que contiene el texto (String) de cada zona del parque
     */
    function obtenerTextoZonas($zonas){
        $resultado=array();
        $bbdd=new BBDD();
        foreach ($zonas as $zona){//Para cada zona
            //Se obtendra el archivo de texto en el que se encontrará el texto de la zona
            $archivoTexto=$bbdd->obtenerTextoZona($zona['nombre_zona']);
            //Se abrirá el archivo
            $file=fopen($archivoTexto['texto'],"r");
            if ($file){
                while(!feof($file)){
                    $texto=fgets($file);//Se obtiene el texto que contiene
                }
                //Se guarda en un array asociativo (Nombre de la zona => texto de esa zona)
                $resultado[$zona['nombre_zona']]=$texto;
            }
            fclose($file);
        }
        unset($bbdd);
        return $resultado;
    }
    
    //---------------------------------------------------------FUNCIONES DE LA PAGINA DE ATRACCIONES-------------------------------------------------------

    /**
     * Metodo para obtener toda la informacion de una atracción específica
     * @param atraccion: Nombre de la atraccion que se ha buscado
     * @return resultado: Array con todos los datos de la atraccion 
     */
    function obtenerDatosAtraccion($atraccion){
        $bbdd=new BBDD();
            //Se recogeran de la base de datos los datos de la atraccion
            $resultado=$bbdd->comprobarAtraccion($atraccion);
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para obtener los textos de cada atracción
     * @param atraccion: Nombre de la atraccion de la que se quiere obtener los textos
     * @return resultado: Array que contiene los textos (Strings) de cada atraccion
     */
    function obtenerTextosAtraccion($atraccion){
        $resultado=array();
        $bbdd=new BBDD();
            //Se obtiene los archivos de texto de la atraccion
            $textos=$bbdd->obtenerTextosAtraccion($atraccion);
            //Para cada archivo de texto
            foreach($textos as $texto){
                $file=fopen($texto,"r");
                if ($file){//Se leeran los archivos y se obtendrán los textos
                    while(!feof($file)){
                        $text=fgets($file);
                        //Se almacenarán los textos en el array que se devolverá al cliente
                        array_push($resultado,$text);
                    }
                }
                fclose($file);
            }
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para obtener las imagenes de una atracción
     * @param atraccion: Nombre de la atraccion de la cual se obtendrán las imagenes
     */
    function obtenerImgAtraccion($atraccion){
        $resultado=array();
        $bbdd=new BBDD();
            //Se obtienen las rutas de las imagenes de la atraccion
            $resultado=$bbdd->obtenerImgAtraccion($atraccion);
        unset($bbdd);
        return $resultado;
    }

//---------------------------------------------------------FUNCIONES DEL COMPONENTE DE LOS COMENTARIOS------------------------------------------------------
   
    /**
     * Metodo para obtener una lista con los comentarios que se deben mostrar en una página específica
     * @param pagina: Pagina donde se mostrarán los comentarios
     * @return resultado: Array que contendrá otros arrays con todos los datos de cada comentario. Si no hay
     * comentarios en la página, este array estará vacio
     */
    function obtenerComentariosPagina($pagina){
        $resultado=array();
        $bbdd=new BBDD();
            //Se leeran los comentarios que aparecerán en la página
            $resultado=$bbdd->obtenerComentarios($pagina);
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo para almacenar un comentario y los datos de este en la BD
     * @param comentario: Texto que ha escrito el usuario que se va a almacenar
     * @param pagina: Lugar donde se ha escrito el comentario
     * @param user: Email del Usuario que ha escrito el comentario
     * @return resultado: String que indicará el resultado de la insercion
     */
    function publicarComentario($comentario,$pagina,$user){
        $bbdd=new BBDD();
            //Se almacenará en la BD el comentario y sus datos
            $resultado=$bbdd->publicarComentario($comentario,$pagina,$user);
            if ($resultado=="OK"){
                $resultado=$bbdd->sumarPuntos($user);//Se devolverán los puntos que tiene el usuario
            }
        unset($bbdd);
        return $resultado;
    }

    function eliminarComentario($usuario,$comentario,$pagina){
        $bbdd=new BBDD();
            //Se eliminará en la BD el comentario
            $resultado=$bbdd->eliminarComentario($comentario,$pagina,$usuario);
        unset($bbdd);
        return $resultado;
    }

    //------------------------------------------------------COMPONENTE VALORACIONES------------------------------------------------
    /**
     * Metodo para insertar en la BD una nueva valoración hecha por el usuario o actualizar una ya insertada
     * @param valoracion: Puntuacion que le ha dado el usuario al parque o atraccion
     * @param pagina: Nombre de la página que ha valorado el usuario
     * @param user: Email del usuario que ha hecho la valoracion
     * @return resultado: Array que indica el resultado de la insercion de la valoracion
     * enviara ACTUALIZAR si se ha actualizado una valoracion o INSERTAR si se ha almacenado una nueva
     * y los puntos que tiene el usuario nada más publicar una nueva valoracion
     */
    function nuevaValoracion($valoracion,$pagina,$user){
        $resultado=array();
        $bbdd=new BBDD();
            if ($bbdd->comprobarValoracion($pagina,$user)){
            //Si ya existe la valoracion de este usuario en esta pagina, se actualizará el registro de la BD
                $resultado[0]=$bbdd->actualizarValoracion($valoracion,$pagina,$user);
            }else{
            //Si no existe la valoracion de este usuario en esta pagina, se insertará un nuevo registro en la BD
                $resultado[0]=$bbdd->insertarNuevaValoracion($valoracion,$pagina,$user);
                if ($resultado[0]=="INSERTAR"){
                    $resultado[1]=$bbdd->sumarPuntos($user);
                }
            }
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo que accede a la BD para obtener la media total de las valoraciones realizadas en una página especifica
     * @param pagina: Nombre de la página de donde se va a obtener la media
     * @return resultado: Number que indica la media de todas las valoraciones de una página. Si en la página no hay ninguna media debido a que no
     * tiene valoraciones, se devolverá 0
     */
    function obtenerMedia($pagina){
        $bbdd=new BBDD();
            //Se accede a la informacion de la BD
            $resultado=$bbdd->obtenerMediaValoraciones($pagina);
        unset($bbdd);
        return $resultado;
    }

    /**
     * Metodo que accede a la BD para obtener la valoracion que ha hecho un usuario en una página concreta
     * @param user: Usuario del que se va a obtener la valoracion
     * @param pagina: Nombre de la página de donde se va a obtener la media
     * @return resultado: Number que indica la valoracion realizada por el usuario. Si no ha realizado ninguna valoracion en la página especificada,
     * se devolverá 0.
     */
    function obtenerValoracionUser($user,$pagina){
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD
            $resultado=$bbdd->obtenerValoracionUser($user,$pagina);
        unset($bbdd);
        return $resultado;
    }

    //-----------------------------------------------------PERFIL DE USUARIO----------------------------------------------
    /**
     * Metodo para conectarse a la BD y obtener de ella la informacion del usuario buscado
     * @param username: Nombre del usuario del que se va a obtener la informacion
     * @return resultado: Array con la información del usuario que se mostrará en el perfil
     */
    function obtenerUsuario($username){
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD
            $resultado=$bbdd->obtenerInfoUser($username);
        unset($bbdd);
        return $resultado;
    }

    //-----------------------------------------------------ENVIO DE SOLICITUD-----------------------------------------------
    /**
     * Metodo para enviar un correo a un usuario administrador
     * @param emisor: String que contiene el usuario que ha enviado el email
     * @param asunto: String que contiene el asunto del email
     * @param mensaje: String que contiene el mensaje del email
     * @return boolean: 
     */
    function enviarSolicitud($emisor,$asunto,$mensaje){
        $administradores=array();
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD para obtener todos los usuarios administradores
            $administradores=$bbdd->obtenerAdmins();
        unset($bbdd);
        //De los administradores obtenidos, se escoge uno aleatoriamente
        $destinatario=$administradores[rand(0,(count($administradores))-1)];
        //Se crea el mensaje y se envia el mensaje
        $contenido="Solicitud de ".$emisor.":\n".$mensaje;
        if (@mail($destinatario,$asunto,$contenido)){//Si se envia el mensaje
            //*hb uCOMPROBAR EMAIL
            return true;
        }else{//Si no se envia
            return false;
        }
    }

    //----------------------------------------------------PAGINA DE GESTION DE USUARIOS---------------------------------------------
    /**
     * Metodo para obtener la informacion de todos los usuarios que se van a mostrar al administrador
     * @return return: Array con toda la informacion de todos los usuarios
     */
    function obtenerInfoUsuarios(){
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD
            $usuarios=$bbdd->obtenerInfoTodosUsuarios();
        unset($bbdd);
        return $usuarios;
    }

    /**
     * Metodo para llamar a la funcion de la BD que elimina un usuario de la BD
     * @param usuario: Nombre del usuario que se va a eliminar
     * @return return: String que contiene el resultado de la operacion
     */
    function eliminarUsuario($usuario){
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD
            $result=$bbdd->eliminarUsuario($usuario);
        unset($bbdd);
        return $result;
    }

    /**
     * Metodo para modificar un usuario registrado con nuevos datos
     * @param username: Nuevo nombre de usuario del usuario
     * @param puntos: Nueva cantidad de puntos del usuario
     * @param tipo: Nuevo tipo del usuario
     * @param img: Ruta de la nueva imagen del usuario
     * @param usuario: Nombre de usuario del usuario que se quiere modificar
     * @return result: Resultado de la operacion
     */
    function modificarUser($username,$puntos,$tipo,$img,$usuario){
        $bbdd=new BBDD();
        //Se accede a la informacion de la BD
            $result=$bbdd->modificarUser($username,$puntos,$tipo,$img,$usuario);
        unset($bbdd);
        return $result;
    }