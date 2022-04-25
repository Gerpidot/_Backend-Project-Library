export interface Book {
  id: number;
  title: string;
  author:{
    id:number;
    fullname: string;
  } ;
  isBorrowed: boolean;
  borrowedAt:string;
  
}
