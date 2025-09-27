import { ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-person',
  providers:[DecimalPipe],
  imports: [
    DecimalPipe,
    DatePipe,    
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
    firstName:'สมหญิงyy',
    lastName:'จริงใจot',
    idNo:'1234567890123',
    birthDate:'2025-02-01',
    gender:'N',
    height:180,
    weight:72,
    salary:25000.00,
  }

  constructor(
     private fb: FormBuilder     
    ,private router: Router
    ,public decimalPipe: DecimalPipe
  ) {}


  ngOnInit(): void {      
    this.personForm = this.fb.group({ 
      titleName:[null, [Validators.required]],   
      firstName:[null, [Validators.required]],
      lastName:[null, [Validators.required]],
      idNo:[null,[Validators.required, Validators.minLength, Validators.maxLength]],
      birthDate:[null, [Validators.required]],
      gender:[null, [Validators.required]],
      height:[null,],
      weight:[null,],
      salary:[null,]
    });      
    this.bind(this.person);
  }

  get(key:any){
    return this.personForm.controls[key].value;
  }

  bind(model:any)
  {
    console.clear();
    console.log(`bind()`);
    const formKeys = Object.keys(model);           
    formKeys.forEach(formKey => { 
      let modelKey:any;
      modelKey=formKey;      
      console.log(`${modelKey}:${this.getValue(this.person, modelKey)}`);
      this.personForm.controls[formKey].setValue(this.getValue(this.person, modelKey));      
    });  
  }

  // ฟังก์ชันที่ดึงค่าโดยใช้ key แบบ dynamic
  getValue<T>(model: T, key: keyof T) {
     return model[key];
  }

  onSubmit(): void {
    console.clear();
    console.log(`onSubmit()`);
    const formKeys = Object.keys(this.personForm.controls);
    formKeys.forEach(formKey => {
      this.personForm.controls[formKey].value;
      console.log(`${formKey}:${this.personForm.controls[formKey].value}`);
    });    
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

  onInputDecimalChange(event: any) {

    let value = event.target.value;     
    let decimalValue:number;
    let formattedValue: string;

    // ตรวจสอบให้ทศนิยมไม่เกิน 2 หลัก
    if (value && value.toString().includes('.')) {
      let parts = value.toString().split('.');
      if (parts[1].length > 2) {
        decimalValue = parseFloat(parts[0] + '.' + parts[1].substring(0, 2));
      } else {
        decimalValue = parseFloat(value);
      }
    } else {
      decimalValue = parseFloat(value);
    }

    // ฟอร์แมตตัวเลขที่มีการคั่นหลักพัน
    formattedValue = this.decimalPipe.transform(decimalValue, '1.2-2')??"";

    console.log(`onInputDecimalChange:${formattedValue}`);
    

    
  }

}
