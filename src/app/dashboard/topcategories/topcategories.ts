import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { DashboardService } from '../../shared/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topcategories',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './topcategories.html',
  styles: ``
})
export class Topcategories implements OnInit {
  chart2!: Chart;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getTopCategories().subscribe({
      next: (res) => {
        console.log('Top categories response:', res);
        if (res.status && res.data?.length > 0) {
          const categories = res.data.map(item => item.categoryName);
          const values = res.data.map(item => ({
            name: item.categoryName,
            y: item.totalSpent,
            color: '#54ca49ff'
          }));

          this.chart2 = new Chart({
            chart: {
              type: 'bar',
              backgroundColor: 'transparent',
              height: 270,
            },
            title: {
              text: 'Top Categories'
            },
            xAxis: {
              categories: categories
            },
            yAxis: {
              title: { text: '' }
            },
            series: [{
              type: 'bar',
              showInLegend: false,
              data: values
            }],
            credits: {
              enabled: false
            }
          });
        }
        else {
          this.chart2 = new Chart({
            chart: { type: 'bar', backgroundColor: 'transparent', height: 270 },
            title: { text: 'Top Categories' },
            xAxis: { categories: ['No Data'] },
            yAxis: { title: { text: '' }, min: 0 },
            series: [{ type: 'bar', showInLegend: false, data: [0] }],
            credits: { enabled: false }
          });
        }
      }
    })
  }
}