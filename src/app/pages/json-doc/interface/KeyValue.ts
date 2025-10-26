import { Guid } from 'guid-typescript';

export interface KeyValue {   
  object_id: Guid;
  id: Guid; 
  key: string;
  value: string;  
}

export interface KeyValueInfomation
{ 
  caption : string;
  description : string;
}

export interface KeyValueValidator 
{
    required : boolean;  
    type: string;
    min : number;
    max : number;
    format : string;
    length : number;
    minLength : number;
    maxLength : number;
    hint : string;
}

export interface KeyNode { 
  data: KeyValue;
  info: KeyValueInfomation;
  validator: KeyValueValidator;
}

  