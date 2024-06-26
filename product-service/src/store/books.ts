type Book = {
  id: number;
  title: string;
  description: string;
  price: number;
  author?: string;
  inStock: boolean;
};

export const books: Record<number, Book> = {
  1: {
    id: 1,
    title: "The Madman's Tale",
    description: "",
    author: "John",
    price: 12,
    inStock: true,
  },
  2: {
    id: 2,
    title: "Crime and Punishment",
    description: "",
    author: "Fyodor",
    price: 12,
    inStock: true,
  },
  3: {
    id: 3,
    title: "The Bible",
    description: "",
    price: 2,
    inStock: true,
  },
};
