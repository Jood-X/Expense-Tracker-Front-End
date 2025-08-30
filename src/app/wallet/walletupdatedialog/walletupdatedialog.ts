import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletModel } from '../../shared/wallet.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet-update-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './walletupdatedialog.html',
  styles: ``
})
export class WalletUpdateDialog {
  wallet: WalletModel;

  constructor(
    public dialogRef: MatDialogRef<WalletUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WalletModel
  ) {
    this.wallet = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.wallet);
  }
}