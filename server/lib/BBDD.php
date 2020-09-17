<?php
    class BBDD{
        const HOST="localhost";
        const US="root";
        const PW="";
        const BD="coasterworld";
        private $bbdd;

        /**
         * Constructor de la base de datos. Se crea un objeto mysqli en la variable bbdd y se conecta a la BD de escuela
         */
        function __construct()
        {
            try{
                $this->bbdd=new mysqli();
                $this->bbdd->connect(self::HOST,self::US,self::PW,self::BD);
                $this->bbdd->query("SET NAMES 'utf8'");
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }
        }

        //-------------------------------------------------------- FUNCIONES DE LOS OBJETOS------------------------------------------------------------------------------------

        /**
         * Metodo para obtener el nombre de la categoría de una atraccion
         * @param numCategoria: ID que hace referencia al nombre de la categoria de una atraccion
         * @return return: String que contiene el nombre de la categoria de la atraccion
         */
        public function obtenerCategoria($numCategoria){
            $return="";
            try{
                if ($this->bbdd){
                    $sql="SELECT nombre_categoria FROM categoriaatracciones WHERE id_categoria LIKE '$numCategoria'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                    //Si se encuentra una categoria, se recogera el nombre de esta
                        $row=mysqli_fetch_assoc($result);
                        $return=$row["nombre_categoria"];
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }
        //--------------------------------------------------------FUNCIONES DE INICIO DE SESION Y REGISTRO DE USUARIOS---------------------------------------------------------
        /**
         * Metodo para comprobar si las credenciales del usuario se encuentran en la base de datos y son correctas
         * @param user: String: Nombre de usuario
         * @param pass: String: Contraseña del usuario
         * @return return: Array: Datos del usuario que ha iniciado sesión. Si no se encuentra ninguno, sus valores
         * estarán vacios
         */
        public function logIn($user,$pass){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT * FROM usuario WHERE Username LIKE '$user' AND Password LIKE '$pass'";
                    $result=$this->bbdd->query($sql);
                    while($row=mysqli_fetch_assoc($result)){
                    //Cuando se realice la consulta, los datos obtenidos se guardarán en el array que se devolverá
                        $return=$row;
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Método para insertar un nuevo usuario en la base de datos
         * @param user: String: Nombre de usuario
         * @param pass: String: Contraseña del usuario
         * @param email: String: Correo electronico del usuario
         * @param fecha_alta: Date: Fecha en la que se ha realizado el registro del usuario
         * @param img: String: Ruta a la imagen de perfil por defecto que se le establecerá al usuario 
         * @return return: String: Indica si se ha registrado el usuario de forma correcta (OK) o no (FAILED)
         */
        public function register($user,$pass,$email,$fecha_alta,$img){
            $return="";
            try{
                if ($this->bbdd){
                    $sql="INSERT INTO usuario VALUES ('$user','$pass','$email','$fecha_alta',0,'$img','usuario',1)";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si no hay errores a la hora de insertar el usuario, se aprobará el registro
                        $return="OK";
                    }else{
                        $return="FAILED";
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Método para comprobar si el nombre de usuario que se intenta registrar en la base de datos ya existe
         * @param username: String: Nombre de usuario
         * @return return: Boolean: Valor para indicar si el usuario esta registrado en la base de datos (false) o no (true).
         * Si el valor es true, se seguirá con el registro del usuario
         */
        public function comprobarUsername($username){
            $return=false;
            try{
                if ($this->bbdd){
                    $sql="SELECT Username FROM usuario WHERE Username LIKE '$username'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if($row==null){
                        //Si no se encuentra ningun nombre, el usuario no está registrado en la base de datos y se seguira con el registro
                            $return=true;
                        }else{
                        //Si se encuentra un nombre, no se seguirá con el registro y saltará el error INVALID USERNAME
                            $return=false;
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Método para comprobar si el correo electronico del usuario que se intenta registrar en la base de datos ya existe
         * @param email: String: Correo electronico del usuario
         * @return return: Boolean: Valor para indicar si el correo esta registrado en la base de datos (false) o no (true).
         * Si el valor es true, se seguirá con el registro del usuario
         */
        public function comprobarEmail($email){
            $return=false;
            try{
                if ($this->bbdd){
                    $sql="SELECT email FROM usuario WHERE email LIKE '$email'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if($row==null){
                        //Si no se encuentra ningun email, el usuario no está registrado en la base de datos, se seguira con el registro
                            $return=true;
                        }else{
                        //Si se encuentra un email, no se seguirá con el registro y saltará el error INVALID EMAIL
                            $return=false;
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }
        
        //---------------------------------------------------FUNCIONES DE LA PAGINA DE MOSTRAR PARQUES-----------------------------------------------------------
        /**
         * Metodo para seleccionar de la BD toda la información de un parque
         * @param parque: String con el nombre del parque del que se va a obtener la informacion
         * @return return: Array con los datos del parque. Si el parque no es encontrado,
         * este Array estará vacio 
         */
        public function comprobarParque($parque){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT * FROM parques WHERE nombre LIKE '$parque'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                    //Si la consulta es correcta, se guardarán los datos en la variable que se retornará
                        $row=mysqli_fetch_assoc($result);
                        $return=$row;
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener toda la información de las zonas que tiene un parque guardada en la BD
         * @param parque: Nombre del parque del que se va a sacar la lista de zonas
         * @return return: Array que contiene todas las zonas con su información
         */
        public function obtenerZonas($parque){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT * FROM zonas WHERE parque LIKE '$parque'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                    //Si se encuentran zonas del parque, se recogerá y guardará la información de cada una en un array
                        while($row=mysqli_fetch_assoc($result)){
                            array_push($return,$row);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener el nombre de las atracciones que se encuentran en una zona
         * @param nombreZona: Nombre de la zona del que se obtendrán los nombres de las atracciones
         * @return return: Array bidimensional que contiene los nombres de una zona específica (con el formato
         * Nombre de la zona => array con los nombres de las atracciones de la zona)
         */
        public function obtenerNombreAtraccionesDeZona($nombreZona){
            $atraccionesZona=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT nombre FROM atracciones WHERE zona LIKE '$nombreZona'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si se encuentran nombres de atracciones
                        while($row=mysqli_fetch_assoc($result)){
                            array_push($atraccionesZona,$row);
                        }
                        $return=array($nombreZona=>$atraccionesZona);
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener los ficheros de texto que contienen los párrafos de texto de cada parque
         * @param parque: Nombre del parque del que se obtendrán los ficheros de texto
         * @return return: Array con todos los ficheros de texto del parque
         */
        public function obtenerTextosDeParque($parque){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT texto FROM textoparques WHERE parque LIKE '$parque'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si se encuentran los ficheros de texto, se añadirán al array
                        while($row=mysqli_fetch_assoc($result)){
                            array_push($return,$row['texto']);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener el fichero de texto almacenado en el servidor que contiene la información de
         * cada zona
         * @param zona: Nombre de la zona de la que se obtendrá el fichero de texto
         * @return return: Array que contiene el o los ficheros de texto de la zona
         */
        public function obtenerTextoZona($zona){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT texto FROM textozonas WHERE zona LIKE '$zona'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si se encuentra un fichero en la BD
                        while($row=mysqli_fetch_assoc($result)){
                            $return=array("texto"=>$row['texto']);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        //---------------------------------------------------FUNCIONES DE LA PAGINA DE MOSTRAR ATRACCIONES-------------------------------------------------------
        /**
         * Metodo para obtener toda la información guardada de una atraccion
         * @param atraccion: Nombre de la atraccion de la cual se recogeran los datos
         * @return return: Array con todos los datos de la atraccion
         */
        public function comprobarAtraccion($atraccion){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT * FROM atracciones WHERE nombre LIKE '$atraccion'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        //Si se encuentra la atracción buscada, se guardarán sus datos en el array que se devolverá
                        $row=mysqli_fetch_assoc($result);
                        $return=$row;
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener los ficheros de texto de cada atraccion almacenados en la BD
         * @param atraccion: Nombre de la atraccion de la que se obtendrán los archivos de texto de la atraccion
         * @return return: Array con todos los ficheros de texto de la atraccion
         */
        public function obtenerTextosAtraccion($atraccion){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT texto FROM textoatracciones WHERE atraccion LIKE '$atraccion'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                    //Si se encuentran ficheros de texto, se almacenarán en el array de devuelta
                        while($row=mysqli_fetch_assoc($result)){
                            array_push($return,$row['texto']);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener la ruta de las imagenes de cada atraccion
         * @param atraccion: Nombre de la atraccion de la que se obtendrán las imagenes
         * @return return: Array con las rutas de las imagenes 
         */
        public function obtenerImgAtraccion($atraccion){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT img_atraccion FROM imagenesatracciones WHERE atraccion LIKE '$atraccion'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        //Si existe la atraccion se obtendrán las rutas de las imagenes
                        while($row=mysqli_fetch_assoc($result)){
                            array_push($return,$row['img_atraccion']);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }
        //---------------------------------------------------------COMPONENTE DE COMENTARIOS---------------------------------------------------------------------------------
        /**
         * Metodo para obtener todos los comentarios de una página concreta
         * @param pagina: Nombre de la página donde se van a imprimir los comentarios
         * @return return: Array que contiene otros arrays con todos los datos relacionados con cada comentario.
         * Si la página no tiene comentarios, se enviará el array vacío
         */
        function obtenerComentarios($pagina){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT img_perfil, Username, mensaje, fecha FROM usuario u, comentarios c 
                    WHERE c.usuario LIKE u.email AND c.pagina LIKE '$pagina'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si hay comentarios en la página, se rellenará el array con los datos de cada comentario
                        while($row=mysqli_fetch_assoc($result)){
                            //Se convierte la fecha en formato inglés al formato español
                            $fecha=strtotime($row["fecha"]);
                            $fechaActual=date('d/m/Y',$fecha);
                            //Se añaden los datos a un array y se guardan en el array que se devolvera
                            $datos=array("Usuario"=>$row["Username"],"Img"=>$row["img_perfil"],"Comentario"=>$row["mensaje"],"Fecha"=>$fechaActual);
                            array_push($return,$datos);
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para insertar un nuevo comentario a la tabla de comentarios
         * @param comentario: Texto que ha escrito el usuario
         * @param pagina: Página donde se ha publicado el comentario
         * @param user: Email del usuario que ha escrito el comentario
         * @return return: String que indicará el resultado de la sentencia para insertar los datos
         */
        function publicarComentario($comentario,$pagina,$user){
            $return="FAILED";
            try{
                if ($this->bbdd){
                    $sql="SELECT max(id_mensaje) as maxId FROM comentarios";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if ($row["maxId"]){
                            //Si se ha obtenido correctamente el ID máximo para insertar el comentario
                            $id=intval(++$row["maxId"]);//Se creará un nuevo ID para el comentario
                            //Se generará la fecha actual a la que se ha publicado el comentario
                            $fecha=getdate();
                            $fechaActual=$fecha["year"]."-".$fecha["mon"]."-".$fecha["mday"];
                            $sql="INSERT INTO comentarios VALUES ('$user', $id, '$comentario','$pagina','$fechaActual')";
                            $result=$this->bbdd->query($sql);//Se insertará en la base de datos
                            if ($result){//Si no hay errores a la hora de insertar el comentario, se aprobará la insercion
                                $return="OK";
                            }else{//Si hay algun error, fallará la insercion
                                $return="FAILED";
                            }
                        }else{//Si no se ha obtenido una ID máxima, significa que es el primer comentario que se insertará en esta tabla
                            $id=intval(1);//Se creará un nuevo ID para el comentario
                            //Se generará la fecha actual a la que se ha publicado el comentario
                            $fecha=getdate();
                            $fechaActual=$fecha["year"]."-".$fecha["mon"]."-".$fecha["mday"];
                            $sql="INSERT INTO comentarios VALUES ('$user', $id, '$comentario','$pagina','$fechaActual')";
                            $result=$this->bbdd->query($sql);//Se insertará en la base de datos
                            if ($result){//Si no hay errores a la hora de insertar el usuario, se aprobará el registro
                                $return="OK";
                            }else{//Si hay algun error, fallará la insercion
                                $return="FAILED";
                            }
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        //-------------------------------------------------COMPONENTE VALORACIONES----------------------------------------------

        /**
         * Metodo para comprobar si la valoracion introducida por un usuario en una pagina especifica
         * es nueva o ya estaba insertada anteriormente
         * @param pag: Página en la que el usuario ha hecho la valoracion
         * @param user: Email del usuario que ha hecho la valoracion
         * @return return: Boolean que indica si la valoracion en la pagina especifica hecha por el usuario
         * es nueva (false) o si ya esta insertada (true)
         */
        function comprobarValoracion($pag,$user){
            try{
                if ($this->bbdd){
                    $sql="SELECT id_valoracion as ID FROM valoraciones WHERE pagina LIKE '$pag' AND usuario LIKE '$user'";
                    $result=$this->bbdd->query($sql);
                    //Si la query obtiene resultados, indicará que existe una valoracion en esa página hecha por el usuario que esta
                    //haciendo una valoracion de nuevo
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if ($row["ID"]){
                            $return=true;
                        }else{
                            $return=false;
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para insertar una publicacion nueva en la tabla de valoraciones
         * @param valoracion: Puntos de la valoracion
         * @param pagina: Nombre de la página donde se ha hecho la valoracion
         * @param user: Email del usuario que ha hecho la valoracion
         * @return return: Resultado de la insercion
         */
        function insertarNuevaValoracion($valoracion,$pagina,$user){
            $return="FAILED INSERTAR";
            try{
                if ($this->bbdd){
                    //Se obtendrá el ID maximo de valoraciones
                    $sql="SELECT max(id_valoracion) as maxId FROM valoraciones";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if ($row["maxId"]){
                            //Si se ha obtenido correctamente el ID máximo para insertar la valoracion
                            $id=intval(++$row["maxId"]);//Se creará un nuevo ID para la valoracion
                            $sql="INSERT INTO valoraciones VALUES ('$user', $id, $valoracion,'$pagina')";
                            $result=$this->bbdd->query($sql);//Se insertará en la base de datos
                            if ($result){//Si no hay errores a la hora de insertar el comentario, se aprobará la insercion
                                $return="INSERTAR";
                            }else{//Si hay algun error, fallará la insercion
                                $return="FAILED INSERTAR";
                            }
                        }else{//Si no se ha obtenido una ID máxima, significa que es la primera valoracion que se insertará en esta tabla
                            $id=intval(1);//Se creará un nuevo ID para la valoracion
                            $sql="INSERT INTO valoraciones VALUES ('$user', $id, $valoracion,'$pagina')";
                            $result=$this->bbdd->query($sql);//Se insertará en la base de datos
                            if ($result){//Si no hay errores a la hora de insertar el comentario, se aprobará la insercion
                                $return="INSERTAR";
                            }else{//Si hay algun error, fallará la insercion
                                $return="FAILED INSERTAR";
                            }
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para actualizar una valoracion de un usuario en una página concreta
         * En cada página cada usuario puede tener solo una valoracion hecha
         * @param valoracion: Puntos de la valoracion
         * @param pagina: Nombre de la página donde se ha hecho la valoracion
         * @param user: Email del usuario que ha hecho la valoracion
         * @return return: Resultado de la actualizacion
         */
        function actualizarValoracion($valoracion,$pagina,$user){
            $return="FAILED ACTUALIZAR";
            try{
                if ($this->bbdd){
                    //Se seleccionara el ID de la fila que se actualizara con los datos de la pagina y el usuario
                    $sql="SELECT id_valoracion as ID FROM valoraciones WHERE usuario LIKE '$user' AND pagina LIKE '$pagina'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if ($row["ID"]){
                            //Si se ha obtenido correctamente el ID 
                            $sql="UPDATE valoraciones SET valoracion = $valoracion WHERE id_valoracion = ".$row["ID"].";";
                            $result=$this->bbdd->query($sql);//Se insertará en la base de datos
                            if ($result){//Si no hay errores a la hora de insertar el usuario, se aprobará el registro
                                $return="ACTUALIZAR";
                            }else{//Si hay algun error, fallará la insercion
                                $return="FAILED ACTUALIZAR";
                            }
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo que obtendra la media estrellas de las valoraciones de una página
         * @param pagina: Página de la que se obtendrá la media de valoraciones
         * @return return: Numero que indica si existe una media de valoraciones. Si no es 0, significará que hay valoraciones en la página
         * y se devolverá la media de estas
         */
        function obtenerMediaValoraciones($pagina){
            try{
                if ($this->bbdd){
                    //Se seleccionará la media (con 1 decimal) de las valoraciones de una página
                    $sql="SELECT ROUND(AVG(valoracion),1) as MEDIA FROM valoraciones WHERE pagina LIKE '$pagina'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        if ($row["MEDIA"]){//Si hay un numero de estrellas de media, se devolverá ese numero al cliente
                            $return=$row["MEDIA"];
                        }else{//Si no hay un numero de media, significa que no hay valoraciones en la página y se devolverá 0
                            $return=0;
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para obtener la valoracion del usuario que esta conectado en una página especifica para mostrarsela
         * @param pagina: Página de la que se obtendrá la valoracion del usuario
         * @param usuario: Usuario conectado al que se le mostrará la valoracion
         * @return return: Numero de estrellas que ha puntuado el usuario en la página. Si el usuario no ha puntuado la página, se devolverá 0
         * al cliente
         */
        function obtenerValoracionUser($usuario,$pagina){
            try{
                if ($this->bbdd){
                    //Se selecciona los puntos de la valoracion de la página y el usuario especifico
                    $sql="SELECT valoracion  FROM valoraciones WHERE pagina LIKE '$pagina' AND usuario LIKE '$usuario'";
                    $result=$this->bbdd->query($sql);
                    if ($result){
                        $row=mysqli_fetch_assoc($result);
                        //Si se obtiene un numero, significa que el usuario ha hecho una valoracion en la página y se devolverá los puntos de esa valoracion al cliente
                        if ($row["valoracion"]){
                            $return=$row["valoracion"];
                        }else{//Si no, significa que no ha hecho ninguna valoracion y enviara 0 al cliente
                            $return=0;
                        }
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        //---------------------------------------------------PERFIL DE USUARIO-------------------------------------------------------------------------------------

        /**
         * Metodo que consultará la BD para obtener toda la información sobre el usuario que se ha buscado
         * @param user: Nombre del usuario del que se va a obtener la informacion
         * @return: Array que contiene los datos del usuario (su nombre, email, fecha de alta, puntos, imagen de perfil y
         * tipo de usuario)
         */
        function obtenerInfoUser($user){
            $return=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT Username, email, fecha_alta, puntos, img_perfil, tipo FROM usuario WHERE Username LIKE '$user'";
                    $result=$this->bbdd->query($sql);
                    while($row=mysqli_fetch_assoc($result)){
                    //Cuando se realice la consulta, los datos obtenidos se guardarán en el array que se devolverá
                        $return=$row;
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        /**
         * Metodo para llevar a cabo la consulta para obtener las valoraciones o comentarios de un usuario
         * @param consulta: Consulta en SQL que se realizará a la BD para obtener los datos. Habrá 4 consultas dependiendo
         * de lo que se quiera obtener: valoraciones de parques o atracciones y comentarios de parques o atracciones
         * @return return: Array que contendra la lista de valoraciones o comentarios sobre parques o atracciones
         */
        function getComentariosValoracionesUser($consulta){
            $return=array();
            try{
                if ($this->bbdd){
                    $result=$this->bbdd->query($consulta);
                    while($row=mysqli_fetch_assoc($result)){
                    //Cuando se realice la consulta, los datos obtenidos se guardarán en el array que se devolverá
                        array_push($return,$row);
                    }
                    
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $return;
        }

        //-----------------------------------------------ENVIO DE SOLICITUD------------------------------------------------
        
        /**
         * Metodo para obtener todos los administradores actuales de la pagina
         * @return return: Array que contiene todos los emails de los administradores de la pagina
         */
        function obtenerAdmins(){
            $admins=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT email FROM usuario WHERE tipo LIKE 'admin'";
                    $result=$this->bbdd->query($sql);
                    while($row=mysqli_fetch_assoc($result)){
                    //Cuando se realice la consulta, los datos obtenidos se guardarán en el array que se devolverá
                        array_push($admins,$row["email"]);
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $admins;
        }
       
         //-----------------------------------------------GESTION DE USUARIOS------------------------------------------------
        
        /**
         * Metodo para obtener todos los usuarios actuales de la pagina y su informacion
         * @return return: Array que contiene toda la informacion de los usuarios
         */
        function obtenerInfoTodosUsuarios(){
            $usuarios=array();
            $nuevoUsuario=array();
            try{
                if ($this->bbdd){
                    $sql="SELECT Username, email, fecha_alta, puntos, img_perfil, tipo FROM usuario";
                    $result=$this->bbdd->query($sql);
                    while($row=mysqli_fetch_assoc($result)){
                    //Cuando se realice la consulta, los datos obtenidos se guardarán en el array que se devolverá
                        //Se modifica la fecha para mostrarla en formato español
                        @$fecha=strtotime($row["fecha"]);
                        $fechaModificada=date('d/m/Y',$fecha);
                        $row["fecha"]=$fechaModificada;
                        $nuevoUsuario=$row;
                        array_push($usuarios,$nuevoUsuario);
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $usuarios;
        }

        /**
         * Metodo para eliminar un usuario y toda su informacion de la BD
         * @param usuario: usuario del que se va a eliminar toda la informacion
         * @return resultado: String que indica el resultado de la operacion
         */
        function eliminarUsuario($usuario){
            $resultado="ERROR";
            try{
                if ($this->bbdd){
                    $sql="DELETE FROM usuario WHERE Username LIKE '$usuario'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si se ha eliminado el usuario
                        $resultado="OK";
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $resultado;
        }

        /**
         * Metodo para modificar un usuario registrado en la base de datos
         * @param username: Nuevo nombre de usuario del usuario
         * @param puntos: Nueva cantidad de puntos del usuario
         * @param tipo: Nuevo tipo del usuario
         * @param img: Ruta de la nueva imagen del usuario
         * @param usuario: Nombre de usuario del usuario que se quiere modificar
         * @return resultado: Resultado de la operacion
         */
        function modificarUser($username,$puntos,$tipo,$img,$usuario){
            $resultado="FAILED";
            try{
                if ($this->bbdd){
                    $sql="UPDATE usuario SET Username = '$username', puntos = $puntos, img_perfil = '$img', 
                        tipo = '$tipo' WHERE Username LIKE '$usuario'";
                    $result=$this->bbdd->query($sql);
                    if ($result){//Si se encuentra y modifica el usuario
                        $resultado="OK";
                    }
                }else{
                    throw new Exception("No se ha conectado con la base de datos");
                }
            }catch(Exception $e){
                $this->bbdd = null;
                throw new Exception("Error de conexión:".$e->getMessage());
            }return $resultado;
        }

        /**
         * Destructor de la base de datos que cierra la conexion
         */
        function __destruct()
        {
            $this->bbdd->close();
            $this->bbdd=null;
        }
    }