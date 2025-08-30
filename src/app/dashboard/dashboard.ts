import { Component } from '@angular/core';
import { Lasttransactions } from "./lasttransactions/lasttransactions";
import { Topcategories } from "./topcategories/topcategories";
import { Overview } from "./overview/overview";
import { Monthlychart } from "./monthlychart/monthlychart";

@Component({
  selector: 'app-dashboard',
  imports: [Lasttransactions, Topcategories, Overview, Monthlychart],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboardstyle.scss'],
})
export class Dashboard {
  
}
