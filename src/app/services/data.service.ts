import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  URL=environment.baseURL;//URL del servidor

  //---------------------------------------------------------SERVICIOS DE LECTURA DE DATOS DE LAS PAGINAS-----------------------------------------------------------------

  /**
   * Servicio que conectara con el servidor para obtener la informacion de un parque
   * @param nombreParque: Nombre del parque del que se va a obtener la informacion
   * @return: Toda la informacion del parque que se mostrará en la pagina
   */
  leerInfoParque(nombreParque){
    return this.http.post(`${this.URL}/index.php?accion=infoParque`,{nombreParque});
  }

  /**
   * Servicio que conectara con el servidor para obtener la informacion de una atraccion
   * @param nombreParque: Nombre de la atraccion de la que se va a obtener la informacion
   * @return: Toda la informacion de la atraccion que se mostrará en la pagina
   */
  leerInfoAtraccion(nombreAtraccion){
    return this.http.post(`${this.URL}/index.php?accion=infoAtraccion`,{nombreAtraccion});
  }

  //--------------------------------------------------------SERVICIOS DE COMENTARIOS------------------------------------------------------------
  /**
   * Servicio que conectara con el servidor para obtener los comentarios que haya en una página
   * @param nombrePagina: Nombre de la página de donde se quieren obtener los comentarios
   * @return: La lista de comentarios que se mostrará en la pagina
   */
  obtenerComentarios(nombrePagina){
    return this.http.post(`${this.URL}/index.php?accion=comentariosPagina`,{nombrePagina});
  }

  /**
   * Servicio que conectara con el servidor para insertar un comentario en una página especifica habiendo iniciado sesion como un usuario
   * @param comentario: Mensaje que ha escrito el usuario y se va a publicar en la página 
   * @param pagina: Nombre de la página donde se va a mostrar el comentario
   * @param user: Usuario que ha escrito y publicado el comentario
   * @return: Resultado de la publicacion del comentario en la página
   */
  publicarComentario(comentario,pagina,user){
    return this.http.post(`${this.URL}/index.php?accion=publicarComentario`,{comentario,pagina,user});
  }

  eliminarComentario(usuario,comentario,pagina){
    return this.http.post(`${this.URL}/index.php?accion=eliminarComentario`,{usuario,comentario,pagina});
  }

  //--------------------------------------------------------SERVICIOS DE VALORACIONES------------------------------------------------------------
  /**
   * Servicio para insertar en la BD una valoracion de un parque o atraccion
   * @param valoracion: Cantidad de estrellas que el usuario ha hecho como valoracion
   * @param pagina: Nombre de la página que se ha valorado
   * @param user: Usuario que ha hecho la valoracion
   * @return: Devuelve el resultado de la operacion
   */
  valorar(valoracion,pagina,user){
    return this.http.post(`${this.URL}/index.php?accion=nuevaValoracion`,{valoracion,pagina,user});
  }

  /**
   * Servicio para obtener la media total de todas las valoraciones realizadas en una atraccion o parque
   * @param pagina: Nombre de la página que se ha valorado
   * @return: Media de todas las valoraciones de la página
   */
  obtenerMediaValoraciones(pagina){
    return this.http.post(`${this.URL}/index.php?accion=mediaValoraciones`,{pagina});
  }

  /**
   * Servicio para obtener la valoracion de una página en concreto hecha por el usuario que esta conectado en la página
   * @param pagina: Nombre de la página que se ha valorado
   * @param user: Usuario que ha hecho la valoracion
   * @return: Datos de la valoracion de un usuario en una página concreta
   */
  obtenerValoracionUser(user,pagina){
    return this.http.post(`${this.URL}/index.php?accion=valoracionUser`,{user,pagina});
  }

  //--------------------------------------------------------SERVICIOS DE PERFIL DE USUARIO------------------------------------------------------------

  /**
   * Servicio para obtener la informacion de un usuario buscado en la página
   * @param perfilUser: Nombre del usuario del que se quiere obtener la información. Se obtiene de la URL
   * @return: Toda la información del usuario que se ha buscado, además de todas sus valoraciones y comentarios. Si no se
   * ha encontrado el usuario buscado, no se devolverá nada.
   */
  obtenerInformacionUsuario(perfilUser){
    return this.http.post(`${this.URL}/index.php?accion=perfilUsuario`,{perfilUser});
  }

  /**
   * Servicio para modificar la informacion de un usuario registrado
   * @param username: Nuevo nombre de usuario que se introducira al usuario que se va a modificar
   * @param puntos: Nueva cantidad de puntos que se introducira al usuario que se va a modificar
   * @param tipo: Nuevo tipo de usuario que se introducira al usuario que se va a modificar
   * @param img: Nueva ruta de imagen de usuario que se introducira al usuario que se va a modificar
   * @param userMod: Nombre del usuario que se va a modificar
   * @return: Array que contiene el resultado de la llamada y la ruta de la imagen que se ha subido y guardado en el servidor
   */
  modificarUser(username,puntos,tipo,img,userMod){
    return this.http.post(`${this.URL}/index.php?accion=modificarUser`,{username,puntos,tipo,img,userMod});
  }
  //--------------------------------------------------------SERVICIOS DE ENVIO DE SOLICITUD------------------------------------------------------------
 /**
   * Servicio para enviar una solicitud (email) al correo de un administrador
   * @param emisor: Email del usuario que ha enviado la solicitud
   * @param asunto: Texto que indica el tema de la solicitud
   * @param mensaje: Texto de la solicitud
   * @return: Resultado del envio del mail (OK o FAILED)
   */
  enviarMail(emisor,asunto,mensaje){
    return this.http.post(`${this.URL}/index.php?accion=envioMail`,{emisor,asunto,mensaje});
  }

  //--------------------------------------------------------SERVICIOS DE GESTION DE USUARIOS------------------------------------------------------------
  /**
   * Servicio para recoger todos los usuarios registrados en la BD y su informacion
   * @return: Todos los usuarios y su informacion
   */
  obtenerInfoTodosUsuarios(){
    return this.http.post(`${this.URL}/index.php?accion=obtenerTodosUsuarios`,{});
  }

  /**
   * Servicio para enviar el nombre del usuario que se va a eliminar de la BD
   * @param usuario: Nombre que pertenece al usuario que se va a eliminar
   * @return:  Resultado de la llamada
   */
  eliminarUsuario(usuario){
    return this.http.post(`${this.URL}/index.php?accion=eliminarUsuario`,{usuario});
  }

  /**
   * Servicio para enviar la informacion de una imagen nueva que se va a guardar en el servidor
   * @param file: Archivo que ha subido el usuario
   * @return: Array que contiene el resultado de la llamada y la ruta de la imagen que se ha subido y guardado en el servidor
   */
  subirNuevaImagen(file){
    return this.http.post(`${this.URL}/index.php?accion=subirImagen`,{file},{headers:{'Content-Type':'Multipart/form-data'}});
  }
}
