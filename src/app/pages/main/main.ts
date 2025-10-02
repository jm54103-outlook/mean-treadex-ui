import { Component} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'app-main',
  imports: [MatDrawerContainer, MatSidenavModule, MatToolbarModule, MatIconModule, MatDividerModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent {
  
  isOpenedMenu=false;

  onClickToggleMenu(){
    this.isOpenedMenu=!this.isOpenedMenu;
  }


  onClickMenu(e:HTMLElement)
  {
    console.log(`${e.id}`);
  }

}
