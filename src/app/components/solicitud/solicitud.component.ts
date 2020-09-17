import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/usuario';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';

import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  constructor(private router: Router, private servicioDatos: DataService) { }

  usuarioConectado= new Usuario(null,null,null,null,null,null);//Usuario conectado actualmente en la pagina

  /**
   * Metodo para enviar una solicitud
   * @param event: Evento que se crea al pulsar el boton de enviar el formulario de la solicitud
   */
  enviarSolicitud(event){
    const target=event.target;
    const usuario=target.querySelector('#emisor').value;
    const asunto=target.querySelector('#asunto').value;
    const mensaje=target.querySelector('#mensaje').value;
    this.servicioDatos.enviarMail(usuario,asunto,mensaje).subscribe(data=>{//Llama al servicio para enviar el email de la solicitud
      //Si el envio del mail es correcto
      if (data['result']=="OK"){
        //Se mostrará un mensaje emergente informando al usuario de que el mail se ha enviado correctamente
        Swal.fire({
          title: 'Se ha enviado correctamente tu mensaje a un administrador',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Volver'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['./home']);//Si se pulsa el botón, se enviara al usuario al inicio
          }
        })
      }else{//Si hay algún fallo a la hora de enviar el mail
        //Se mostrará un mensaje emergente informando al usuario de que el envio fue erroneo
        Swal.fire({
          title: 'Ha habido un error al enviar tu email',
          text: "Inténtalo de nuevo más tarde",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Volver'
        })
      }
    })
  }

  /**
   * Método para navegar a la página principal cuando se pulsa el botón de volver al inicio
   */
  irAPrincipal(){
    this.router.navigate(['./home']);
  }

  ngOnInit(): void {
    if (JSON.parse(sessionStorage.getItem("usuarioConectado"))){//Si hay un usuario guardado en la sesion del navegador
      this.usuarioConectado=JSON.parse(sessionStorage.getItem("usuarioConectado"));
    }
  }

}
