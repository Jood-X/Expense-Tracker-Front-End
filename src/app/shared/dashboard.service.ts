import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { TransactionPagingDTO } from './transaction.model';
import { ApiResponse } from './ApiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url: string = environment.apiBaseUrl + '/Transactions'  
  constructor(private http: HttpClient) { }
  
  getTotalSpendings(days: number) : Observable<ApiResponse<string>>{
    return this.http.get<ApiResponse<string>>(this.url + '/TotalSpendings/' + 360);
  }

  getTopCategories(): Observable<ApiResponse<TopCategory[]>>  {
    return this.http.get<ApiResponse<TopCategory[]>>(this.url + '/TopCategories', { params: { Days: 30 , TopN: 3} });
  }

  getChartData(type: string) : Observable<ApiResponse<ChartDTO[]>> {
    return this.http.get<ApiResponse<ChartDTO[]>>(this.url + '/ChartData/', {params: { type: type }});
  }

  getMonthlyReport() : Observable<ApiResponse<MonthlyReport[]>> {
    return this.http.get<ApiResponse<MonthlyReport[]>>(this.url + '/MonthlyReport');
  }
}
