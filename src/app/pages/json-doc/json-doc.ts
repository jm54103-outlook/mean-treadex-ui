import { Component, inject, ViewChild } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DialogAlertComponent } from '../../components/dialogs/dialog-alert.component/dialog-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule} from '@angular/material/table';

export interface KeyValue {
  key: string;
  value: string;
}



@Component({
  selector: 'app-json-doc',
  imports: [     
    JsonPipe,      
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,  
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule // ใช้สำหรับฟอร์มแบบ Reactive *** FormGroup Binding ***
  ],
  templateUrl: './json-doc.html',
  styleUrl: './json-doc.css'
})
export class JsonDoc {


  data: KeyValue[] = [
  
  ];

  @ViewChild(MatTable) table!: MatTable<KeyValue>;

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['key', 'value'];

  jsonDocForm!:FormGroup; 
  jsonText="";
  jsonObject={};
 
  ObjectName="Document" ;

  constructor(
    private fb: FormBuilder ,   

  ) 
  { 
  
  } 
  
  ngOnInit(): void {   
    this.build();
  }

  build()
  {
    this.jsonDocForm=this.fb.group({
      keyName:['', [Validators.required]],   
      keyValue:['', [Validators.required]],   
    });
  }

  keyValueMap = new Map<string, string>();

  setKeyValue(k:string,v:string){
    this.keyValueMap.set(k,v);
    let e:KeyValue={key:k,value:v};
    this.data.push(e);
    this.table.renderRows();
  }

  getJsonObject()
  {
    // ดึง Key ทั้งหมด
    const keys = Array.from(this.keyValueMap.keys());
    this.jsonText=`{ `;
    keys.forEach(key => {
      let value=this.keyValueMap.get(key);
      let row="";
      switch(value)
      {
        case "String":
          row=`"${key}":null`;
          break;
        case "Number":
          row=`"${key}":0 `;
          break;
        case "Array":
          row=`"${key}":[ ] `;
          break;
        case "Object":
          row=`"${key}":{ }`;
          break;
      }
      this.jsonText+= (keys[0]==key) ? row : `,${row}`;
    });
    this.jsonText+=` }`;
    
    console.log(this.jsonText);
    this.jsonObject=JSON.parse(this.jsonText);
    this.jsonText=JSON.stringify(this.jsonObject,null,2)
    console.log(this.jsonText);  

  }


  onClickAdd()
  {
      const keyName=this.jsonDocForm.controls['keyName'].value;
      const keyValue=this.jsonDocForm.controls['keyValue'].value;

      let key=this.keyValueMap.get(keyName);
      if(key==null)
      {
          this.setKeyValue(keyName,keyValue);
          this.getJsonObject();          
      }
      else
      {
        const warn = `The key name '${keyName}' has already key in Json Object.`
        const dialogConfirmRef = this.dialog.open(DialogAlertComponent,
        {
                data: {title:"แจ้งเตือน", message:warn},
        });
        console.warn(warn)
      }

  }

}
