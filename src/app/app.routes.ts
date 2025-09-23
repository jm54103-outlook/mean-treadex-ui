import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { PersonComponent } from './pages/person/person';
import { ProductComponent } from './pages/product/product';
import { AboutComponent } from './pages/about/about';


export const routes: Routes = [  
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'person', component: PersonComponent },        
    { path: 'product', component: ProductComponent },  
    { path: 'about', component: AboutComponent },  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }