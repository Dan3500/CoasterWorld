import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Router } from '@angular/router';
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
