import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categorydelete',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categorydelete.html',
  styles: ``
})

export class Categorydelete {
  constructor(
    private dialogRef: MatDialogRef<Categorydelete>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}