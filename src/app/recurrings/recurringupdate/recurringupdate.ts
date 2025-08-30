import { Component, Inject } from '@angular/core';
import { RecurringModel } from '../../shared/recurring.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recurringupdate',
  imports: [CommonModule, FormsModule, MatDialogContent],
  templateUrl: './recurringupdate.html',
  styles: ``
})
export class Recurringupdate {
  recurring: RecurringModel;
  categories: any[] = [];
  wallets: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<Recurringupdate>,
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
