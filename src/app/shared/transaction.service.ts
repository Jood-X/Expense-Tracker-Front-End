import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from './ApiResponse';
import { TransactionFilter, TransactionModel, TransactionPagingDTO } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  url: string = environment.apiBaseUrl + '/Transactions'
  list: TransactionModel[] = [];
  formData: TransactionModel = new TransactionModel();
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) { }

  refreshList(): Observable<any> {
    return this.http.get<any>(`${this.url}/MyTransaction`).pipe(
      tap(res => this.list = res.data as TransactionModel[]),
    );
  }

  postTransaction(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.url, this.formData);
  }

  putTransaction(id: number, updatedTransaction: TransactionModel): Observable<any> {
    return this.http.put(this.url + '/', updatedTransaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  getPagedTransaction(filter: TransactionFilter): Observable<ApiResponse<TransactionPagingDTO>> {
    const params: any = {
      page: filter.page,
      categoryId: filter.categoryId,
      keyword: filter.keyword,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      walletId: filter.walletId
    };
    return this.http.get<ApiResponse<TransactionPagingDTO>>(
      `${this.url}/`, { params }
    );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new TransactionModel();
    this.formSubmitted = false;
  }

  exportReport(filter: TransactionFilter): Observable<any> {
    const params: any = {};

    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.keyword) params.keyword = filter.keyword;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    if (filter.walletId) params.walletId = filter.walletId;

    return this.http.get(this.url + '/report', {
      params: params,
      responseType: 'blob'
    })
  }
}