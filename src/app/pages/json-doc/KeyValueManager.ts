import { Guid } from 'guid-typescript';
import { KeyValue, KeyValueValidator, KeyValueInfomation} from './interface/KeyValue';
import { TreeNode } from './interface/TreeNode';
import { JsonDoc } from './json-doc.js';

export class KeyValueManager
{
  constructor(protected page:JsonDoc)
  {}

  setKeyValueInformation(kv:KeyValue,caption_text:string,description_text:string) : void 
  {
    
    let row=this.page.dataTableKeyValueInfomation.find(row=>row.treeid==kv.treeid && row.id==kv.id);
    if(row==null)
    {
      let e:KeyValueInfomation={treeid:kv.treeid, id:kv.id, caption:caption_text, description:description_text}
      this.page.dataTableKeyValueInfomation.push(e);
    }
    else
    {
      row.caption=caption_text;
      row.description=description_text;
    }   
  }

  setKeyValueValidatorNumber(kv:KeyValue,
    _required:boolean
    ,_type:string
    ,_format:string
    ,_min:number
    ,_max:number
    ,_hint:string) : void 
  {    
    let row=this.page.dataTableValidator.find(row=>row.treeid==kv.treeid && row.id==kv.id);
    if(row==null)
    {
        let e:KeyValueValidator={
            treeid: kv.treeid,
            id: kv.id,  
            required : _required,  
            type : _type,
            min : _min,
            max : _max,
            format : _format,
            length : 0,
            minLength : 0,
            maxLength : 0,
            hint : _hint,
        }
        this.page.dataTableValidator.push(e);
    }
    else
    {
      row.required=_required;  
      row.min=_min;
      row.max=_max;
      row.hint=_hint;
    }
  }

  setKeyValueValidatorString(kv:KeyValue
    ,_required:boolean
    ,_type:string
    ,_format:string
    ,_minLength:number
    ,_maxLength:number
    ,_length:number
    ,_hint:string)
  {
    let row=this.page.dataTableValidator.find(row=>row.treeid==kv.treeid && row.id==kv.id);
    if(row==null)
    {
        let e:KeyValueValidator={
            treeid: kv.treeid,
            id: kv.id,  
            required : _required, 
            type :_type,
            format : "",
            min : 0,
            max : 0,
            length : _length,
            minLength : _minLength,
            maxLength : _maxLength,
            hint : _hint,
        }
        this.page.dataTableValidator.push(e);
    }
    else
    {
      row.required = _required;
      row.length =_length;
      row.minLength = _minLength;
      row.maxLength = _maxLength;
      row.hint = _hint;
    }
  }
}