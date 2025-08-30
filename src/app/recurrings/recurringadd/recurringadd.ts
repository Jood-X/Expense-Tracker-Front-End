import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { RecurringModel } from '../../shared/recurring.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recurringadd',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogContent
],
  templateUrl: './recurringadd.html',
  styles: ``
})
export class Recurringadd {
  recurring: RecurringModel;
  categories: any[];
  wallets: any[];
  constructor(
    public dialogRef: MatDialogRef<Recurringadd>,
    @Inject(MAT_DIALOG_DATA) public data: {recurring: RecurringModel, categories: any[], wallets: any[] }
  ) {
    this.recurring = { ...data.recurring };
    this.categories = data.categories;
    this.wallets = data.wallets;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.recurring);
  }
}