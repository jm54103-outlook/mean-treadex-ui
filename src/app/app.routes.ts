import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './pages/main/main';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { PersonComponent } from './pages/person/person';
import { ProductComponent } from './pages/product/product';
import { AboutComponent } from './pages/about/about';
import { HelpComponent } from './pages/help/help';
import { CategoryComponent } from './pages/category/category';
import { SettingsComponent } from './pages/settings/settings';
import { JsonDoc } from './pages/json-doc/json-doc';


export const routes: Routes = [     
    { path: '', component: LoginComponent },
    { path: 'json-doc', component: JsonDoc },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'person', component: PersonComponent },        
    { path: 'product', component: ProductComponent },  
    { path: 'category', component: CategoryComponent },  
    { path: 'json', component: JsonDoc },  
    { path: 'settings', component: SettingsComponent },  
    { path: 'help', component: HelpComponent },  
    { path: 'about', component: AboutComponent },  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }