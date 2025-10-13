import { Guid } from 'guid-typescript';

export interface TreeNode {
    id?: Guid;
    name: string;
    children?: TreeNode[];
}