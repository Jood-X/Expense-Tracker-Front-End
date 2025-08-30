import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesModel } from '../../shared/categories.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categoryupdate',
  imports: [CommonModule, FormsModule],
  templateUrl: './categoryupdate.html',
  styles: ``
})
export class Categoryupdate {
  category: CategoriesModel;

  constructor(
    public dialogRef: MatDialogRef<Categoryupdate>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriesModel
  ) {
    this.category = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.category);
  }
}