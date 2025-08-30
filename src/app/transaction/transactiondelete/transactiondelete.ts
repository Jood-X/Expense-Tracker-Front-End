import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transactiondelete',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transactiondelete.html',
  styles: ``
})
export class Transactiondelete {
constructor(
    private dialogRef: MatDialogRef<Transactiondelete>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
