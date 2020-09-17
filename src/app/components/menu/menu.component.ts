import { Component, OnInit } from '@angular/core';
import { LoginRegisterComponent } from 'src/app/components/login-register/login-register.component';
import { Router } from '@angular/router';

import { Usuario } from 'src/usuario';

import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(private router: Router, private Auth: AuthService) { }
  /**
   * Usuario que esta actualmente conectado en la página. Por defecto no habrá usuario, por lo que sus datos
   * serán nulos
   */
  usuarioConectado=new Usuario(null,null,null,null,null,null);

  /**
   * Metodo irALogs: Dirige al usuario a la página para iniciar sesión y registrarse en la página
   */
  irALogs(){
    this.router.navigate(['./logs']);
  }

  /**
   * Metodo irASolicitud: Dirige al usuario a la página para enviar una nueva solicitud
   */
  irASolicitud(){
    this.router.navigate(['./solicitud']);
  }

  /**
   * Metodo irAAdmin: Dirige al usuario a la página para gestionar los usuarios (Solo podrán acceder los administradores)
   */
  irAAdmin(){
    this.router.navigate(['./admin']);
  }

  /**
   * Metodo logOut: Desconecta al usuario de la sesión y establece a null los datos
   */
  logOut(){
    //Hace una llamada al servicio de desconexion
    this.Auth.logOut(this.usuarioConectado.username).subscribe(data=>{
      if(data["result"]=="OK"){//Si la desconexión es correcta, se establecerá el usuario como nulo en la sesión del navegador
        this.usuarioConectado.username=data["user"];
        this.usuarioConectado.email=data["email"];
        this.usuarioConectado.fechaAlta=data["fechaAlta"];
        this.usuarioConectado.points=data["points"];
        this.usuarioConectado.userImg=data["userImg"];
        this.usuarioConectado.tipo=data["type"];
        sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
        this.router.navigate(["./home"]);
      }
    })
  }

  /**
   * Metodo que se llevará a cabo cuando se inicie la página
   * Comprobará si existe un usuario almacenado en la sesión del navegador para mostrar o no la página
   */
  ngOnInit(): void {
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario guardado en la sesion del navegador
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
  }
    
}
