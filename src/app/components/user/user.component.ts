import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import * as $ from 'jquery';

import { Usuario } from 'src/usuario';

import { DataService } from 'src/app/services/data.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute, private servicioDatos: DataService, 
              private router: Router,) { }

  //Datos del usuario que esta actualmente conectado en la página
  usuarioConectado=new Usuario(null,null,null,null,null,null);

  usuarioVisitado:String; //Usuario del que se esta visitando el perfil

  //Variable que contendrá toda la información que se imprimirá en la página de perfil de usuario
  datosPerfilUsuario={
    username:null,
    tipo:null,
    email:null,
    fechaAlta:null,
    puntos:null,
    img:null,
    valParques:null,
    valAtracciones:null,
    comParques:null,
    comAtracciones:null
  }

  imgMod={
    nombreArchivo: null, //Nombre de la imagen
    base64textString: null //Archivo en formato base64
  }

  modificarFoto(event){
    //Se obtienen los valores del formulario de modificacion de usuarios
    const target=event.target;
    //Se tomara el valor de la etiqueta del formulario para subir archivos
    let img=target.querySelector('#imgMod').value;
    if (img==""){//Si no se ha subido ningun archivo nuevo, no se hara nada
      Swal.fire({
        title: 'Error al subir una imagen',
        text: "Selecciona una imagen primero",
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Volver'
      })
    }else{
      if (this.imgMod.base64textString){//Si se ha subido una nueva imagen
        //Se llamara al servicio para guardar la nueva imagen en el servidor
        this.servicioDatos.subirNuevaImagen(this.imgMod).subscribe(datos => {
          if (datos["result"]=="OK"){//Si el resultado es positivo
            this.imgMod.nombreArchivo=datos["ruta"];
            img=this.imgMod.nombreArchivo;//Se obtendra la ruta del archivo como imagen
            //Se llama al servicio para modificar el usuario
            this.servicioDatos.modificarUser(this.datosPerfilUsuario.username,this.datosPerfilUsuario.puntos,this.datosPerfilUsuario.tipo,
                                             img,this.datosPerfilUsuario.username).subscribe(datos => {
              if (datos["result"]=="OK"){
                //Si se modifica correctamente el usuario, se modificaran sus datos de la sesion y 
                //le saltara al usuario un mensaje de informacion
                this.usuarioConectado.userImg=img;
                sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
                Swal.fire({
                  title: 'Se ha modificado tu foto de perfil correctamente',
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
                  title: 'Ha habido un error al modificar tu imagen de perfil',
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
      }
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
   * Funcion que se llevara a cabo cuando se inicie la página de perfil de usuario
   */
  ngOnInit(): void {
    //Animación para dirigirse automaticamente al inicio de la página
    $(document).ready(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }); 
    });
    this.usuarioVisitado=null;
    //Se comprobará si hay un usuario conectado
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario conectado, se guardarán los datos en la variable
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
    this.rutaActiva.params.subscribe(params=>{//Se obtendrá el nombre de usuario del que se quiere mostrar el perfil desde la URL
      //Se llama al servicio que obtendrá la informacion que se mostrará en la página de perfil de usuario
      this.servicioDatos.obtenerInformacionUsuario(params["userName"]).subscribe(data=>{
        //Si se obtiene información correctamente, se almacenarán los datos para ser mostrados posteriormente
        if (data["result"]=="OK"){
          this.datosPerfilUsuario.username=data["user"];
          this.datosPerfilUsuario.email=data["email"];
          this.datosPerfilUsuario.fechaAlta=data["fechaAlta"];
          this.datosPerfilUsuario.img=data["userImg"];
          this.datosPerfilUsuario.tipo=data["tipo"];
          this.datosPerfilUsuario.puntos=data["puntos"];
          this.datosPerfilUsuario.comParques=data["cParques"];
          this.datosPerfilUsuario.comAtracciones=data["cAtracciones"];
          //Se cambian los numeros de las valoraciones de las atracciones por estrellas
          for (let i=0;i<data["vAtracciones"].length;i++){
            switch(data["vAtracciones"][i].valoracion){
              case "1": data["vAtracciones"][i].valoracion="★";
              break;
              case "2": data["vAtracciones"][i].valoracion="★★";
              break;
              case "3": data["vAtracciones"][i].valoracion="★★★";
              break;
              case "4": data["vAtracciones"][i].valoracion="★★★★";
              break;
              case "5": data["vAtracciones"][i].valoracion="★★★★★";
              break;
            }
          }
          this.datosPerfilUsuario.valAtracciones=data["vAtracciones"];
          //Se cambian los numeros de las valoraciones de los parques por estrellas
          for (let i=0;i<data["vParques"].length;i++){
            switch(data["vParques"][i].valoracion){
              case "1": data["vParques"][i].valoracion="★";
              break;
              case "2": data["vParques"][i].valoracion="★★";
              break;
              case "3": data["vParques"][i].valoracion="★★★";
              break;
              case "4": data["vParques"][i].valoracion="★★★★";
              break;
              case "5": data["vParques"][i].valoracion="★★★★★";
              break;
            }
          }
          this.datosPerfilUsuario.valParques=data["vParques"];
          this.usuarioVisitado=params["userName"];
        }else{
          this.usuarioVisitado="ERROR";
        }
      })
    })
  }

}
