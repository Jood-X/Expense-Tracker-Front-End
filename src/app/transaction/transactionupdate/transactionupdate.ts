import { Component, Inject } from '@angular/core';
import { TransactionModel } from '../../shared/transaction.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactionupdate',
  imports: [CommonModule, FormsModule],
  templateUrl: './transactionupdate.html',
  styles: ``
})
export class Transactionupdate {
  transaction: TransactionModel;
  categories: any[];
  wallets: any[];

  constructor(
    public dialogRef: MatDialogRef<Transactionupdate>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: TransactionModel, categories: any[], wallets: any[] }
  ) {
    this.transaction = { ...data.transaction };
    this.categories = data.categories;
    this.wallets = data.wallets;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.transaction);
  }
}
