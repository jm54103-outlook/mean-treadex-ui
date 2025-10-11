import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmData } from './dialog-confirm-data';

@Component({
  selector: 'app-dialog-confirm.component',
  imports: [    
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.css'
})
export class DialogConfirmComponent {

  readonly dialogRef = inject(MatDialogRef<DialogConfirmComponent>);
  readonly data = inject<DialogConfirmData>(MAT_DIALOG_DATA);
  readonly title = this.data.title;
  readonly message = this.data.message;

  constructor(){
  }

  yes(){
    return "YES";    
  }

  no(){
    return "NO";
  }


}
