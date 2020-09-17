<?php
    class ATRACCION{
        private $nombre;
        private $parque;
        private $zona;
        private $categoria;
        private $fabricante;
        private $altura;
        private $velocidad;
        private $longitud;
        private $inversiones;
        private $videoOnride;

        /**
         * Constructor de la atraccion
         */
        function __construct($nombre=null,$parque=null,$zona=null,
                             $numCategoria=null,$fabricante=null,$altura=null,
                             $longitud=null,$inversiones=null,$velocidad=null,
                             $videoOnride=null)
        {
            $this->nombre=$nombre;
            $this->parque=$parque;
            $this->zona=$zona;
            $bbdd=new BBDD();
                //Se obtendrá el nombre de la categoría a partir del id que tenga
                $categoria=$bbdd->obtenerCategoria($numCategoria);
            unset($bbdd);
            $this->categoria=$categoria;
            $this->fabricante=$fabricante;
            $this->altura=$altura;
            $this->velocidad=$velocidad;
            $this->longitud=$longitud;
            $this->inversiones=$inversiones;
            $this->videoOnride=$videoOnride;
        }

        /**
         * Metodo para guardar los datos del objeto en una variable que se devolverá al cliente
         * @param response: Variable en la que se guardarán los datos de la atraccion y se enviará 
         * al cliente
         * @return return: Se devolverá la variable en la que se ha guardado la información de la atraccion
         */
        function guardarAtraccion($response){
            $response->nombre=$this->nombre;
            $response->zona=$this->zona;
            $response->parque=$this->parque;
            $response->categoria=$this->categoria;
            $response->fabricante=$this->fabricante;
            $response->altura=$this->altura;
            $response->velocidad=$this->velocidad;
            $response->longitud=$this->longitud;
            $response->inversiones=$this->inversiones;
            $response->videoOnride=$this->videoOnride;
            return $response;
        }
        
    }