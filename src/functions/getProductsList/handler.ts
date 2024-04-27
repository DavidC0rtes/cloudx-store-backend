import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { scanProductsTable, scanStocksTable } from "@libs/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event: APIGatewayProxyEvent) => {
  const response = await getAvailableProducts();
  return response;
};

const getAvailableProducts = async (): Promise<Product[]> => {
  const productResponse = await scanProductsTable();
  const stocksResponse = await scanStocksTable();

  const products = Object.keys(stocksResponse)
    .map((key) => {
      if (productResponse.hasOwnProperty(key)) {
        return {
          id: productResponse[key]?.id,
          description: productResponse[key]?.description,
          title: productResponse[key]?.title,
          price: productResponse[key]?.price,
          count: stocksResponse[key]?.count,
        };
      }
    })
    .filter((item) => item !== undefined);

  return products;
};

export const main = middyfy(getProductsList);
