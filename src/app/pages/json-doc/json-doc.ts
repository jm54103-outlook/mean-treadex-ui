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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { Guid } from 'guid-typescript';
import { NgFor } from '@angular/common'; // ✅ ต้อง import NgFor ด้วย


export interface KeyValue {
  id: number;
  key: string;
  value: string;
}
interface TreeNode {
  id?: Guid;
  name: string;
  children?: TreeNode[];
}

let TreeNodes : TreeNode[] = [
  {
    name: 'JsonObjects',
    children: [
      {id:Guid.create(), name: 'JsonObject1'},
      {id:Guid.create(), name: 'JsonObject2'},
      {id:Guid.create(), name: 'JsonObject3'},

      ],
  }  
];


@Component({
  selector: 'app-json-doc',
  imports: [
    JsonPipe,
    MatSidenavModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTreeModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatGridListModule,
    ReactiveFormsModule // ใช้สำหรับฟอร์มแบบ Reactive *** FormGroup Binding ***
    ,NgFor
],
  templateUrl: './json-doc.html',
  styleUrl: './json-doc.css'
})
export class JsonDoc {

  dataSourceTreeNode = TreeNodes;
  childrenAccessor = (node: TreeNode) => node.children ?? [];
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  disabledAdd=false;
  disabledEdit=true;
  disabledRemove=true;

  dataTable: KeyValue[]=[];

  @ViewChild(MatTable) table!: MatTable<KeyValue>;
  @ViewChild(MatTree) tree!: MatTree<TreeNode>;

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'key', 'value'];

  form!:FormGroup; 
  jsonText="";
  jsonObject={};
  jsonSelectedTreeNode!:TreeNode;
 
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
    let row=this.dataTable.at(i-1);
    if(row==null)
    {    
      this.dataTable.push(e);
    }
    else
    {
      row.key=k;
      row.value=v;     
    }
    
    this.table.renderRows();
    this.getJsonObjectFromArray();
    this.form.reset();

  }

  getJsonObjectFromArray()
  {
    this.jsonText=`{ `;
    this.dataTable.forEach(e=>{
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
      this.jsonText+= (this.dataTable[0].key==e.key) ? row : `,${row}`;

    });
    this.jsonText+=` }`;
    
    console.log(this.jsonText);
    this.jsonObject=JSON.parse(this.jsonText);
    this.jsonText=JSON.stringify(this.jsonObject,null,2)
    console.log(this.jsonText);  

  }

  selectedIndexTab=1;

  onClickJsonTreeNode(node:TreeNode){
    if(node.id==null)
    {
       console.log(`onClickJsonTreeNode():${node.id}}`);
       this.selectedIndexTab = 0;
    }
    else
    {
      console.log(`onClickJsonTreeNode():${node.id}}`);
      this.selectedIndexTab = 1;
      this.jsonSelectedTreeNode=node;
    }    
  }

  onClickAdd()
  {
      const keyName=this.form.controls['keyName'].value;
      const keyValue=this.form.controls['keyValue'].value;

      let found=this.dataTable.filter(e=>e.key==keyName).length>0;
      console.log(`found:${found}`);
      let max=0;
      if(!found)
      {
        this.dataTable.forEach(e=>{
          max=(e.id>max) ? e.id : max;
        });
        let id=max+1;
        console.log(id);
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


  selected_id=0;
  onClickEdit()
  {

    let id=this.selected_id;
    console.log(`onClickEdit(${id})`);

    let key = this.form.controls['keyName'].value;
    let value =  this.form.controls['keyValue'].value;
   
 
    this.setKeyValue(id, key, value);

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
   
  }

  onClickRemove()
  {
    this.form.reset();

    let Index=this.dataTable.findIndex(e=>e.id==this.selected_id);
    console.log(`this.data.findIndex:${Index}`);   
    this.dataTable=this.dataTable.filter(e=>e.id!=this.selected_id);
    console.log(`this.data.length:${this.dataTable.length}`);
    this.getJsonObjectFromArray();     
    this.table.renderRows();

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
    
  }

  onClickSelectedRow(kv:any)
  {
    console.log(`onClickSelectedRow(${kv.id})`);
    this.selected_id=kv.id;

    this.form.reset();

   
    this.form.controls['keyName'].setValue(kv.key);
    this.form.controls['keyValue'].setValue(kv.value);
    
    this.disabledAdd=true;
    this.disabledEdit=false;
    this.disabledRemove=false;
  
  }


}
