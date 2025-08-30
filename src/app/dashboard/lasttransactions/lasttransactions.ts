import { Component } from '@angular/core';
import { TransactionModel } from '../../shared/transaction.model';
import { TransactionService } from '../../shared/transaction.service';
import { CommonModule } from '@angular/common';
import { CategoriesModel } from '../../shared/categories.model';
import { WalletModel } from '../../shared/wallet.model';
import { CategoriesService } from '../../shared/categories.service';
import { WalletService } from '../../shared/walletService';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-lasttransactions',
  imports: [FormsModule, CommonModule],
  templateUrl: './lasttransactions.html',
  styles: ``
})
export class Lasttransactions {
  transactions: TransactionModel[] = [];
  lastTransactions: TransactionModel[] = [];
  categories: CategoriesModel[] = [];
  wallets: WalletModel[] = [];

  constructor(
    public service: TransactionService,
    public categoryService: CategoriesService,
    public walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.categoryService.refreshList().subscribe(() => {
      this.categories = this.categoryService.list;
      this.walletService.refreshList().subscribe(() => {
        this.wallets = this.walletService.list;
        this.service.refreshList().subscribe(() => {
          this.transactions = this.service.list;

          this.transactions.forEach(transaction => {
            transaction.categoryName = this.categories.find(c => c.id === transaction.categoryId)?.name || 'Unknown';
            transaction.walletName = this.wallets.find(w => w.id === transaction.walletId)?.name || 'Unknown';
          });

          this.lastTransactions = this.transactions
            .sort((a, b) => new Date(b.createDate!).getTime() - new Date(a.createDate!).getTime())
            .slice(0, 3);
        });
      });
    });
  }
}
