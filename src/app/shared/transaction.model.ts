export class TransactionModel {
    id: number = 0;
    name: string = "";
    amount: number = 0; 
    createdBy?: string = "";
    createDate?: string = "";
    categoryId: number = 0;
    walletId: number = 0;
    categoryName?: string = "";
    walletName?: string = "";
    type?: string = "";
    note?: string = "";
}

export interface TransactionPagingDTO
{
    transactions: TransactionModel[];
    pages: number;
    currentPage: number;
}

export class TransactionFilter
{
    page : number = 1;
    dateFrom? : string = "";
    dateTo? : string = "";
    categoryId?: string= "" ;
    categoryName?: string= "";
    walletId?: string= "" ;
    walletName?: string= "";
    keyword?: string = "";
}