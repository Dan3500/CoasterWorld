import { Component, OnInit } from '@angular/core';
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
