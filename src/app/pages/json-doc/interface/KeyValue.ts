import { Guid } from 'guid-typescript';

export interface KeyValue {
    treeid: Guid;
    id: Guid;
    key: string;
    value: string;  
}

export interface KeyValueInfomation
{
  treeid: Guid;
  id: Guid;  
  caption : string;
  description : string;
}

export interface KeyValueValidator 
{
    treeid: Guid;
    id: Guid;  
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


  