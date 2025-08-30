import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletModel } from '../../shared/wallet.model';

@Component({
  selector: 'app-walletadd',
  imports: [FormsModule],
  templateUrl: './walletadd.html',
  styles: ``
})
export class Walletadd {
  wallet: WalletModel;

  constructor(
    public dialogRef: MatDialogRef<Walletadd>,
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