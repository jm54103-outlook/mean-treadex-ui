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
    object_id:Guid.createEmpty(),
    name: 'JsonObjects',
    children: [
      {object_id:Guid.create(), name: 'JsonObject1'},
      {object_id:Guid.create(), name: 'JsonObject2'},
      {object_id:Guid.create(), name: 'JsonObject3'},
      {object_id:Guid.create(), name: 'JsonObject4'},
      {object_id:Guid.create(), name: 'JsonObject5'},
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
    object_id: Guid.createEmpty(),
    id: Guid.createEmpty(), 
    key: "",
    value: ""  
  };

  selectedJsonObject:TreeNode=this.createJsonOject();
  selectedKeyNode:KeyNode=this.createKeyNode();
  
  @ViewChild(MatTable) table!: MatTable<KeyValue>;
  @ViewChild(MatTree) tree!: MatTree<TreeNode>;
  @ViewChild('Tabs') Tabs!: MatTabGroup;
  @ViewChild('KeyValueTabs') KeyValueTabs!: MatTabGroup;
  @ViewChild('JsonObjectTabs') JsonObjectTabs!: MatTabGroup;
  @ViewChildren(MatTreeNode) treeNodes!: QueryList<MatTreeNode<TreeNode>>;

  disableKeyValuePropertiesTab=true;
  disableJsonObjectTabs=true;

  options = [
    { value: 'd2', viewValue: 'decimal(20,2)'},
    { value: 'd5', viewValue: 'decimal(20,5)'},
    { value: 'i', viewValue: 'integer' },
    { value: 'f', viewValue: 'float' },
    { value: 'tt', viewValue: 'tinytext'},
    { value: 't', viewValue: 'text' },    
  ];
 
  constructor(
     private fb: FormBuilder
    ,public fs: FormService 
  )
  {    
  } 
  
  ngOnInit(): void {   
    this.build();       
  }

  ngAfterViewInit(): void {
    let rootTreeNode=this.dataSourceTreeNode[0];     
    this.tree.expand(rootTreeNode);  
    this.renderJsonObjectFromDataTableSource();    
    this.KeyValueTabs.selectedIndex=0;    
    this.JsonObjectTabs.selectedIndex=2;  
  }
 
  build(): void {    
    this.form=this.fb.group({
      key:[null, [Validators.required]],   
      value:[null, [Validators.required]],   
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

  reset()
  {
   
    this.form.reset({ emitEvent: false });   
    
    this.form.get('key')?.markAsPristine();
    this.form.get('key')?.markAsUntouched();
    this.form.get('value')?.markAsPristine();
    this.form.get('value')?.markAsUntouched();
  }


  hasSelectedJsonSelectedTreeNode(){
    return this.selectedJsonObject.object_id?.isEmpty();
  }

  setKeyNode(node:KeyNode)
  {    
    console.log(`setKeyNode()`);  

    let found=this.dataTableKeyNode.find(kv=>kv.data.object_id==node.data.object_id && kv.data.id==node.data.id);        

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
    this.renderJsonObjectFromDataTableSource();    

  }



  getDataSourceTable()
  { 
    let dataTableKeyValue:KeyValue[]=[];           
    let KeyNodes=this.dataTableKeyNode.filter(node=>node.data.object_id==this.selectedJsonObject.object_id);        
    KeyNodes.forEach(node=>{
      dataTableKeyValue.push(node.data);      
    });    
    return dataTableKeyValue;
  }

  renderJsonObjectFromDataTableSource()
  {    
    const treeid=this.selectedJsonObject.object_id;
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
    if(node.object_id.isEmpty())
    {
       console.log(`onClickJsonTreeNode():${node.object_id}}`);
       this.Tabs.selectedIndex = 0;
       this.tree.collapseAll();
    }
    else
    {
      console.log(`onClickJsonTreeNode():${node.object_id}}`);
      this.disableKeyValuePropertiesTab=true;
      this.disableJsonObjectTabs=true;
      this.Tabs.selectedIndex = 1;
      this.selectedJsonObject=node;
      this.renderJsonObjectFromDataTableSource();      
    }    
  }

  createJsonOject(){
    return {object_id:Guid.createEmpty(),name:"",children:[]};  
  }

  createKeyNode(){
    let kn:KeyNode={
      data:this.createKeyValue(),
      info:this.createKeyValueInfomation(),
      validator:this.createKeyValueValidator()
    };
    return kn;
  }

  createKeyValue()
  {
    let kv:KeyValue={
      object_id: this.selectedJsonObject.object_id,
      id: Guid.create(),
      key: "",
      value: ""  
    };
    return kv;
  }

  createKeyValueInfomation()
  {
    let i:KeyValueInfomation={
      caption:"",
      description:""
    };
    return i;
  }

  createKeyValueValidator()
  {
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
    return v;
  }


  onClickAdd()
  {
      const _key=this.form.controls['key'].value;
      const _value=this.form.controls['value'].value;            
      
      let found=this.dataTableKeyNode.filter(node=>node.data.object_id==this.selectedJsonObject.object_id && node.data.key==_key).length>0;
      console.log(`found keyName :${found}`);      
      if(!found)
      {                                         
        if(this.selectedJsonObject.object_id != null)
        {                                         
          let k=this.createKeyValue();
          let i=this.createKeyValueInfomation();
          let v=this.createKeyValueValidator();          

          this.setModelByFormControls(k);

          let kn:KeyNode={           
            data: k,
            info: i,
            validator: v
          }    

          this.reset();     
          this.setKeyNode(kn);
          this.renderJsonObjectFromDataTableSource();     
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

    let found=this.dataTableKeyNode.find(node=>node.data.object_id==this.selectedKeyNode.data.object_id && node.data.id==this.selectedKeyNode.data.id);

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
    this.renderJsonObjectFromDataTableSource();     
    this.table.renderRows();

    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
    
  }

  onClickCancel()
  {    
    this.disabledAdd=false;
    this.disabledEdit=true;
    this.disabledRemove=true;
    this.reset();   
  }

 
  selectedRow(kv:KeyValue)
  { 
    this.reset();      
    
    let found=this.dataTableKeyNode.find(node=>node.data.object_id==kv.object_id && node.data.id==kv.id);
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

  onChangeSelectIndexType()
  {
    //console.log(`onChangeSelectIndexType()`);             
    
    let value=this.form.controls['type'].value;
    let option=this.options.find(option=>option.value==value);

    //console.log(`value:${value} viewValue:${option?.viewValue}`);         

    let isNumber=false;

    switch(value)
    {
      case "i":
        isNumber=true; 
        break;
      case "f":
        isNumber=true; 
        break;
      case "d2":
          isNumber=true; 
        break;
      case "d5":
        isNumber=true; 
        break;
      default:
        isNumber=false;   
        break;
    }

    if(isNumber)
    {
      this.form.controls['length'].disable();
      this.form.controls['minLength'].disable();
      this.form.controls['maxLength'].disable();      
      this.form.controls['min'].enable();
      this.form.controls['max'].enable();
    }
    else
    {
      this.form.controls['length'].enable();
      this.form.controls['minLength'].enable();
      this.form.controls['maxLength'].enable();    
      this.form.controls['min'].disable();   
      this.form.controls['max'].disable();   
    }  

  } 
  
}
