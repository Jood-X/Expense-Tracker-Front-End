import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../shared/dashboard.service';

interface ChartDTO {
  type: string;
  label: string;
  totalAmount: number;
}

@Component({
  selector: 'app-monthlychart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './monthlychart.html',
})
export class Monthlychart implements OnInit {
  chart!: Chart;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    forkJoin({
      income: this.dashboardService.getChartData('income'),
      expense: this.dashboardService.getChartData('expense')
    }).subscribe({
      next: ({ income, expense }) => {
        const incomeData = income?.data ?? [];
        const expenseData = expense?.data ?? [];
        this.initChart(incomeData, expenseData);
        this.cd.detectChanges(); 
      },
      error: err => console.error(err)
    });
  }

  initChart(incomeData: ChartDTO[], expenseData: ChartDTO[]) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filterMonth = (data: ChartDTO[]) =>
      data.filter(d => {
        const date = new Date(d.label);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

    const filteredIncome = filterMonth(incomeData);
    const filteredExpense = filterMonth(expenseData);

    let allLabels = Array.from(
      new Set([...filteredIncome, ...filteredExpense].map(d => d.label))
    ).sort();

    if (allLabels.length === 0) allLabels = ['No data'];

    const incomeSeriesData = allLabels.map(label => {
      const found = filteredIncome.find(d => d.label === label);
      return found ? Number(found.totalAmount) : 0;
    });

    const expenseSeriesData = allLabels.map(label => {
      const found = filteredExpense.find(d => d.label === label);
      return found ? Number(found.totalAmount) : 0;
    });

    this.chart = new Chart({
      chart: { type: 'line', backgroundColor: 'transparent', height: 300 },
      title: { text: 'Monthly Income & Expense' },
      xAxis: { categories: allLabels, title: { text: 'Date' } },
      yAxis: { min: 0, title: { text: 'Amount' } },
      series: [
        { name: 'Income', type: 'line', data: incomeSeriesData, color: '#54ca49ff' },
        { name: 'Expense', type: 'line', data: expenseSeriesData, color: '#ac2d2dff' }
      ],
      credits: { enabled: false }
    });
  }
}
