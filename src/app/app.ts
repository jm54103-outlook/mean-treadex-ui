import { Component,signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet
    , MatSlideToggleModule
    , MatDrawerContainer
    , MatSidenavModule
    , MatToolbarModule
    , MatIconModule
    , MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  protected readonly title = signal('mean-tradex-ui');
  public isCheckedLocalEN=($localize.locale=="th");
  public isOpenedMenu=false;
  public showToggleMenu=true;  
  public SelectedLocale="";
  
  constructor(
    private router: Router
  ) 
  {
    let locale=$localize.locale;
    this.SelectedLocale = (locale==undefined) ? "" : locale?.toString();    

    let now = Date();
    console.log(`Now is ${now.toString()}`);    
    console.log(`SelectedLocale:${this.SelectedLocale}`);    

  }

 

  onClickToggleMenu()
  {
    this.isOpenedMenu=!this.isOpenedMenu;
  }

  onClickMenu(e:HTMLElement)
  {
    console.log(`${e.id}`);
    switch(e.id)
    {
      case "person":
        this.isOpenedMenu=true;
        this.router.navigate(['/person']);
        break;
      case "product":
         this.isOpenedMenu=true;
         this.router.navigate(['/product']);
        break;
      case "category":
          this.isOpenedMenu=true;
          this.router.navigate(['/category']);
         break;
      case "json":
          this.isOpenedMenu=false;          
          this.router.navigate(['/json']);
         break;
      case "settings":
          this.isOpenedMenu=true;
          this.router.navigate(['/settings']);
         break;
      case "help":
          this.isOpenedMenu=true;
          this.router.navigate(['/help']);
         break;
      case "about":
          this.isOpenedMenu=true;
          this.router.navigate(['/about']);
         break;
      case "exit":
        this.isOpenedMenu=false;
        this.showToggleMenu=false;
        this.router.navigate(['/login']);
        break;
    }    
  }

}
