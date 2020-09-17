//MODULOS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
//COMPONENTES
import { AppComponent } from './app.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { AtraccionComponent } from './components/atraccion/atraccion.component';
import { ParqueComponent } from './components/parque/parque.component';
import { AdminComponent } from './components/admin/admin.component';
//SERVICES
import { AuthService } from 'src/app/services/auth.service';
import { LoadingComponent } from './components/loading/loading.component';
import { YoutubePipe } from './youtube.pipe';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { ValoracionesComponent } from './components/valoraciones/valoraciones.component';
import { UserComponent } from './components/user/user.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    FooterComponent,
    PrincipalComponent,
    MenuComponent,
    LoginRegisterComponent,
    AtraccionComponent,
    ParqueComponent,
    AdminComponent,
    LoadingComponent,
    YoutubePipe,
    ComentariosComponent,
    ValoracionesComponent,
    UserComponent,
    SolicitudComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
