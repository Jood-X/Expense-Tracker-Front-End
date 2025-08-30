export class RecurringModel {
    id: number = 0;
    name: string = "";
    categoryId: number = 0;
    walletId: number = 0;
    categoryName?: string="";
    walletName?: string="";
    amount: number = 0;
    repeatInterval: string = ""; 
    intervalValue: number = 0;
    startDate: Date = new Date();
    endDate: Date | null = null;    
}

export interface RecurringPagingDTO {
    recurrings: RecurringModel[];
    pages: number;
    currentPage: number;
}