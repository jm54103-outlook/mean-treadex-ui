import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogAlertData } from './dialog-alert-data';

@Component({
  selector: 'app-dialog-alert.component',
  imports: [    
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './dialog-alert.component.html',
  styleUrl: './dialog-alert.component.css'
})
export class DialogAlertComponent {

  readonly dialogRef = inject(MatDialogRef<DialogAlertComponent>);
  readonly data = inject<DialogAlertData>(MAT_DIALOG_DATA);

  public title!:string;
  public message!:string;

  constructor(){
    this.title=this.data.title;
    this.message=this.data.message;
  }
  
  dismiss():void {
    this.dialogRef.close();
  }
}
