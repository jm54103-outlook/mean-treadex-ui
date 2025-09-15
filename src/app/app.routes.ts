import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [  
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }