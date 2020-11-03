import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import * as $ from 'jquery';

import { Usuario } from 'src/usuario';

import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  //---------------------------------------------------------------DEFINICION DE CLASES Y VARIABLES------------------------------------------------------------
  constructor(private router: Router, private Auth:AuthService) { }

  //Objeto para guardar los datos del usuario que va a iniciar sesión
  usuarioConectado= new Usuario(null,null,null,null,null,null);

  regExpLogin=/^[^><]+$/;//Expresion regular para los campos del LOGIN

  //Expresiones regulares para los campos del REGISTER
  regExpUsername=/^[a-zA-Z0-9_-]{3,16}$/;//Nombre de usuario
  regExpPass=/^[a-zA-Z0-9_-]{5,16}$/;//Contraseñas
  regExpEmail=/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;//Correo electronico

  //----------------------------------------------------------------CLASES DEGESTION DE ERRORES----------------------------------------------------------------
  //Objeto para gestionar los errores del inicio de sesión
  login={
    error:false,
    errorConfEmail:false,
    errorExp:false
  }
  //Objeto para gestionar los errores del registro de usuario
  register={
    errorPassCoin:false,
    errorPassRegExp:false,
    errorNombre:false,
    errorEmail:false,
    errorNombreRegistrado:false,
    errorEmailRegistrado:false,
    fatalError:false
  }

  //--------------------------------------------------------------GESTION DE ACCIONES DEL USUARIO--------------------------------------------------------------
  
  //LOGIN
  usuarioLogin={
    username:null,
    password:null
  }

  //REGISTER
  usuarioReg={
    username:null,
    password:null,
    email:null
  }

  //---------------------------------------------------------------METODOS INICIO DE SESION--------------------------------------------------------------------

  /**
   * Método para comprobar los credenciales del usuario e iniciar sesión en la página
   * @param event: Evento que se activa al pulsar el botón del formulario y permite recoger los credenciales
   */
  loginUser(event){
    //Se recogen los datos del formulario de inicio de sesión
    const target=event.target;
    const username=target.querySelector('#username').value;
    const password=target.querySelector('#password').value;
    if (this.regExpLogin.test(username)&&this.regExpLogin.test(password)){
      this.usuarioLogin.username=username;
      this.usuarioLogin.password=password;
    //Se llama al servicio de iniciar sesión
      this.Auth.iniciarSesion(this.usuarioLogin).subscribe(data=>{
        if(data["result"]=="OK"){//Si el resultado de la llamada es correcto, se iniciará sesión
          //Se construirá el usuario que haya iniciado sesión con los datos recogidos del servidor 
          this.usuarioConectado.username=data["user"];
          this.usuarioConectado.email=data["email"];
          this.usuarioConectado.fechaAlta=data["fechaAlta"];
          this.usuarioConectado.points=data["points"];
          this.usuarioConectado.userImg=data["userImg"];
          this.usuarioConectado.tipo=data["tipo"];
          //Se guardarán los datos del usuario en la sesión del cliente
          sessionStorage.setItem("usuarioConectado",JSON.stringify(this.usuarioConectado));
          this.router.navigate(['./home']);//Se redigirá al usuario a la página principal
        }else{//Si no, se mostrará un mensaje de error al usuario
         this.login.error=true;
        }
      })
    }else{
      this.login.errorExp=true;
      if (!this.regExpLogin.test(username)){//Si el nombre de usuario no cumple los requisitos
        document.getElementById("username").style.borderColor="red";
      }
      if(!this.regExpLogin.test(password)){//Si la contraseña del usuario no cumple los requisitos
        document.getElementById("password").style.borderColor="red";
      }
    }
  }

  /**
   * Método para ocultar el mensaje de error del login cuando se hace click sobre un elemento
   * del formulario de login
   */
  ocultarMsgLogError(){   
    document.getElementById("username").style.borderColor="grey";
    document.getElementById("password").style.borderColor="grey";
    this.login.error=false;
    this.login.errorExp=false;
  }

  //---------------------------------------------------------------METODOS REGISTRO---------------------------------------------------------------------------

  /**
   * Método para añadir un nuevo usuario a la base de datos de la página
   * @param event Evento que se activa al pulsar el botón del formulario y permite recoger los credenciales
   */
  registerUser(event){
    const target=event.target;
    const username=target.querySelector('#usernameR').value;
    const password=target.querySelector('#passwordR').value;
    const password2=target.querySelector('#password2R').value;
    const email=target.querySelector('#email').value;
    if (this.regExpUsername.test(username)){//Se comprueba que el nombre de usuario cumpla los requisitos
      if (this.regExpPass.test(password)){//Se comprueba que la contraseña del usuario cumpla los requisitos
        if (this.regExpPass.test(password2)){//Se comprueba que la contraseña a confirmar cumpla los requisitos
          if (this.regExpEmail.test(email)){//Se comprueba que el email de usuario cumpla los requisitos
            if (password==password2){//Si coinciden las contraseñas, se llamará al servicio de registro
              //Se crea el usuario a registrar y se envía al server para insertarlo en la base de datos
              this.usuarioReg.username=username;
              this.usuarioReg.password=password;
              this.usuarioReg.email=email;
              this.Auth.registrarUsuario(this.usuarioReg).subscribe(data=>{
                switch(data["result"]){
                  case "OK"://Si se inserta correctamente
                    Swal.fire({
                      title: 'Te has registrado correctamente',
                      text: "Inicia sesión para entrar como usuario",
                      icon: 'success',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Confirmar'
                    }).then((result) => {
                      if (result.value) {
                        location.reload();//Si se pulsa el botón, se recargará la página
                      }
                    })
                  break;
                  case "FAILED"://Si hay un error a la hora de insertar el user en la BD
                    this.register.fatalError=true;
                  break;
                  case "INVALID USERNAME"://Si el usuario ya esta registrado
                    this.register.errorNombreRegistrado=true;
                    document.getElementById("usernameR").style.borderColor="red";
                  break;
                  case "INVALID EMAIL"://Si el email ya esta registrado
                    this.register.errorEmailRegistrado=true;
                    document.getElementById("email").style.borderColor="red";
                  break;
                }
              })
            }else{//Si no coinciden las contraseñas, se mostrará un mensaje de error al usuario
              this.register.errorPassCoin=true;
              document.getElementById("passwordR").style.borderColor="red";
              document.getElementById("password2R").style.borderColor="red";
            }
          }else{//Si el email no cumple con los requisitos
            this.register.errorEmail=true;
            document.getElementById("email").style.borderColor="red";
          }
        }else{//Si la contraseña a confirmar no cumple con los requisitos
          this.register.errorPassRegExp=true;
          document.getElementById("passwordR").style.borderColor="red";
          document.getElementById("password2R").style.borderColor="red";
        }
      }else{//Si la contraseña del usuario no cumple con los requisitos
        this.register.errorPassRegExp=true;
        document.getElementById("passwordR").style.borderColor="red";
        document.getElementById("password2R").style.borderColor="red";
      }
    }else{//Si el nombre de usuario no cumple los requisitos
      this.register.errorNombre=true;
      document.getElementById("usernameR").style.borderColor="red";
    }
  }

  /**
   * Método para ocultar el mensaje de error del registro cuando se hace click sobre un elemento
   * del formulario de registro
   */
  ocultarMsgRegError(){
    //Se establecen los colores rojos a los colores normales de los campos
    document.getElementById("usernameR").style.borderColor="grey";
    document.getElementById("passwordR").style.borderColor="grey";
    document.getElementById("password2R").style.borderColor="grey";
    document.getElementById("email").style.borderColor="grey";
    //Se cancelan todos los errores
    this.register.errorPassCoin=false;
    this.register.errorPassRegExp=false;
    this.register.errorEmail=false;
    this.register.errorNombre=false;
    this.register.errorNombreRegistrado=false;
    this.register.errorEmailRegistrado=false;
    this.register.fatalError=false;
  }

  //---------------------------------------------------------------OTROS METODOS----------------------------------------------------------------------------

  /**
   * Método para navegar a la página principal cuando se pulsa el botón de volver al inicio
   */
  irAPrincipal(){
    this.router.navigate(['./home']);
  }

  /**
   * Método al iniciar o recargar la página.
   * Se comprobará si hay algún usuario conectado con alguna sesión para mostrar o no la página de los
   * formularios de login o register
   */
  ngOnInit(): void {
    //Animación para dirigirse automaticamente al inicio de la página
    $(document).ready(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }); 
    });
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario guardado en la sesion del navegador
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
  }
}
