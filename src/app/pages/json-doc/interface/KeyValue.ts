import { Guid } from 'guid-typescript';

export interface KeyValue {
    treeid: Guid;
    id: Guid;
    key: string;
    value: string;  
}

export interface KeyValueValidator {
    treeid: Guid;
    id: Guid;  
    required : boolean;  
    min : number;
    max : number;
    length : number;
    minLength : number;
    maxLength : number;
    hint : string;
}

export interface KeyValueInfomation
{
  treeid: Guid;
  id: Guid;  
  caption : string;
  description : string;
}
  