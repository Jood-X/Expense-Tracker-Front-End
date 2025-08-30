import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RecurringService } from '../shared/recurring.service';
import { RecurringModel } from '../shared/recurring.model';
import { Recurringadd } from './recurringadd/recurringadd';
import { Recurringupdate } from './recurringupdate/recurringupdate';
import { Recurringdelete } from './recurringdelete/recurringdelete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../shared/categories.service';
import { WalletService } from '../shared/walletService';
import { CategoriesModel } from '../shared/categories.model';
import { WalletModel } from '../shared/wallet.model';
import { ApiResponse } from '../shared/ApiResponse';

@Component({
  selector: 'app-recurrings',
  imports: [FormsModule, CommonModule],
  templateUrl: './recurrings.html',
  styles: ``
})
export class Recurrings {
  pagedRecurring: RecurringModel[] = [];
  recurrings: RecurringModel[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  categories: CategoriesModel[] = [];
  wallets: WalletModel[] = [];

  constructor(
    public service: RecurringService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public categoryService: CategoriesService,
    public walletService: WalletService,

  ) {
    this.categories = this.categoryService.list;
    this.wallets = this.walletService.list;
  }

  ngOnInit(): void {
    this.categoryService.refreshList().subscribe(() => {
      this.categories = this.categoryService.list;
    });
    this.walletService.refreshList().subscribe(() => {
      this.wallets = this.walletService.list;
    });
    this.loadPagedRecurrings();
  }

  loadPagedRecurrings(page: number = 1) {
    this.service.getPagedRecurrings(page).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedRecurring = res.data.recurrings;
          this.totalPages = res.data.pages;
          this.currentPage = res.data.currentPage;
        } else {
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
      this.loadPagedRecurrings(page);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(Recurringadd, {
      width: '400px',
      data: {
        recurring: {},
        categories: this.categories,
        wallets: this.wallets
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.formData = result;
        this.service.postRecurring().subscribe({
          next: (res: ApiResponse<string>) => {
            if (res.status) {
              this.loadPagedRecurrings();
              this.toastr.success('Inserted Successfully', 'New Recurring');
            } else {
              this.toastr.error("Failed to insert recurring" + res.message);
            }
          },
          error: err => {
            this.toastr.error('An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }

  openUpdateDialog(recurring: RecurringModel) {
    const updateRecurring = this.pagedRecurring.find(r => r.id === recurring.id);
    if (updateRecurring) {
      const dialogRef = this.dialog.open(Recurringupdate, {
        width: '400px',
        data: {
          recurring: { ...updateRecurring },
          categories: this.categories,
          wallets: this.wallets
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.formData = result;
          this.service.putRecurring().subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedRecurrings();
                this.toastr.info('Updated Successfully', 'Recurring Update');
              } else {
                this.toastr.error("Failed to update recurring" + res.message);
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


  openDeleteDialog(recurring: RecurringModel) {
    const deleteRecurring = this.pagedRecurring.find(r => r.id === recurring.id);
    if (deleteRecurring) {
      const dialogRef = this.dialog.open(Recurringdelete, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this recurring?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.deleteRecurring(deleteRecurring.id).subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedRecurrings();
                this.toastr.error('Deleted Successfully', 'Recurring Delete');
              } else {
                this.toastr.error("Failed to delete recurring" + res.message);
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
    this.service.exportReport().subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'RecurringsReport.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the report:', error);
      }
    );
  }
}