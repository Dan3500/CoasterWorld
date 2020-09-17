import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que contiene todos los servicios de autenticación de usuarios (inicio de sesión, registro y cierre de sesión)
 */
export class AuthService {

  constructor(private http:HttpClient) { }

  URL=environment.baseURL;//URL del servidor

  /**
   * Llamada al servidor para iniciar sesión con los credenciales introducidos por el usuario
   * @param username: Credencial del usuario que indica el nombre de usuario
   * @param password: Credencial del usuario que indica la contraseña del usuario
   * @return: Devolverá la información del usuario que se usará en el cliente (nombre, email, imagen, tipo) si
   * el resultado de la llamada es OK
   */
  iniciarSesion(usuarioLogin){
    return this.http.post(`${this.URL}/index.php?accion=login`,JSON.stringify(usuarioLogin));
  }

  /**
   * Llamada al servidor para registrar un nuevo ususario
   * @param username 
   * @param password 
   * @param email: 
   * @return: Resultado de la llamada
   */
  registrarUsuario(usuarioReg){
    return this.http.post(`${this.URL}/index.php?accion=register`,JSON.stringify(usuarioReg));
  }

  /**
   * Llamada al servidor para cerrar la sesión del usuario actual conectado
   * @param username: Nombre de usuario del usuario conectado que va a cerrar sesión
   * @return: Devolverá el resultado de la operación y, si este es OK, se devolverán los datos del usuario nulos
   */
  logOut(username){
    return this.http.post(`${this.URL}/index.php?accion=logout`,{username})
  }
}
