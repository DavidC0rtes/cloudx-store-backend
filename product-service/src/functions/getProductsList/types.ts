type ProductsTableElement = {
  id: string;
  description?: string;
  title: string;
  price: number;
};

type StocksTableElement = {
  productId: string;
  count: number;
};
