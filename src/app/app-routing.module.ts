import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { AtraccionComponent } from './components/atraccion/atraccion.component';
import { ParqueComponent } from './components/parque/parque.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent} from './components/user/user.component';

//RUTAS de la aplicación
const routes: Routes=[
    {path: '', component:PrincipalComponent},
    {path: 'home', component:PrincipalComponent},
    {path: 'logs', component:LoginRegisterComponent},
    {path: 'atraccion/:nombre', component:AtraccionComponent},
    {path: 'parques/:nombre', component:ParqueComponent},
    {path: 'admin', component:AdminComponent},
    {path: 'solicitud', component:SolicitudComponent},
    {path: 'user/:userName', component:UserComponent},
    {path: '**', component:PrincipalComponent}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{}