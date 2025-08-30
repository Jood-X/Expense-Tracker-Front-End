import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/categories.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriesModel } from '../shared/categories.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Categoryadd } from './categoryadd/categoryadd';
import { Categoryupdate } from './categoryupdate/categoryupdate';
import { Categorydelete } from './categorydelete/categorydelete';
import { ApiResponse } from '../shared/ApiResponse';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styles: ``
})
export class Category implements OnInit {
  searchTerm: string = '';
  pagedCategories: CategoriesModel[] = [];
  categories: CategoriesModel[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public service: CategoriesService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPagedCategories();
  }

  loadPagedCategories(page: number = 1) {
    this.service.getPagedCategories('', page).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedCategories = res.data.categories;
          this.totalPages = res.data.pages;
          this.currentPage = res.data.currentPage;
        }
        else {
          this.toastr.error("Error" + res.message);
        }
      },
      error: err => {
        this.toastr.error('An unexpected error occurred', 'Error');
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPagedCategories(page);
    }
  }

  search() {
    this.currentPage = 1;
    this.service.getPagedCategories(this.searchTerm).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedCategories = res.data.categories;
          this.totalPages = res.data.pages;
          this.currentPage = res.data.currentPage;
        }
        else {
          this.toastr.error("Error" + res.message);
        }
      },
      error: err => {
        this.toastr.error('An unexpected error occurred', 'Error');
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(Categoryadd, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.formData = result;
        this.service.postCategory().subscribe({
          next: (res: ApiResponse<string>) => {
            if (res.status) {
              this.loadPagedCategories();
              this.toastr.success('Inserted Successfully', 'New Category');
            } else {
              this.toastr.error("Failed to insert category" + res.message);
            }
          },
          error: err => {
            this.toastr.error('An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }

  openUpdateDialog(category: CategoriesModel) {
    const updateCategory = this.pagedCategories.find(c => c.id === category.id);
    if (updateCategory) {
      const dialogRef = this.dialog.open(Categoryupdate, {
        width: '400px',
        data: { ...updateCategory }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.formData = result;
          this.service.putCategory().subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedCategories();
                this.toastr.info('Updated Successfully', 'Category Update');
              } else {
                this.toastr.error("Failed to update category" + res.message);
              }
            },
            error: err => {
              this.toastr.error('An unexpected error occurred', 'Error');
            }
          });
        }
      });
    }
  }

  openDeleteDialog(category: CategoriesModel) {
    const deleteCategory = this.pagedCategories.find(c => c.id === category.id);
    if (deleteCategory) {
      const dialogRef = this.dialog.open(Categorydelete, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this category?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.deleteCategory(deleteCategory.id).subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedCategories();
                this.toastr.error('Deleted Successfully', 'Category Delete');
              } else {
                this.toastr.error("Failed to delete category" + res.message);
              }
            },
            error: err => {
              this.toastr.error('An unexpected error occurred', 'Error');
            }
          });
        }
      });
    }
  }

  exportReport() {
    this.service.exportReport(this.searchTerm).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CategoriesReport.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the report:', error);
      }
    );
  }
}