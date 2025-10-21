import { AfterViewInit, Component, inject, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { JsonPipe, NgFor } from '@angular/common';  // ✅ ต้อง import NgFor ด้วย
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { KeyValue, KeyValueValidator, KeyValueInfomation, KeyNode} from './interface/KeyValue';
import { TreeNode } from './interface/TreeNode';
import { MatSlideToggle } from "@angular/material/slide-toggle";



let TreeNodes : TreeNode[] = [
  {
    id:Guid.createEmpty(),
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
    NgFor,
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
    MatSlideToggle,
    FormsModule,
    ReactiveFormsModule, // ใช้สำหรับฟอร์มแบบ Reactive *** FormGroup Binding ***           
],
  templateUrl: './json-doc.html',
  styleUrl: './json-doc.css',
  //encapsulation: ViewEncapsulation.None  // เปิดการใช้ global styles
})
export class JsonDoc implements AfterViewInit
{

  readonly dialog = inject(MatDialog);

  dataSourceTreeNode = TreeNodes;
  childrenAccessor = (node: TreeNode) => node.children ?? [];
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  displayedColumns: string[] = ['treeid', 'id', 'key', 'value', 'property'];

  disabledAdd=false;
  disabledEdit=true;
  disabledRemove=true;

  
  /*--All attributes of Json Objects--*/
  dataTableKeyNode: KeyNode[]=[];
  /*--The attributes of selected Json Object--*/
  dataSourceTable:KeyValue[]=[]; //filter from dataTableKeyValue.
  
  form!:FormGroup; 
  jsonText="";
  jsonDataObject={
    treeid: Guid.createEmpty(),
    id: Guid.createEmpty(), 
    key: "",
    value: ""  
  };  
  jsonValidatorObject={
    required : false,
    type: "",
    min : 0,
    max : 0,
    format : "",
    length : 0,
    minLength : 0,
    maxLength : 0,
    hint : "",
  };
  jsonInformationObject={
    caption:"",
    description:""
  };
  jsonSelectedTreeNode:TreeNode={id:Guid.createEmpty(),name:"",children:[]};

  //selectedAttributeId!:Guid;
  selectedKeyNode:KeyNode={
    data: this.jsonDataObject,
    info: this.jsonInformationObject,
    validator: this.jsonValidatorObject
  }

  @ViewChild(MatTable) table!: MatTable<KeyValue>;
  @ViewChild(MatTree) tree!: MatTree<TreeNode>;
  @ViewChild('Tabs') Tabs!: MatTabGroup;
  @ViewChild('KeyValueTabs') KeyValueTabs!: MatTabGroup;
  @ViewChild('JsonObjectTabs') JsonObjectTabs!: MatTabGroup;
  @ViewChildren(MatTreeNode) treeNodes!: QueryList<MatTreeNode<TreeNode>>;

  disableKeyValuePropertiesTab=true;
  disableJsonObjectTabs=true;
 
  constructor(private fb: FormBuilder)
  {} 
  
  ngOnInit(): void {   
    this.build();          
  }
  
  ngAfterViewInit(): void {
    let rootTreeNode=this.dataSourceTreeNode[0];     
    this.tree.expand(rootTreeNode);  
    this.getJsonObjectFromDataTableSource();    
    this.KeyValueTabs.selectedIndex=0;    
    this.JsonObjectTabs.selectedIndex=2;  
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

  setKeyNode(node:KeyNode)
  {    
    let found=this.dataTableKeyNode.find(kv=>kv.data.treeid==node.data.treeid && kv.data.id==node.data.id);    
    console.log(`setKeyNode()`);
    console.log(`node.data.treeid:${node.data.treeid}`);
    console.log(`node.data.id:${node.data.id}`);
    console.log(`found KeyNode:${found?.data.key}`);

    if(found==null)
    {     
      this.dataTableKeyNode.push(node);      
    }
    else
    {
      found.data.key=node.data.key;
      found.data.value=node.data.value;     
    }           
    this.form.reset();
    this.getJsonObjectFromDataTableSource();    
  }

  getDataSourceTable()
  { 
    let dataTableKeyValue:KeyValue[]=[];           
    let KeyNodes=this.dataTableKeyNode.filter(node=>node.data.treeid==this.jsonSelectedTreeNode.id);        
    KeyNodes.forEach(node=>{
      dataTableKeyValue.push(node.data);      
    });    
    return dataTableKeyValue;

  }

  getJsonObjectFromDataTableSource()
  {    
    const treeid=this.jsonSelectedTreeNode.id;
    if(treeid!=null)
    { 
      this.dataSourceTable=this.getDataSourceTable();
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
    
    //console.log(this.jsonText);
    this.jsonDataObject=JSON.parse(this.jsonText);
    this.jsonText=JSON.stringify(this.jsonDataObject,null,2);    
    //console.log(this.jsonText);  

  }

  onClickJsonTreeNode(node:TreeNode){
    if(node.id.isEmpty())
    {
       console.log(`onClickJsonTreeNode():${node.id}}`);
       this.Tabs.selectedIndex = 0;
       this.tree.collapseAll();
    }
    else
    {
      console.log(`onClickJsonTreeNode():${node.id}}`);
      this.disableKeyValuePropertiesTab=true;
      this.disableJsonObjectTabs=true;
      this.Tabs.selectedIndex = 1;
      this.jsonSelectedTreeNode=node;
      this.getJsonObjectFromDataTableSource();      
    }    
  }

 

  onClickAdd()
  {
      const keyName=this.form.controls['keyName'].value;
      const keyValue=this.form.controls['keyValue'].value;      
      
      let found=this.dataTableKeyNode.filter(node=>node.data.treeid==this.jsonSelectedTreeNode.id && node.data.key==keyName ).length>0;
      console.log(`found keyName :${found}`);      
      if(!found)
      {                                         
        if(this.jsonSelectedTreeNode.id != null)
        {          
          let kv:KeyValue={
            treeid: this.jsonSelectedTreeNode.id,
            id: Guid.create(),
            key: keyName,
            value: keyValue  
          }      
          let kn:KeyNode={           
            data:kv,
            info: this.jsonInformationObject,
            validator: this.jsonValidatorObject
          }    
          this.setKeyNode(kn);
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
  
  onClickEdit()
  {  
    console.log(`onClickEdit()`);

    let keyName = this.form.controls['keyName'].value;
    let keyValue =  this.form.controls['keyValue'].value;

    if(!this.jsonSelectedTreeNode.id.isEmpty())
    {
      let kv:KeyValue={
        treeid: this.selectedKeyNode.data.treeid,
        id: this.selectedKeyNode.data.id,
        key: keyName,
        value: keyValue  
      }  
      this.jsonInformationObject.caption=keyName;   
      this.jsonInformationObject.description=keyValue;
      let kn:KeyNode={        
        data: kv,
        info: this.jsonInformationObject,
        validator: this.jsonValidatorObject
      }    
      this.setKeyNode(kn);
    }     

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
   
  }

  onClickRemove()
  {
    this.form.reset();   
    this.dataTableKeyNode=this.dataTableKeyNode.filter(e=>e.data.id!=this.selectedKeyNode.data.id);
    console.log(`this.data.length:${this.dataTableKeyNode.length}`);
    this.getJsonObjectFromDataTableSource();     
    this.table.renderRows();

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
    
  }

  onClickCancel(){    
    this.form.reset();
    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
  }

  onClickSelectedRow(kv:any)
  {
    console.log(`onClickSelectedRow()`); 
    
    let found=this.dataTableKeyNode.find(node=>node.data.treeid==kv.treeid && node.data.id==kv.id);
    if(found)
    {       
      this.selectedKeyNode=found;
      console.log(`found`);       
      console.log(`key:${this.selectedKeyNode.data.key}`);
      console.log(`caption:${this.selectedKeyNode.info.caption}`);
    }          
    
    this.form.reset();

    this.form.controls['keyName'].setValue(kv.key);
    this.form.controls['keyValue'].setValue(kv.value);
    
    this.disabledAdd=true;
    this.disabledEdit=false;
    this.disabledRemove=false;
  
  }

  onChangeSelectedIndexTab()
  {    
    console.log(`onChangeSelectedIndexTab(${this.Tabs.selectedIndex})`);
    if(this.Tabs.selectedIndex==0)
    {                   
        let rootTreeNode=this.dataSourceTreeNode[0];     
        console.log(`${rootTreeNode.name}`)
        if(this.tree.isExpanded(rootTreeNode))
        {
           this.tree.collapse(rootTreeNode); 
        }        
    }
  }

  onClickSelectPropertyTab(kv:KeyValue,value:string)
  {    
    this.disableKeyValuePropertiesTab=false;
    this.disableJsonObjectTabs=false;  
    switch(value)
    {
      case 'data':      
        this.JsonObjectTabs.selectedIndex=2;
        console.log(`onClickSelectPropertyTab():${value}`)
        break;
      case 'validator':
        this.JsonObjectTabs.selectedIndex=1;
        console.log(`onClickSelectPropertyTab():${value}`)
        break;
      case 'information':        
        this.JsonObjectTabs.selectedIndex=0;
        console.log(`onClickSelectPropertyTab():${value}`)
        break;           
    }
  }


  onFocusInformationProperty()
  {
    console.log(`onFocusInformationProperty()`);  
    this.JsonObjectTabs.selectedIndex=0;    
  }

  onFocusValidatorProperty()
  {
    console.log(`onFocusValidatorProperty()`);  
    this.JsonObjectTabs.selectedIndex=1;
  }

  onChangeKeyValueSelectedIndexTab(){
    console.log(`onChangeKeyValueSelectedIndexTab()`);
    this.JsonObjectTabs.selectedIndex=(this.KeyValueTabs.selectedIndex==0) ? 2 : 0;   
  }
  
}
