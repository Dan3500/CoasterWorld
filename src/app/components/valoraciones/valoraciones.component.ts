import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import Swal  from 'sweetalert2';

import { Usuario } from 'src/usuario';

import { DataService } from 'src/app/services/data.service';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-valoraciones',
  templateUrl: './valoraciones.component.html',
  styleUrls: ['./valoraciones.component.css']
})
export class ValoracionesComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute, private servicioDatos:DataService) { }

  //Datos del usuario que esta conectado. Si no hay ningun usuario conectado, sus valores serán null
  usuarioConectado=new Usuario(null,null,null,null,null,null);

  sinValoraciones:boolean;//Atributo que indica si la pagina tiene valoraciones (mostrará un mensaje si no hay valoraciones)

  mediaPuntuacion:number;//Atributo que indica la media de estrellas que tiene una pagina

  errorValorar0:boolean;//Atributo que indica si se muestra o no el error al valorar una pagina
  
  estrellasPorUsuarios:String;//Atributo que indica la cantidad de estrellas que se mostrarán según la media de las valoraciones

  /*Atributo que indica si un usuario conectado ha valorado una página
  * Si los puntos del usuario conectado son 0, significa que no ha valorado la página y no se mostrará ningun mensaje
  */
  valoracionUsuario={
    puntos:0, //Indica los puntos de la valoracion 
    mostrar:false //Indica si se muestra el mensaje con la valoracion del usuario conectado
  }

  /**
   * Metodo que se llevará a cabo cuando se valore una atracción o un parque por un usuario conectado
   * @param form: Datos del formulario de valoracion. Indica las estrellas que el usuario le da al parque o atraccion (1-5)
   * Si el usuario no indica estrellas, saltará un mensaje de error
   */
  valorar(form: NgForm){
    const valoracion=form.value;
    if (valoracion.estrellas!=""){//Si se ha pulsado el botón con alguna estrella marcada
      this.rutaActiva.params.subscribe(params=>{//Se obtiene el nombre de la página que se va a valorar
        //Se llama al servicio que insertará o actualizara la valoracion 
        this.servicioDatos.valorar(valoracion.estrellas,params["nombre"],this.usuarioConectado.email).subscribe(data=>{
          switch(data["result"]){
            //ACCIONES EXITOSAS
            case "INSERTAR"://Si el usuario nunca ha valorado la página, habrá insertado una nueva valoracion en la BD
              /*Si al añadir una nueva valoracion, los puntos del usuario conectado superan los 750 y 
              * el usuario es de tipo usuario, se modificara el valor del tipo de la sesión
              */ 
              if (data['puntos']>=750&&this.usuarioConectado.tipo=="usuario"){
                this.usuarioConectado.tipo="moderador";
                sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
              }
              //Se mostrará un mensaje de exito al usuario
              Swal.fire({
                title: 'Se ha publicado tu valoración',
                text: "Refresca la página para verlo",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Refrescar página'
              }).then((result) => {
                if (result.value) {
                  location.reload();//Si se pulsa el botón, se recargará la página (obligatorio para continuar)
                }
              })
            break;
            case "ACTUALIZAR"://Si el usurio ya habia valorado la página, actualizará el registro insertado anteriormente en la BD
              //Se mostrará un mensaje de exito al usuario
              Swal.fire({
                title: 'Se ha actualizado tu valoración',
                text: "Refresca la página para verlo",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Refrescar página'
              }).then((result) => {
                if (result.value) {
                  location.reload();//Si se pulsa el botón, se recargará la página (obligatorio para continuar)
                }
              })
            break;
            //ACCIONES FALLIDAS
            case "FAILED INSERTAR"://Si falla al insertar la valoracion
            //Se mostrará un mensaje de error al usuario
              Swal.fire({
                title: 'Ha habido un error al guardar tu valoración',
                text: "Inténtalo de nuevo más tarde",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver'
              })
            break;
            case "FAILED ACTUALIZAR"://Si falla al actualizar la valoracion
              //Se mostrará un mensaje de error al usuario
              Swal.fire({
                title: 'Ha habido un error alactualizar tu valoración',
                text: "Inténtalo de nuevo más tarde",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver'
              })
            break;
          }
        })
      });
    }else{//Si no hay estrellas marcadas, se mostrará un error al usuario
      this.errorValorar0=true;
    }
  }

  /**
   * Metodo que ocultara el mensaje de error al valorar
   * Se llevara a cabo cuando el usuario marque una estrella de las 5 para valorar
   */
  ocultarErrorValorar0(){
    this.errorValorar0=false;
  }


  /**
   * Metodo que se llevará a cabo cuando se inice el componente de valoraciones
   * Comprobará si la página que se esta visitando tiene valoraciones hechas por usuarios. Si es asi, se guardarán en las variables
   * especificas los datos para ser mostradas
   */
  ngOnInit(): void {
    this.sinValoraciones=false;
    //Se comprobará si hay un usuario conectado
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario conectado, se guardarán los datos en la variable
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
    //Se obtendrá el nombre de la página que se está visitando
    this.rutaActiva.params.subscribe(params=>{
      //Se llamará al servicio que obtendrá la media de las valoraciones realizadas en la página que se esta visitando
      this.servicioDatos.obtenerMediaValoraciones(params['nombre']).subscribe(data=>{
        switch(data["media"]){
          case 0://Si la media es 0, indicara que la página no tiene valoraciones hechas por usuarios
            this.sinValoraciones=true;
          break;
          default:
            //Si la media es cualquier numero, se mostrará un mensaje con la media y el numero de estrellas según esa media
            this.mediaPuntuacion=data["media"];
            let mediaEntera=parseInt(data["media"]);
            switch(mediaEntera){
              case 0: this.estrellasPorUsuarios="";
              break;
              case 1: this.estrellasPorUsuarios="★";
              break;
              case 2: this.estrellasPorUsuarios="★★";
              break;
              case 3: this.estrellasPorUsuarios="★★★";
              break;
              case 4: this.estrellasPorUsuarios="★★★★";
              break;
              case 5: this.estrellasPorUsuarios="★★★★★";
              break;
            }
            this.sinValoraciones=false;
          break;
        }
        if (this.usuarioConectado.email){
          //Si hay un usuario conectado, se llamará a un servicio para comprobar si el usuario conectado ha valorado la página
          this.servicioDatos.obtenerValoracionUser(this.usuarioConectado.email,params['nombre']).subscribe(data2=>{
            this.valoracionUsuario.puntos=parseInt(data2["valoracion"]);//Se guardarán los puntos de la valoración del usuario conectado
            if(this.valoracionUsuario.puntos!=0){
              //Si no se obtiene 0, significa que el usuario conectado ha valorado la página y se mostrará su valoración por si quiere actualizarla
              this.valoracionUsuario.mostrar=true;
            }else{//Si se obtiene 0, significa que no ha valorado la página y no se mostrará ningun dato
              this.valoracionUsuario.mostrar=false;
            }
          })
        }
      })
    })
  }
}
