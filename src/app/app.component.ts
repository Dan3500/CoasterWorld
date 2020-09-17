import { Component,OnInit } from '@angular/core';
import { LoginRegisterComponent } from 'src/app/components/login-register/login-register.component';

import { Usuario } from 'src/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  ngOnInit(): void {
    
  }
}
