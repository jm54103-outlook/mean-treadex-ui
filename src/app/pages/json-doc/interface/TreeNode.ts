import { Guid } from 'guid-typescript';

export interface TreeNode {
    object_id: Guid;
    name: string;
    children?: TreeNode[];
}