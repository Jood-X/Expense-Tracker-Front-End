import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment.development';
import { WalletModel, WalletPagingDTO } from './wallet.model';
import { NgForm } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from './ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  url: string = environment.apiBaseUrl + '/Wallets'
  list: WalletModel[] = [];
  formData: WalletModel = new WalletModel();
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) { }

  refreshList(): Observable<any> {
    return this.http.get<any>(`${this.url}/MyWallets`).pipe(
      tap(res => this.list = res.data as WalletModel[]),
    );
  }

  postWallet(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.url, this.formData);
  }

  putWallet(): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(this.url, this.formData);
  }

  deleteWallet(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`);
  }

  getPagedWallets(searchTerm: string = '', page: number = 1): Observable<ApiResponse<WalletPagingDTO>> {
    return this.http.get<ApiResponse<WalletPagingDTO>>(
      `${this.url}?page=${page}&searchTerm=${searchTerm}`
    );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new WalletModel();
    this.formSubmitted = false;
  }

  exportReport(searchTerm: string = ''): Observable <any> {
    const params = { searchTerm };
    return this.http.get(this.url + '/report', {
      responseType: 'blob',
      params: params
    });    
  }
}