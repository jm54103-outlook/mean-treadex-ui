import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const EXAMPLE_DATA: TreeNode[] = [
  {
    name: 'Traders',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Products',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

@Component({
  selector: 'app-home',  
  imports: [MatSidenavModule,
            MatTabsModule,
            MatProgressBarModule,
            MatIconModule,
            MatButtonModule,
            MatTreeModule,
          ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})


export class HomeComponent  {

  dataSource = EXAMPLE_DATA;

  childrenAccessor = (node: TreeNode) => node.children ?? [];

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  message = "Hello World !!!";
  
}
