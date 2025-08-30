import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared/dashboard.service';
import { ApiResponse } from '../../shared/ApiResponse';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss'],
  standalone: true,
})
export class Overview implements OnInit {
  monthlyReport: MonthlyReport[] = [];
  totalSpent: number | null = null;

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
    this.getMonthlyReport();
    this.getTotalSpendings();
  }

  getMonthlyReport(): void {
    const currentMonth = new Date().getMonth() + 1;
    this.service.getMonthlyReport().subscribe({
      next: (res) => {
        if (res.status && Array.isArray(res.data)) {
          this.monthlyReport = res.data.filter(
            (item) => parseInt(item.month, 10) === currentMonth
          );
        }
      },
      error: (err) => {
        console.error('Error fetching monthly report in Overview:', err);
      }
    });
  }

  getTotalSpendings(): void {
    this.service.getTotalSpendings(360).subscribe({
      next: (res: ApiResponse<string>) => {
        this.totalSpent = parseFloat(res.data);
      },
      error: (err) => {
        console.error('Error fetching total spendings', err);
      }
    });
  }
}
