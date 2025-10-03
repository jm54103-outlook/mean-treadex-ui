import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-json-doc',
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
  templateUrl: './json-doc.html',
  styleUrl: './json-doc.css'
})
export class JsonDoc {

  jsonDocForm!:FormGroup; 
  jsonText="";
  jsonObject:any;
 
  ObjectName="Document" ;

  constructor(
    private fb: FormBuilder  
  ) 
  { } 
  
  ngOnInit(): void {   
    this.build();
  }

  build()
  {
    this.jsonDocForm=this.fb.group({
      keyName:['', [Validators.required]],   
      keyValue:['', []],   
    });
  }

  public rows:string[]=[];

  onClickAdd()
  {
      const objectName=this.ObjectName;
      const keyName=this.jsonDocForm.controls['keyName'].value;
      const keyValue=this.jsonDocForm.controls['keyValue'].value;
      let row="";
      switch(keyValue)
      {
        case "String":
          row=`"${keyName}":null`;
          break;
        case "Number":
          row=`"${keyName}":0 `;
          break;
        case "Array":
          row=`"${keyName}":[ ] `;
          break;
        case "Object":
          row=`"${keyName}":{ }`;
          break;
      }
      this.rows.push(row);
      this.jsonText=`{ `;
      let l=this.rows.length;
      for(let i=0;i<l;i++)
      {
        if(i>0)
        {
          this.jsonText+=`,${this.rows[i]}`;   
        }
        else
        {
          this.jsonText+=`${this.rows[i]}`;   
        }
             
      }
      this.jsonText+=` }`;
      console.log(this.jsonText);
      console.log(JSON.stringify(JSON.parse(this.jsonText),null,2));      

     }
}
