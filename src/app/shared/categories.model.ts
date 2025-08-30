export class CategoriesModel {
    id: number = 0;
    name: string = "";
    limit: number = 0;
    type: string = ""; 
}

export interface CategoryPagingDTO {
    categories: CategoriesModel[];
    pages: number;
    currentPage: number;
}
