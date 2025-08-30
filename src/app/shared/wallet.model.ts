export class WalletModel {
    id: number = 0;
    name: string = "";
    balance: number = 0; 
    createdBy?: string = "";
    createDate?: string = "";
}

export interface WalletPagingDTO
{
    wallets: WalletModel[];
    pages: number;
    currentPage: number;
}


