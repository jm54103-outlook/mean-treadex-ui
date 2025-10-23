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
import { FormService } from '../../services/form.service';


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
 
  constructor(
     private fb: FormBuilder
    ,public fs: FormService 
  )
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
 
  build(): void {    
    this.form=this.fb.group({
      key:['', [Validators.required]],   
      value:['', [Validators.required]],   
      caption:[''],
      description:[''],
      required:[false],
      format:[''],
      type:[''],
      length:[],
      minLength:[],
      maxLength:[],
      hint:[''],
      min:[],
      max:[],
    });           
  }

  hasSelectedJsonSelectedTreeNode(){
    return this.jsonSelectedTreeNode.id?.isEmpty();
  }

  setKeyNode(node:KeyNode)
  {    
    console.log(`setKeyNode()`);  

    let found=this.dataTableKeyNode.find(kv=>kv.data.treeid==node.data.treeid && kv.data.id==node.data.id);        

    if(found==null)
    {     
      this.dataTableKeyNode.push(node);      
    }
    else
    {
      this.setModelByFormControls(found.data);
      this.setModelByFormControls(found.info);
      this.setModelByFormControls(found.validator);   
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
      const _key=this.form.controls['key'].value;
      const _value=this.form.controls['value'].value;            

      
      let found=this.dataTableKeyNode.filter(node=>node.data.treeid==this.jsonSelectedTreeNode.id && node.data.key==_key).length>0;
      console.log(`found keyName :${found}`);      
      if(!found)
      {                                         
        if(this.jsonSelectedTreeNode.id != null)
        {          
          let kv:KeyValue={
            treeid: this.jsonSelectedTreeNode.id,
            id: Guid.create(),
            key: _key,
            value: _value  
          }      
          let i:KeyValueInfomation={
            caption:"",
            description:""
          };
          let v:KeyValueValidator={
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
          let kn:KeyNode={           
            data: kv,
            info: i,
            validator: v
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
        const warn = `The key name '${_key}' has already key in Json Object.`
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
    let found=this.dataTableKeyNode.find(node=>node.data.treeid==this.selectedKeyNode.data.treeid && node.data.id==this.selectedKeyNode.data.id);

    if(found)
    {          
      this.setKeyNode(this.selectedKeyNode);  
      this.disabledAdd=false;
      this.disabledEdit=true;
      this.disabledRemove=true;

    }          
   
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

  selectedRow(kv:any)
  {        
    this.form.reset();
    let found=this.dataTableKeyNode.find(node=>node.data.treeid==kv.treeid && node.data.id==kv.id);
    if(found)
    {       
      

      console.log(`found`);       
      
      this.setFormControlsByModel(found.data);
      this.setFormControlsByModel(found.info);
      this.setFormControlsByModel(found.validator);

      this.selectedKeyNode=found;

      this.disabledAdd=true;
      this.disabledEdit=false;
      this.disabledRemove=false;

    }             
  }

  onClickSelectedRow(kv:any)
  {    
    console.log(`onClickSelectedRow()`);   
    this.selectedRow(kv);
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
    this.selectedRow(kv);
    this.KeyValueTabs.selectedIndex=1;
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
    //console.log(`onFocusInformationProperty()`);  
    this.JsonObjectTabs.selectedIndex=0;    
  }

  onFocusValidatorProperty()
  {
    //console.log(`onFocusValidatorProperty()`);  
    this.JsonObjectTabs.selectedIndex=1;
  }

  onChangeKeyValueSelectedIndexTab(){
    //console.log(`onChangeKeyValueSelectedIndexTab()`);
    this.JsonObjectTabs.selectedIndex=(this.KeyValueTabs.selectedIndex==0) ? 2 : 0;   
  }
  
  
  onClickSave()
  {
    console.log(`onClickSave()`);        

    if(!this.selectedKeyNode.data.id.isEmpty())
      {
        this.setModelByFormControls(this.selectedKeyNode.data);
        this.setModelByFormControls(this.selectedKeyNode.info);
        this.setModelByFormControls(this.selectedKeyNode.validator);
     }
       
  }

  setModelByFormControls(model:any)
  {
    //console.clear();    
    const formKeys = Object.keys(model);           
    formKeys.forEach(formKey => { 
        let modelKey:any;
        modelKey=formKey;        
        let control=this.form.controls[formKey];
        if(control!=null){                      
          let value=this.form.controls[formKey].value;    
          this.fs.setValue(model,modelKey,value);  
        }
    });  
  }

  setFormControlsByModel(model:any)
  {
    //console.clear();    
    const formKeys = Object.keys(model);           
    formKeys.forEach(formKey => { 
        let modelKey:any;
        modelKey=formKey;              
        let value=this.fs.getValue(model, modelKey);        
        let control=this.form.controls[formKey];
        if(control!=null){
          console.log(`formKey:${formKey} ${value}`);
          this.form.controls[formKey].setValue(value);      
        }            
    });  
  }
  
}
