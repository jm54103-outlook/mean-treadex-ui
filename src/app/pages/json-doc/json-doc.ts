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
import { MatIconModule } from '@angular/material/icon';
import { DialogAlertComponent } from '../../components/dialogs/dialog-alert.component/dialog-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule} from '@angular/material/table';

export interface KeyValue {
  id: number;
  key: string;
  value: string;
}



@Component({
  selector: 'app-json-doc',
  imports: [     
    JsonPipe,      
    MatIconModule,
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

  disabledAdd=false;
  disabledEdit=true;
  disabledRemove=true;

  data: KeyValue[] = [
  
  ];

  @ViewChild(MatTable) table!: MatTable<KeyValue>;

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'key', 'value'];

  form!:FormGroup; 
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
    this.form=this.fb.group({
      keyName:['', [Validators.required]],   
      keyValue:['', [Validators.required]],   
    });
  }



  setKeyValue(i:number,k:string,v:string){
    
    let e:KeyValue={id:i, key:k, value:v};
    let row=this.data.at(i);
    if(row==null)
    {    
      this.data.push(e);
    }
    else
    {
      row.key=k;
      row.value=v;     
    }
    
    this.table.renderRows();
    this.getJsonObjectFromArray();

  }

  getJsonObjectFromArray()
  {
    this.jsonText=`{ `;
    this.data.forEach(e=>{
      let value=e.value;
      let row="";
      switch(value)
      {
        case "String":
          row=`"${e.key}":null`;
          break;
        case "Number":
          row=`"${e.key}":0 `;
          break;
        case "Array":
          row=`"${e.key}":[ ] `;
          break;
        case "Object":
          row=`"${e.key}":{ }`;
          break;
      }
      this.jsonText+= (this.data[0].key==e.key) ? row : `,${row}`;

    });
    this.jsonText+=` }`;
    
    console.log(this.jsonText);
    this.jsonObject=JSON.parse(this.jsonText);
    this.jsonText=JSON.stringify(this.jsonObject,null,2)
    console.log(this.jsonText);  
  }

  onClickAdd()
  {
      const keyName=this.form.controls['keyName'].value;
      const keyValue=this.form.controls['keyValue'].value;

      let found=this.data.filter(e=>e.key==keyName).length>0;
      console.log(`found:${found}`);
      if(!found)
      {
          let id=this.data.length;
          this.setKeyValue(id,keyName,keyValue);
          this.getJsonObjectFromArray();          
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


  selectedIndex=0;
  onClickEdit()
  {
    console.log(`onClickEdit()`)
  
    let key = this.form.controls['keyName'].value;
    let value =  this.form.controls['keyValue'].value;
 
    this.setKeyValue(this.selectedIndex, key, value);
   
  }

  onClickRemove()
  {
    this.form.reset();
    let Index=this.data.findIndex(e=>e.id==this.selectedIndex);
    console.log(`this.data.findIndex:${Index}`);   
    this.data=this.data.filter(e=>e.id!=this.selectedIndex);
    console.log(`this.data.length:${this.data.length}`);
    this.getJsonObjectFromArray();     
    this.table.renderRows();
    
  }

  onClickSelectedRow(kv:any)
  {
    console.log(`onClickSelectedRow(${kv.id})`)


    this.form.reset();

    this.selectedIndex=kv.id;
    this.form.controls['keyName'].setValue(kv.key);
    this.form.controls['keyValue'].setValue(kv.value);
    
    this.disabledAdd=true;
    this.disabledEdit=false;
    this.disabledRemove=false;
  
  }


}
