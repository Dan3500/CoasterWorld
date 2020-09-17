import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { Usuario } from 'src/usuario';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private _config: NgbCarouselConfig) {
    //Datos para configurar los carruseles
    _config.interval=3500;
    _config.pauseOnHover=true;
    _config.wrap=true;
   }

  ngOnInit(): void {
  
  }

}
