<?php
    class USER{
        private $user;
        private $pass;
        private $email;
        private $fechaAlta;
        private $points;
        private $userImg;
        private $type;

        /**
         * Constructor del usuario
         */
        function __construct($user=null,$pass=null,$email=null,
                             $fechaAlta=null,$points=null,$userImg=null,$type=null)
        {
            $this->user=$user;
            $this->pass=$pass;
            $this->email=$email;
            $this->fechaAlta=$fechaAlta;
            $this->points=$points;
            $this->userImg=$userImg;
            $this->type=$type;
        }

        /**
         * Metodo para guardar los datos del objeto en una variable que se devolverá al cliente para mostrarse en las páginas
         * @param response: Variable en la que se guardarán los datos del usuario y se enviará 
         * al cliente
         * @return return: Se devolverá la variable en la que se ha guardado la información del usuario
         */
        function guardarUsuario($response){
            $response->user=$this->getUsername();
                //Se pasa la fecha del formato ingles al formato español
                $fechaString=strtotime($this->getFechaAlta());
                $fecha=date('d/m/Y',$fechaString);
            $response->email=$this->getEmail();
            $response->fechaAlta=$fecha;
            $response->puntos=$this->getPoints();
            $response->userImg=$this->getUserImg();
            $response->tipo=$this->getType();
            return $response;
        }

        /**
         * Metodo para obtener los comentarios de un usuario especifico
         * @param response: Variable donde se almacenará la informacion que se reciba de las consultas y se enviara al cliente
         * @return response: Se devolvera la variable que se enviara al cliente con los comentarios del usuario
         */
        function obtenerComentarios($response){
            $usuario=$this->getEmail();
            //Se escriben las dos consultas, una para obtener los comentarios de parques y otra para los comentarios de atracciones
            $cParques="SELECT mensaje, pagina FROM comentarios c, parques p WHERE usuario LIKE '$usuario' AND c.pagina=p.nombre";
            $cAtracciones="SELECT mensaje, pagina FROM comentarios c, atracciones a WHERE usuario LIKE '$usuario' AND c.pagina=a.nombre";
            $bbdd=new BBDD();
                //Se hacen las dos consultas y se guardan en la variable que se devolvera al cliente
                $response->cParques=$bbdd->getComentariosValoracionesUser($cParques);
                $response->cAtracciones=$bbdd->getComentariosValoracionesUser($cAtracciones);
            unset($bbdd);
            return $response;
        }

        /**
         * Metodo para obtener las valoraciones de un usuario especifico
         * @param response: Variable donde se almacenará la informacion que se reciba de las consultas y se enviara al cliente
         * @return response: Se devolvera la variable que se enviara al cliente con las valoraciones del usuario
         */
        function obtenerValoraciones($response){
            $usuario=$this->getEmail();
            //Se escriben las dos consultas, una para obtener las valoraciones de parques y otra para las valoraciones de atracciones
            $vParques="SELECT valoracion, pagina FROM valoraciones v, parques p WHERE usuario LIKE '$usuario' AND v.pagina=p.nombre";
            $vAtracciones="SELECT valoracion, pagina FROM valoraciones v, atracciones a WHERE usuario LIKE '$usuario' AND v.pagina=a.nombre";
            $bbdd=new BBDD();
            //Se hacen las dos consultas y se guardan en la variable que se devolvera al cliente
                $response->vParques=$bbdd->getComentariosValoracionesUser($vParques);
                $response->vAtracciones=$bbdd->getComentariosValoracionesUser($vAtracciones);
            unset($bbdd);
            return $response;
        }
        

        //GETTERS
        function getUsername(){
            return $this->user;
        }

        function getPassword(){
            return $this->pass;
        }

        function getEmail(){
            return $this->email;
        }

        function getFechaAlta(){
            return $this->fechaAlta;
        }

        function getPoints(){
            return $this->points;
        }

        function getUserImg(){
            return $this->userImg;
        }

        function getType(){
            return $this->type;
        }

        //SETTERS
        function setUsername($user){
            $this->user=$user;
        }

        function setPassword($pass){
            $this->pass=$pass;
        }

        function setEmail($email){
            $this->email=$email;
        }

        function setFechaAlta($fechaAlta){
            $this->fechaAlta;
        }

        function setPoints($points){
            $this->points=$points;
        }

        function setUserImg($userImg){
            $this->userImg=$userImg;
        }

        function setType($type){
            $this->type=$type;
        }
    }