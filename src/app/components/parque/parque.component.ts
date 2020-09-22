import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { DataService } from 'src/app/services/data.service'
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parque',
  templateUrl: './parque.component.html',
  styleUrls: ['./parque.component.css']
})
export class ParqueComponent implements OnInit {

  /**
   * Objeto creado para guardar los datos provenientes del servidor pertenecientes a un parque
   */
  parqueMostrar={
    nombre:null,
    localizacion:null,
    aforo:null,
    fechaConstruccion:null,
    logo:null,
    imgMapa:null,
    zonas:Array(),
    atracciones:Array(),
    textos:Array(),
    textoZonas:Array()
  }

  /**
   * Se llaman a los objetos que se van a usar y construye la página del parque con la información de la BD
   * @param rutaActiva: Objeto para obtener el nombre del parque a través de la url
   * @param servicioDatos: Obtener el servicio que recogerá los datos del servidor
   * @param router: Objeto para poder redirigir al usuario a otra página
   */
  constructor(private rutaActiva: ActivatedRoute, private router: Router, private servicioDatos: DataService) { 
    //Animación para dirigirse automaticamente al inicio de la página
    $(document).ready(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }); 
    });
    //Se obtiene el nombre del parque a través de la url 
    this.rutaActiva.params.subscribe(params=>{
      //Se accede al servidor para obtener la información del parque buscado
      this.servicioDatos.leerInfoParque(params['nombre']).subscribe(data=>{
        if (data['result']=="OK"){
          //Si existe la página buscada, se guardarán los datos del servidor en el objeto creado para mostrarlos
          this.parqueMostrar.nombre=data['nombre'];
          this.parqueMostrar.localizacion=data['localizacion'];
          this.parqueMostrar.aforo=data['aforo'];
          this.parqueMostrar.fechaConstruccion=data['fechaConstruccion'];
          this.parqueMostrar.logo=data['logo'];
          this.parqueMostrar.imgMapa=data['imgMapa'];
          this.parqueMostrar.zonas=data['zonas'];
          this.parqueMostrar.atracciones=data['atracciones'];
          this.parqueMostrar.textos=data['textos'];
          this.parqueMostrar.textoZonas=data["textoZonas"];
        }else if(data['result']=="FAILED"){
          //Si no existe la página y no se ha saltado a la página de error, se enviará a la página principal
          this.parqueMostrar.nombre="error";
          this.router.navigate(["./home"]);
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
