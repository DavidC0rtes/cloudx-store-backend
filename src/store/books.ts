type Book = {
    id: number,
    title: string,
    price: string,
    author?: string,
    inStock: boolean
}

export const books: Array<Book> = [
    {
        id: 1,
        title: 'The Madman tale',
        author: 'John',
        price: '$12',
        inStock: true
    },
    {
        id: 2,
        title: 'Crime and punishment',
        author: 'Fyodor',
        price: '$12',
        inStock: true
    },
    {
        id: 3,
        title: 'The bible',
        price: '$2',
        inStock: true
    }
]