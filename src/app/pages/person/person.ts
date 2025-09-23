import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';




@Component({
  selector: 'app-person',
  providers:[provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,  
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule // ใช้สำหรับฟอร์มแบบ Reactive *** FormGroup Binding ***
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './person.html',
  styleUrl: './person.css'
})
export class PersonComponent {
 
  personForm!:FormGroup; 
  
  person = {
    titleName:'นาง',
    firstName:'สมหญิง',
    lastName:'จริงใจ',
    idNo:'1234567890123',
    birthDate:'2025-02-01',
    gender:'N'
  }

  constructor(
     private fb: FormBuilder     
    ,private router: Router
    ) {   }

  ngOnInit(): void {
    this.personForm = this.fb.group({ 
      titleName:[this.person.titleName, [Validators.required]],   
      firstName:[this.person.firstName, [Validators.required]],
      lastName:[this.person.lastName, [Validators.required]],
      idNo:[this.person.idNo, [Validators.required]],
      birthDate:[this.person.birthDate, [Validators.required]],
      gender:[this.person.gender, [Validators.required]],
    });    
  }

  onSubmit(): void {
    console.log('onSubmit()');
  }

  onCancel(): void {
    console.log('onCancel()');
    this.personForm.reset();
  }

  onEnter(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (nextInput) {
      nextInput.focus(); // เลื่อนโฟกัสไปที่ input ถัดไป
    }
  }

}
