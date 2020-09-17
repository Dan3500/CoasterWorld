import { ActivatedRoute, Data } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';

import { Usuario } from 'src/usuario';

import { DataService } from 'src/app/services/data.service'
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-atraccion',
  templateUrl: './atraccion.component.html',
  styleUrls: ['./atraccion.component.css']
})
export class AtraccionComponent implements OnInit {

  /**
   * Objeto creado para guardar los datos provenientes del servidor pertenecientes a una atracción
   */
  atraccionMostrar={
    nombre:null,
    parque:null,
    zona:null,
    categoria:null,
    fabricante:null,
    altura:null,
    velocidad:null,
    longitud:null,
    inversiones:null,
    videoOnride:null,
    textos:Array(),
    img:Array()
  }

  /**
   * Se llaman a los objetos que se van a usar y construye la página de cada atracción con la 
   * información de la BD
   * @param rutaActiva: Objeto para obtener el nombre del parque a través de la url
   * @param servicioDatos: Obtener el servicio que recogerá los datos del servidor
   * @param router: Objeto para poder redirigir al usuario a otra página
   * @param _config: Carrusel donde se encontrarán las imágenes de cada atracción
   */
  constructor(private rutaActiva: ActivatedRoute, private servicioDatos: DataService, 
              private router: Router, private _config: NgbCarouselConfig) { 
    //Se modifican los valores del carrusel
    _config.interval=3500;
    _config.pauseOnHover=true;
    _config.wrap=true;
    //Se obtiene el nombre de la atracción a través de la url 
    this.rutaActiva.params.subscribe(params=>{
      //Se accede al servidor para obtener la información de la atracción buscada
      this.servicioDatos.leerInfoAtraccion(params['nombre']).subscribe(data=>{
        if (data['result']=="OK"){
          //Si existe la página buscada, se guardarán los datos del servidor en el objeto creado para mostrarlos
          this.atraccionMostrar.nombre=data["nombre"];
          this.atraccionMostrar.parque=data["parque"];
          this.atraccionMostrar.zona=data["zona"];
          this.atraccionMostrar.categoria=data["categoria"];
          this.atraccionMostrar.fabricante=data["fabricante"];
          this.atraccionMostrar.altura=data["altura"];
          this.atraccionMostrar.velocidad=data["velocidad"];
          this.atraccionMostrar.longitud=data["longitud"];
          this.atraccionMostrar.inversiones=data["inversiones"];
          this.atraccionMostrar.videoOnride=data["videoOnride"];
          this.atraccionMostrar.textos=data["textosAtraccion"];
          this.atraccionMostrar.img=data["img"];
        }else if(data['result']=="FAILED"){
          //Si no existe la página y no se ha saltado a la página de error, se enviará a la página principal
          this.atraccionMostrar.nombre="error";
          this.router.navigate(["./home"]);
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
