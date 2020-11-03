import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import Swal  from 'sweetalert2';

import { Usuario } from 'src/usuario';

import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute, private Auth: AuthService, private servicioDatos: DataService) { }

  //Datos del usuario que está conectado. Si no esta conectado, sus datos serán nulos
  usuarioConectado=new Usuario(null,null,null,null,null,null);

  regExp=/^[^><]+$/;//Expresion regular para 

  errorRegExp=false;//Variable que indicará si ha habido un error a la hora de escribir un nuevo comentario

  sinComentarios:boolean;//Variable para indicar si la página no tiene comentarios

  //Objeto que contiene todas los comentarios con su informacion
  infoComentarios={
    comentarios:Array()
  }

  /**
   * Metodo para publicar un nuevo comentario escrito por un usuario
   * @param event: Evento que se activa al pulsar el botón de publicar y permite recoger el texto
   */
  publicarComentario(event){
    const target=event.target;
    const comentario=target.querySelector('#comentario').value;//Se recoge el texto
    if (this.regExp.test(comentario)){//Si el texto cumple los requisitos 
      this.rutaActiva.params.subscribe(params=>{//Se obtiene el nombre de la página en la que se publicara el comentario
        //Se llamara al servicio para insertar en la BD el comentario, la página donde se publicara y el email del usuario
        this.servicioDatos.publicarComentario(comentario,params["nombre"],this.usuarioConectado.email).subscribe(data=>{
          //Si la publicacion del comentario es correcta
          if (data['result']=="OK"){
            /*Si los puntos del usuario conectado superan los 750 y el usuario es de tipo usuario,
            * se modificara el valor del tipo de la sesión
            */ 
            if (data['puntos']>=750&&this.usuarioConectado.tipo=="usuario"){
              this.usuarioConectado.tipo="moderador";
              sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
            }
            //Se mostrará un mensaje emergente informando al usuario de que la publicación fue exitosa
            Swal.fire({
              title: 'Se ha publicado correctamente tu comentario',
              text: "Refresca la página para verlo",
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Refrescar página'
            }).then((result) => {
              if (result.value) {
                location.reload();//Si se pulsa el botón, se recargará la página
              }
            })
          }else{//Si hay algún fallo a la hora de publicar el comentario
            //Se mostrará un mensaje emergente informando al usuario de que la publicación fue erronea
            Swal.fire({
              title: 'Ha habido un error al publicar tu comentario',
              text: "No se ha podido añadir tu comentario",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Volver'
            })
          }
        })
      })
    }else{//Si no coincide, se creará un error de incumplimiento de requisitos
      this.errorRegExp=true;
    }
  }

 /**
   * Metodo para publicar un nuevo comentario escrito por un usuario
   * @param comentario: Array que contiene la informacion del comentario que se quiere eliminar
   */
  eliminarComentario(comentario){
    let usuarioCom=comentario.Usuario;
    let textoCom=comentario.Comentario;
    this.rutaActiva.params.subscribe(params=>{//Se obtiene el nombre de la página en la que se publicara el comentario
      Swal.fire({//Aparece una ventana emergente para confirmar que se quiere eliminar el comentario
        title: '¿Seguro que quieres eliminar este comentario?',
        text: "No se podrá revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar comentario',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {//Si se decide eliminar el comentario
           //Se llamara al servicio para eliminar el comentario de la BD el comentario, la página donde se publico y el nombre del usuario
          this.servicioDatos.eliminarComentario(usuarioCom,textoCom,params["nombre"]).subscribe(data=>{
            if(data["result"]){//Si se elimina correctamente el comentario de la base de datos
                //Se mostrará un mensaje emergente informando al usuario de que el comentario ha sido eliminado
                Swal.fire({
                  title: 'Se ha eliminado correctamente tu comentario',
                  text: "Refresca la página para actualizar los datos",
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Refrescar página'
                }).then((result) => {
                  if (result.value) {
                    location.reload();//Si se pulsa el botón, se recargará la página
                  }
                })
            }else{//Si ocurre un error
              //Se mostrará un mensaje emergente informando al usuario de un error al eliminar el comentario
              Swal.fire({
                title: 'Ha habido un error al eliminar tu comentario',
                text: "No se ha podido eliminar tu comentario",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver'
              })
            }
          })
        }
      })
     
     
     
    })
  }
  /**
   * Metodo para eliminar el error a la hora de escribir un comentario
   * Se activara cuando se haga click en el textarea
   */
  ocultarError(){
    this.errorRegExp=false;
  }

  /**
   * Metodo que se llevará a cabo a cuando se inicie la página
   */
  ngOnInit(): void {
    this.sinComentarios=false;
    this.infoComentarios.comentarios=null;
    //Se comprobará si hay un usuario conectado
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario conectado, se guardarán los datos en la variable
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
    this.rutaActiva.params.subscribe(params=>{//Se obtendrá el nombre de la página que se está visitando
      //Se llamará al servicio que obtendrá todos los comentarios de la página que se esta visitando
      this.servicioDatos.obtenerComentarios(params['nombre']).subscribe(data=>{
        if (data['result']=="OK"){//Si se obtienen comentarios, se almacenarán los datos de los comentarios en una variable para imprimirlos despues
          this.infoComentarios.comentarios=data["comentarios"];
          this.sinComentarios=false;
        }else{//Si no se obtienen comentarios, la página no tendrá comentarios
          this.infoComentarios.comentarios=null;
          this.sinComentarios=true;
        }
      })
    })
  }

}
