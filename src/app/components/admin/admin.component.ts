import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import * as $ from 'jquery';

import { Usuario } from 'src/usuario';

import { DataService } from 'src/app/services/data.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private servicioDatos: DataService) { }

  //Usuario que esta conectado y va a acceder a la pagina de admin
  usuarioConectado= new Usuario(null,null,null,null,null,null);

  usuarios;//Array donde se van a guardar todos los datos de todos los usuarios

  //Informacion del usuario que se va a modificar. Esta informacion se imprimira en el cuadro de modificacion del usuario
  usuarioMod={
    nombre:null,
    puntos:null,
    img:null,
    tipo:null
  }

  //Informacion de la imagen que se sube para modificar la imagen de un usuario
  imgMod={
    nombreArchivo: null, //Nombre de la imagen
    base64textString: null //Archivo en formato base64
  }

  filaSeleccionada;//Int que indica la fila del usuario que se va a modificar

   /**
   * Método para navegar a la página principal cuando se pulsa el botón de volver al inicio
   */
  irAPrincipal(){
    this.router.navigate(['./home']);
  }

  /**
   * Funcion para eliminar el usuario del que se ha pulsado el boton
   * @param usuario: Nombre del usuario que se va a eliminar
   */
  eliminar(usuario){
    Swal.fire({
      title: '¿Estas seguro de eliminar al usuario "'+usuario+'"?',
      text: "Se eliminaran todos sus datos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar usuario',
      cancelButtonText: 'Cancelar'
    }).then((result) => {//Si se pulsa el boton para confirmar la eliminacion del usuario
      if (result.value) {
        this.servicioDatos.eliminarUsuario(usuario).subscribe(data=>{
          if (data["result"]=="OK"){//Si se elimina el usuario
            Swal.fire({
              title: 'Usuario eliminado',
              text: 'Todos los datos del usuario "'+usuario+'" se han eliminado',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Continuar'
            }).then((result) => {
              if (result.value) {
                location.reload();//Si se pulsa el botón, se recargará la página
              }
            })
          }else{//Si no se consigue eliminar el usuario
            Swal.fire(
              'Error',
              'Ha habido un error a la hora de eliminar el usuario',
              'error'
            )
          }
        })
      }
    })
  }

  /**
   * Funcion para mostrar el cuadro de modificacion del usuario que se va a modificar y modificar los estilos de la tabla
   * Cada vez que se pulse el boton de modificar usuario, se activara este metodo
   * @param usuario: Nombre del usuario que se va a modificar
   * @param puntos: Puntos del usuario que se va a modificar
   * @param img: Ruta de la imagen de perfil del usuario que se va a modificar
   * @param tipo: Tipo del usuario que se va a modificar
   * @param i: Numero de la fila de la tabla que pertenece al usuario que se va a modificar 
   */
  mostrarMod(usuario,puntos,img,tipo,i){
    //Se establecen los valores de las filas
    let filaSeleccionadaAnterior=".fila"+this.filaSeleccionada;//Numero de la fila seleccionada anterior
    this.filaSeleccionada=i;
    let fila=".fila"+this.filaSeleccionada;//Se establece el nombre de la fila seleccionada actual

    let cambiar;
    //Si se cumplen algunos de estos casos, se cambiaran las propiedades css de la fila
    if (this.usuarioMod.nombre==null){
      cambiar=true;
    }else if(this.usuarioMod.nombre==usuario){
      cambiar=true;
    }

    //Se obtienen los datos del usuario para ser imprimidos en el formulario de modificacion
    this.usuarioMod.nombre=usuario;
    this.usuarioMod.puntos=puntos;
    this.usuarioMod.img=img;
    this.usuarioMod.tipo=tipo;

    //So se deben cambiar las propiedades css
    if (cambiar){
      //JQuery para cambiar los estilos de las filas de la tabla
      $(document).ready(function(){
        $('.formMod').toggleClass('is-active');//Se cambia la clase del formulario donde se va a modificar el usuario
        //Cambios de las filas de la tabla
        //Segun el color que tengan las filas seleccionadas, se tomará una opción distinta
        if ($(fila).css("background-color")=="rgba(0, 0, 0, 0)"){
          $(fila).css("background-color", "rgba(255, 255, 255, 0.4)");
        }else if ($(fila).css("background-color")=="rgb(52, 58, 64)"){
          $(fila).css("background-color", "rgba(255, 255, 255, 0.4)");
        }else{
          $(fila).css("background-color", "rgb(52, 58, 64)");
        }
      });
    }else{//Si no se debe cambiar nada, se deseleccionara la antigua fila seleccionada y se seleccionara la nueva
      $(filaSeleccionadaAnterior).css("background-color", "rgb(52, 58, 64)");
      $(fila).css("background-color", "rgba(255, 255, 255, 0.4)");
    }
  }

  /**
   * Metodo para cancelar la modificacion de un usuario y establecer las propieades css por defecto
   */
  cancelarMod(){
    let fila=".fila"+this.filaSeleccionada;//Se obtiene la fila en la que se ha cancelado la modificacion
    //JQuery para establecer el color por defecto de la fila seleccionada
    $(document).ready(function(){
      $('.formMod').toggleClass('is-active');
      $(fila).css("background-color", "rgb(52, 58, 64)");
    });
    //Se borra la informacion del usuario que se iba a modificar 
    this.usuarioMod.nombre=null;
    this.usuarioMod.puntos=null;
    this.usuarioMod.img=null;
    this.usuarioMod.tipo=null;
  }


  /**
   * Metodo para modificar el usuario seleccionado. Comenzará cuando se pulse el boton de modificar en el cuadro de modificacion de usuario
   * @param event: Evento que se crea al pulsar el boton de modificacion
   */
  modificarUser(event){
    //Se obtienen los valores del formulario de modificacion de usuarios
    const target=event.target;
    const username=target.querySelector('#usernameMod').value;
    const puntos=target.querySelector('#puntosMod').value;
    const tipo=target.querySelector('#tipoMod').value;

    //Se tomara el valor de la etiqueta del formulario para subir archivos
    let img=target.querySelector('#imgMod').value;
    if (img==""){//Si no se ha subido ningun archivo nuevo, se tomará la imagen actual que tiene el usuario
       this.imgMod.nombreArchivo=this.usuarioMod.img;
       this.imgMod.base64textString=null;
    }
    if (this.imgMod.base64textString){//Si se ha subido una nueva imagen
      //Se llamara al servicio para guardar la nueva imagen en el servidor
      this.servicioDatos.subirNuevaImagen(this.imgMod).subscribe(datos => {
        if (datos["result"]=="OK"){//Si el resultado es positivo
          this.imgMod.nombreArchivo=datos["ruta"];
          img=this.imgMod.nombreArchivo;//Se obtendra la ruta del archivo como imagen
          this.servicioDatos.modificarUser(username,puntos,tipo,img,this.usuarioMod.nombre).subscribe(datos => {//Se llama al servicio para modificar el usuario
            if (datos["result"]=="OK"){//Si se modifica correctamente el usuario, le saltara al usuario un mensaje de informacion
              //Si el usuario que se va a modificar es el mismo que esta conectado, se modificaran los datos del usuario de la sesion
              if (this.usuarioConectado.username==this.usuarioMod.nombre){
                this.usuarioConectado.username=username;
                this.usuarioConectado.points=puntos;
                this.usuarioConectado.tipo=tipo;
                this.usuarioConectado.userImg=img;
                sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
              }
              Swal.fire({
                title: 'Se ha modificado correctamente al usuario '+this.usuarioMod.nombre,
                text: "Refresca la página actualizar los cambios",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Refrescar página'
              }).then((result) => {
                if (result.value) {
                  location.reload();//Si se pulsa el botón, se recargará la página
                }
              })
            }else{//Si hay algun error al modificar el usuario, saltara un mensaje de error
              Swal.fire({
                title: 'Ha habido un error al modificar el usuario',
                text: "No se ha podido modificar el usuario",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver'
              })
            }
          });
        }else{//Si hay algun error al subir la nueva imagen al servidor, saltara un mensaje de error
          Swal.fire({
            title: 'Ha habido un error al subir la imagen al servidor',
            text: "No se ha podido añadir la nueva imagen",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Volver'
          })
        }
      });
    }else{//Si no se ha subido ninguna nueva imagen, se modificara directamente el usuario
      img=this.imgMod.nombreArchivo;
      //Se llama al servicio para modificar un usuario
      this.servicioDatos.modificarUser(username,puntos,tipo,img,this.usuarioMod.nombre).subscribe(datos => {
        if (datos["result"]=="OK"){//Si se modifica el usuario correctamente, le saltará un mensaje al usuario
          //Si el usuario que se va a modificar es el mismo que esta conectado, se modificaran los datos del usuario de la sesion
          if (this.usuarioConectado.username==this.usuarioMod.nombre){
            this.usuarioConectado.username=username;
            this.usuarioConectado.points=puntos;
            this.usuarioConectado.tipo=tipo;
            sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
          }
          Swal.fire({
            title: 'Se ha modificado correctamente al usuario '+this.usuarioMod.nombre,
            text: "Refresca la página actualizar los cambios",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Refrescar página'
          }).then((result) => {
            if (result.value) {
              location.reload();//Si se pulsa el botón, se recargará la página
            }
          })
        }else{//Si hay algun error a la hora de modificar el usuario, saltara un mensaje de error
          Swal.fire({
            title: 'Ha habido un error al modificar el usuario',
            text: "No se ha podido modificar el usuario",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Volver'
          })
        }
      });
    }
    
  }
  
  /**
   * Metodo que se activará cuando se suba un nuevo archivo de imagen
   * @param event: Evento que se crea al subir una nueva imagen
   */
  selectFile(event){
    //Se obtendrá el archivo del formulario
    let files=event.target.files;
    let file=files[0];

    if(files && file) {//Si se ha obtenido un archivo del formulario, se recogera su informacion
      this.imgMod.nombreArchivo = file.name;
      var reader = new FileReader();//Se creara un objeto para leer la informacion del archivo
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  //Metodo para tratar el archivo de imagen y convertiro en base64
  _handleReaderLoaded(readerEvent) {
    var binaryString = readerEvent.target.result;
    this.imgMod.base64textString = btoa(binaryString);
  }
    
  
  /**
   * Funcion que se llevara a cabo cuando se inicie la pagina. Se obtendrá toda la informacion de todos los usuarios registrados en la BD
   */
  ngOnInit(): void {
    //Animación para dirigirse automaticamente al inicio de la página
    $(document).ready(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }); 
    });
    //Si hay un usuario guardado en la sesion del navegador
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
    this.servicioDatos.obtenerInfoTodosUsuarios().subscribe(data=>{//Se obtiene la informacion de todos los usuarios
      this.usuarios=data["usuarios"];
    })
  }

}
