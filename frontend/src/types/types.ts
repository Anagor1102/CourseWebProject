export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    publishedYear: string;
    coverImage: string;
    pdfFile: string;
  }
  
  export interface User {
    id: number;
    username: string;
    password: string;
    favouriteBooks: number[];
    readBooks: number[];
  }
  