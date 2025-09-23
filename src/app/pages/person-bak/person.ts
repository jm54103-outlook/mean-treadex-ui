import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AppRoutingModule } from "../../app.routes";


@Component({
  selector: 'app-person',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatGridListModule,
    MatRadioModule,
    ReactiveFormsModule,// ใช้สำหรับฟอร์มแบบ Reactive   
    AppRoutingModule
],
  templateUrl: './person.html',
  styleUrl: './person.css'
})


export class PersonComponent {

  personForm! : FormGroup; 

  person = {
    titleName:'นาง',
    firstName:'สมหญิง',
    lastName:'หมายสมหวัง',
    idNo:'1234567890123',
    birthDate:'2025-02-01',
    gender:'N'
  }


  constructor(private fb: FormBuilder
      ,private router: Router
  ) {}

  ngOnInit(): void {
    this.personForm = this.fb.group({     
      titleName:[this.person.titleName, [Validators.required]],
      firstName: [this.person.firstName, [Validators.required]],
      lastName: [this.person.lastName, [Validators.required]],
      idNo: [this.person.idNo, [Validators.required]],
      birthDate: [this.person.birthDate, [Validators.required]],
    });    
  }

  onEnter(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (nextInput) {
      nextInput.focus(); // เลื่อนโฟกัสไปที่ input ถัดไป
    }
  }

  onSubmit(): void {
    console.log('onSubmit()');
    /*
    this.personForm.controls['titleName'].setValue('');
    this.personForm.controls['firstName'].setValue('');
    this.personForm.controls['lastName'].setValue('');
    this.personForm.controls['idNo'].setValue('');
    this.personForm.controls['birthDate'].setValue(null);
    */
  }

  onReset(){
    console.log('onReset()');
    this.personForm.reset();
  }

}

