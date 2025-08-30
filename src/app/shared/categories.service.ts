import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CategoriesModel, CategoryPagingDTO } from './categories.model';
import { NgForm } from '@angular/forms';
import { ApiResponse } from './ApiResponse';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  url: string = environment.apiBaseUrl + '/Categories'
  list: CategoriesModel[] = [];
  formData: CategoriesModel = new CategoriesModel();
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) { }

  refreshList(): Observable<any> {
    return this.http.get<any>(`${this.url}/MyCategories`).pipe(
      tap(res => this.list = res.data as CategoriesModel[]),
    );
  }

  postCategory(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.url, this.formData);
  }

  putCategory(): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(this.url, this.formData);
  }

  deleteCategory(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(this.url + '/' + id);
  }

  getPagedCategories(searchTerm: string = '', page: number = 1): Observable<ApiResponse<CategoryPagingDTO>> {
    return this.http.get<ApiResponse<CategoryPagingDTO>>(
      `${this.url}?page=${page}&searchTerm=${searchTerm}`
    );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new CategoriesModel();
    this.formSubmitted = false;
  }

  exportReport(searchTerm: string = ''): Observable<any> {
    const params = { searchTerm };
    return this.http.get(this.url + '/report', {
      responseType: 'blob',
      params: params
    });
  }
}