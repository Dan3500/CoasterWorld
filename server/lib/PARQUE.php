<?php
    class PARQUE{
        private $nombre;
        private $localizacion;
        private $aforo;
        private $fechaConstruccion;
        private $logo;
        private $imgParque;

        /**
         * Constructor del parque
         */
        function __construct($nombre=null,$localizacion=null,$aforo=null,
                             $fechaConstruccion=null,$logo=null,$imgParque=null)
        {
            $this->nombre=$nombre;
            $this->localizacion=$localizacion;
            $this->aforo=$aforo;
            $this->fechaConstruccion=$fechaConstruccion;
            $this->logo=$logo;
            $this->imgParque=$imgParque;
        }

        /**
         * Metodo para guardar los datos del objeto en una variable que se devolverá al cliente
         * @param response: Variable en la que se guardarán los datos del parque y se enviará 
         * al cliente
         * @return return: Se devolverá la variable en la que se ha guardado la información del parque
         */
        function guardarParque($response){
            $response->nombre=$this->nombre;
            $response->aforo=$this->aforo;
            $response->localizacion=$this->localizacion;
            $response->fechaConstruccion=$this->fechaConstruccion;
            $response->logo=$this->logo;
            $response->imgMapa=$this->imgParque;
            return $response;
        }
        
    }