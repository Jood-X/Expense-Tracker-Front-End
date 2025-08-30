import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionFilter, TransactionModel } from '../shared/transaction.model';
import { TransactionService } from '../shared/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Transactionadd } from './transactionadd/transactionadd';
import { Transactionupdate } from './transactionupdate/transactionupdate';
import { Transactiondelete } from './transactiondelete/transactiondelete';
import { CategoriesService } from '../shared/categories.service';
import { WalletService } from '../shared/walletService';
import { CategoriesModel } from '../shared/categories.model';
import { WalletModel } from '../shared/wallet.model';
import { ApiResponse } from '../shared/ApiResponse';

@Component({
  selector: 'app-transaction',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction.html',
  styles: ``
})
export class Transaction {
  filter: TransactionFilter = { page: 1, categoryId: "", keyword: "", dateFrom: "", dateTo: "", walletId: "" };
  pagedTransactions: TransactionModel[] = [];
  transactions: TransactionModel[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  categories: CategoriesModel[] = [];
  wallets: WalletModel[] = [];

  constructor(
    public service: TransactionService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public categoryService: CategoriesService,
    public walletService: WalletService
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
    this.loadPagedTransaction(this.filter);
  }

  loadPagedTransaction(filter: TransactionFilter) {
    this.service.getPagedTransaction(this.filter).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedTransactions = res.data.transactions;
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
      this.filter.page = page;
      this.loadPagedTransaction(this.filter);
    }
  }

  search() {
    this.currentPage = 1;
    this.service.getPagedTransaction(this.filter).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedTransactions = res.data.transactions;
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
    const dialogRef = this.dialog.open(Transactionadd, {
      width: '400px',
      data: {
        transaction: {},
        categories: this.categories,
        wallets: this.wallets
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.formData = result;
        this.service.formData.createdBy = localStorage.getItem('userName') || '';
        this.service.formData.categoryName = this.categoryService.list.find(c => c.id === this.service.formData.categoryId)?.name || '';
        this.service.formData.walletName = this.walletService.list.find(w => w.id === this.service.formData.walletId)?.name || '';
        this.service.postTransaction().subscribe({
          next: (res: ApiResponse<string>) => {
            if (res.status === true) {
              this.loadPagedTransaction(this.filter);
              this.toastr.success('Inserted Successfully', 'New Transaction');
            }
            else {
              this.toastr.error("Failed to insert transaction" + res.message);
            }
          },
          error: err => {
            this.toastr.error('An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }

  openUpdateDialog(transaction: TransactionModel) {
    const updateTransaction = this.pagedTransactions.find(r => r.id === transaction.id);
    if (updateTransaction) {
      const dialogRef = this.dialog.open(Transactionupdate, {
        width: '400px',
        data: {
          transaction: { ...updateTransaction },
          categories: this.categories,
          wallets: this.wallets
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.formData = result;
          this.service.putTransaction(updateTransaction.id, result).subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status === true) {
                this.loadPagedTransaction(this.filter);
                this.toastr.info('Updated Successfully', 'Transaction Update');
              }
              else {
                this.toastr.error("Failed to update transaction" + res.message);
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

  openDeleteDialog(transaction: TransactionModel) {
    const deleteTransaction = this.pagedTransactions.find(r => r.id === transaction.id);
    if (deleteTransaction) {
      const dialogRef = this.dialog.open(Transactiondelete, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this recurring?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.deleteTransaction(deleteTransaction.id).subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status === true) {
                this.loadPagedTransaction(this.filter);
                this.toastr.error('Deleted Successfully', 'Recurring Delete');
              }
              else {
                this.toastr.error("Failed to delete transaction" + res.message);
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

  applyFilter() {
    this.filter.page = 1;
    this.loadPagedTransaction(this.filter);
  }

  resetFilter() {
    this.filter = { page: 1, categoryId: '', keyword: '', dateFrom: '', dateTo: '', walletId: '' };
    this.loadPagedTransaction(this.filter);
  }

  exportReport() {
    this.service.exportReport(this.filter).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TransactionsReport.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the report:', error);
      }
    );
  }

}
