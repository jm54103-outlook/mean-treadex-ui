import { Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',  
  imports: [MatButtonModule,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent  {
  message = "Hello World !!!";
  
}
