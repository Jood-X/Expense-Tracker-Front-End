import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RecurringModel, RecurringPagingDTO } from './recurring.model';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from './ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class RecurringService {
  url: string = environment.apiBaseUrl + '/Recurrings'
  list: RecurringModel[] = [];
  formData: RecurringModel = new RecurringModel();
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) { }

  refreshList(): Observable<any> {
    return this.http.get<any>(this.url + "/MyRecurring").pipe(
      tap(res => this.list = res.data as RecurringModel[]),
    );
  }

  postRecurring(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.url, this.formData);
  }

  putRecurring(): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(this.url, this.formData);
  }

  deleteRecurring(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(this.url + '/' + id);
  }

  getPagedRecurrings(page: number = 1): Observable<ApiResponse<RecurringPagingDTO>> {
    return this.http.get<ApiResponse<RecurringPagingDTO>>(
      `${this.url}?page=${page}`
    );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new RecurringModel();
    this.formSubmitted = false;
  }

  exportReport() {
    return this.http.get(this.url + '/report', { responseType: 'blob' });
  }
}
