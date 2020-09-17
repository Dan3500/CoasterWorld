import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //JQUERY del menu hamburguesa. Se activara cuando se haga click al boton hamburguesa
  accionBurger(){
    $(document).ready(function(){
        //Funcion JQuery que añade la funcionalidad del menú hamburguesa
        $('.hamburger').click(function() {
            //Se cambian las clases activas por otras clases CSS creadas para cuando el menú esté activado
            $('.hamburger').toggleClass('is-active');
            $('.menuppal').toggleClass('is-active');
        });
    });
  }
}
