import { Component} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MatDrawerContainer, MatSidenavModule, MatToolbarModule, MatIconModule, MatDividerModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent {
  
  isOpenedMenu=false;

  
  constructor(
    private router: Router
  ) {}

  onClickToggleMenu(){
    this.isOpenedMenu=!this.isOpenedMenu;
  }


  onClickMenu(e:HTMLElement)
  {
    console.log(`${e.id}`);
    switch(e.id)
    {
      case "exit":
        this.router.navigate(['/login']);
    }    
  }

}
