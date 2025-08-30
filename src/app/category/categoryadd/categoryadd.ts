import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoriesModel } from '../../shared/categories.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categoryadd',
  imports: [FormsModule],
  templateUrl: './categoryadd.html',
  styles: ``
})
export class Categoryadd {
 category: CategoriesModel;

  constructor(
    public dialogRef: MatDialogRef<Categoryadd>,
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