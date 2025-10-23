import { ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
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
import { FormService} from '../../services/form.service';
import { DialogAlertComponent } from '../../components/dialogs/dialog-alert.component/dialog-alert.component';
import { DialogConfirmComponent } from '../../components/dialogs/dialog-confirm.component/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { popResultSelector } from 'rxjs/internal/util/args';



@Component({
  selector: 'app-person',
  providers:[DecimalPipe,  DatePipe],
  imports: [    
    DecimalPipe,    
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
  
  readonly dialog = inject(MatDialog);
  
  personForm!:FormGroup; 

  person = {
    titleName:'นาง',
    firstName:'สมหญิง',
    lastName:'จริงใจ',
    idNo:'1234567890123',
    birthDate:new Date('1977-02-13'),
    gender:'N',
    height:180,
    weight:72,
    salary:25000.00,
  }

  constructor(
     private fb: FormBuilder  
    ,public fs: FormService   
    ,private router: Router
    ,public decimalPipe: DecimalPipe
    ,public datePipe: DatePipe
  ) {
    const now = new Date();           
    console.log(`Now is :${fs.formatTHDate(now)}`);
  } 
   
  ngOnInit(): void {      
        
    this.build();

  }

  build()
  {
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
    this.refresh();
  }

  refresh()
  {
    console.log(`refresh()`);
    
    this.bindModel(this.person);   
  
    const dialogAlertRef = this.dialog.open(DialogAlertComponent,
    {
        data: {title:"แจ้งเตือน", message:"เรียกข้อมูลสำเร็จ"},
    })
  
     dialogAlertRef.afterClosed().subscribe(dismiss=>{      
      console.log(`The dialog was closed. result:${dismiss}`);
      if (dismiss !== undefined) {
          console.log(`${dismiss}`);          
      }
    });  

  }

  bindModel(model:any)
  {
    //console.clear();    
    const formKeys = Object.keys(model);           
    formKeys.forEach(formKey => { 
        let modelKey:any;
        modelKey=formKey;      
        //console.log(`${modelKey}:${this.fs.getValue(this.person, modelKey)}`);
        let value=this.fs.getValue(model, modelKey);
        this.personForm.controls[formKey].setValue(value);      
    });  
  }

  getFieldValue(formKey:string){
    return this.personForm.controls[formKey].value;
  }

  onSubmit(): void {
    console.clear();
    console.log(`onSubmit()`);

    //const dialogAlertRef = this.dialog.open(DialogAlertComponent,{});

    const dialogConfirmRef = this.dialog.open(DialogConfirmComponent,
    {
        data: {title:"ยืนยัน", message:"ต้องการบันทึกข้อมูล?"},
    })

    dialogConfirmRef.afterClosed().subscribe(result=>{      
      console.log(`The dialog was closed. result:${result}`);
      if (result !== undefined) {
        console.log(`${result}`);
        if(result=='YES')
        {
          this.submit();
        }     
      }
    });   
  }

  submit()
  {
    console.clear();
    const formKeys = Object.keys(this.personForm.controls);
    formKeys.forEach(formKey => {
      let value=this.getFieldValue(formKey);
      console.log(`${formKey}:${value}`);
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
