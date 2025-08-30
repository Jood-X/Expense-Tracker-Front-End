import { Component, OnInit } from '@angular/core';
import { WalletService } from '../shared/walletService';
import { CommonModule } from '@angular/common';
import { WalletModel } from '../shared/wallet.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { WalletUpdateDialog } from './walletupdatedialog/walletupdatedialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from '../shared/paginatorintl';
import { Walletadd } from './walletadd/walletadd';
import { Walletdelete } from './walletdelete/walletdelete';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../shared/ApiResponse';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.html',
  styles: ``,
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntl }],
})
export class Wallet implements OnInit {
  searchTerm: string = '';
  pagedWallets: WalletModel[] = [];
  wallets: WalletModel[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public service: WalletService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadPagedWallets();
  }

  loadPagedWallets(page: number = 1) {
    this.service.getPagedWallets('', page).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedWallets = res.data.wallets;
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
      this.loadPagedWallets(page);
    }
  }

  search() {
    this.currentPage = 1;
    this.service.getPagedWallets(this.searchTerm).subscribe({
      next: (res) => {
        if (res.status) {
          this.pagedWallets = res.data.wallets;
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
    const dialogRef = this.dialog.open(Walletadd, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.formData = result;
        this.service.postWallet().subscribe({
          next: (res: ApiResponse<string>) => {
            if (res.status) {
              this.loadPagedWallets();
              this.toastr.success('Inserted Successfully', 'New Wallet')
            } else {
              this.toastr.error("Failed to insert wallet" + res.message);
            }
          },
          error: err => {
            this.toastr.error('An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }

  openUpdateDialog(wallet: WalletModel) {
    const updatewallet = this.pagedWallets.find(w => w.id === wallet.id);
    if (updatewallet) {
      const dialogRef = this.dialog.open(WalletUpdateDialog, {
        width: '400px',
        data: { ...updatewallet }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.formData = result;
          this.service.putWallet().subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedWallets();
                this.toastr.info('Updated Successfully', 'Wallet Update');
              } else {
                this.toastr.error("Failed to update wallet" + res.message);
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

  openDeleteDialog(wallet: WalletModel) {
    const deletewallet = this.pagedWallets.find(w => w.id === wallet.id);
    if (deletewallet) {
      const dialogRef = this.dialog.open(Walletdelete, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this wallet?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.deleteWallet(deletewallet.id).subscribe({
            next: (res: ApiResponse<string>) => {
              if (res.status) {
                this.loadPagedWallets();
                this.toastr.error('Deleted Successfully', 'Wallet Delete');
              } else {
                this.toastr.error("Failed to delete wallet" + res.message);
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
        a.download = 'WalletsReport.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.toastr.error('Error downloading the report', error);
      }
    );
  }
}