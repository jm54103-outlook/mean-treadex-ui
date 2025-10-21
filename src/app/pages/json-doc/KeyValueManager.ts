import { Guid } from 'guid-typescript';
import { KeyValue, KeyValueValidator, KeyValueInfomation} from './interface/KeyValue';
import { TreeNode } from './interface/TreeNode';
import { JsonDoc } from './json-doc.js';

export class KeyValueManager
{
  constructor(protected page:JsonDoc)
  {}
}
  