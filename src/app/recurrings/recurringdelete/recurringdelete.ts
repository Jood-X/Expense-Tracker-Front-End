import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recurringdelete',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recurringdelete.html',
  styles: ``
})
export class Recurringdelete {
  constructor(
    private dialogRef: MatDialogRef<Recurringdelete>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
