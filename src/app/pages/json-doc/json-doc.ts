import { AfterViewInit, Component, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTree, MatTreeModule, MatTreeNode } from '@angular/material/tree';
import { Guid } from 'guid-typescript';
import { NgFor } from '@angular/common'; // ✅ ต้อง import NgFor ด้วย


export interface KeyValue {
  treeid: Guid;
  id: Guid;
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
      {id:Guid.create(), name: 'JsonObject4'},
      {id:Guid.create(), name: 'JsonObject5'},
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
export class JsonDoc implements AfterViewInit{


  dataSourceTreeNode = TreeNodes;
  childrenAccessor = (node: TreeNode) => node.children ?? [];
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  disabledAdd=false;
  disabledEdit=true;
  disabledRemove=true;

  dataTable: KeyValue[]=[];
  dataSourceTable:KeyValue[]=[];

  @ViewChild(MatTable) table!: MatTable<KeyValue>;
  @ViewChild(MatTree) tree!: MatTree<TreeNode>;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChildren(MatTreeNode) treeNodes!: QueryList<MatTreeNode<TreeNode>>;

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['treeid','id', 'key', 'value'];

  form!:FormGroup; 
  jsonText="";
  jsonObject={};
  jsonSelectedTreeNode:TreeNode={id:Guid.createEmpty(),name:"",children:[]};
 
  constructor(
    private fb: FormBuilder ,   

  ) 
  {     
  } 
  
  ngOnInit(): void {   
    this.build();      
    
  }
  

  ngAfterViewInit(): void {
    let rootTreeNode=this.dataSourceTreeNode[0];     
    this.tree.expand(rootTreeNode);  
    this.getJsonObjectFromDataTableSource();     
  }

  
  build()
  {
    this.form=this.fb.group({
      keyName:['', [Validators.required]],   
      keyValue:['', [Validators.required]],   
    });
  }

  hasSelectedJsonSelectedTreeNode(){
    return this.jsonSelectedTreeNode.id?.isEmpty();
  }

  setKeyValue(t:Guid,i:Guid,k:string,v:string)
  {

    let e:KeyValue={treeid:t, id:i, key:k, value:v};
    let row=this.dataTable.find(row=>row.id==i);
    
    if(row==null)
    {    
      this.dataTable.push(e);
    }
    else
    {
      row.key=k;
      row.value=v;     
    }           
    this.form.reset();
    this.getJsonObjectFromDataTableSource();    

  }

  getJsonObjectFromDataTableSource()
  {    
    const treeid=this.jsonSelectedTreeNode.id;
    if(treeid!=null)
    {           
      this.dataSourceTable=this.dataTable.filter(row=>row.treeid==treeid);
      this.table.renderRows();
    }
    this.jsonText=`{ `;
    this.dataSourceTable.forEach(e=>{
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
      this.jsonText+= (this.dataSourceTable[0].key==e.key) ? row : `,${row}`;

    });
    this.jsonText+=` }`;
    
    console.log(this.jsonText);
    this.jsonObject=JSON.parse(this.jsonText);
    this.jsonText=JSON.stringify(this.jsonObject,null,2)
    console.log(this.jsonText);  

  }

  onClickJsonTreeNode(node:TreeNode){
    if(node.id==null)
    {
       console.log(`onClickJsonTreeNode():${node.id}}`);
       this.tabGroup.selectedIndex = 0;
       this.tree.collapseAll();
    }
    else
    {
      console.log(`onClickJsonTreeNode():${node.id}}`);
      this.tabGroup.selectedIndex = 1;
      this.jsonSelectedTreeNode=node;
      this.getJsonObjectFromDataTableSource();
    }    
  }

  onClickAdd()
  {
      const keyName=this.form.controls['keyName'].value;
      const keyValue=this.form.controls['keyValue'].value;

      const treeid=this.jsonSelectedTreeNode.id;
      let found=this.dataTable.filter(row=>row.treeid==treeid && row.key==keyName ).length>0;
      console.log(`found:${found}`);      
      if(!found)
      {               
               
        let id=Guid.create();
        console.log(id);
        if(treeid!=null)
        {
          this.setKeyValue(treeid,id,keyName,keyValue);
          this.getJsonObjectFromDataTableSource();     
        }  
        else
        {
          const warn = `Does not have selected tree node of JsonObject.`
          console.warn(warn)
        }
           
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


  selectedAttributeId!:Guid;
  onClickEdit()
  {

    let id=this.selectedAttributeId;
    console.log(`onClickEdit(${id})`);

    let key = this.form.controls['keyName'].value;
    let value =  this.form.controls['keyValue'].value;

    if(this.jsonSelectedTreeNode.id!=null)
    {
      const treeid=this.jsonSelectedTreeNode.id;
      this.setKeyValue(treeid, id, key, value);
    }     

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
   
  }

  onClickRemove()
  {
    this.form.reset();

    let Index=this.dataTable.findIndex(e=>e.id==this.selectedAttributeId);
    console.log(`this.data.findIndex:${Index}`);   
    this.dataTable=this.dataTable.filter(e=>e.id!=this.selectedAttributeId);
    console.log(`this.data.length:${this.dataTable.length}`);
    this.getJsonObjectFromDataTableSource();     
    this.table.renderRows();

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
    
  }

  onClickSelectedRow(kv:any)
  {
    console.log(`onClickSelectedRow(${kv.id})`);
    this.selectedAttributeId=kv.id;

    this.form.reset();

    this.form.controls['keyName'].setValue(kv.key);
    this.form.controls['keyValue'].setValue(kv.value);
    
    this.disabledAdd=true;
    this.disabledEdit=false;
    this.disabledRemove=false;
  
  }

  onChangeSelectedIndexTab()
  {
    
    console.log(`onChangeSelectedIndexTab(${this.tabGroup.selectedIndex})`);
    if(this.tabGroup.selectedIndex==0)
    {                   
        let rootTreeNode=this.dataSourceTreeNode[0];     
        console.log(`${rootTreeNode.name}`)
        if(this.tree.isExpanded(rootTreeNode))
        {
           this.tree.collapse(rootTreeNode); 
        }        
    }
  }

}
