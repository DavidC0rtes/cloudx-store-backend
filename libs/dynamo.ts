import "dotenv/config";
import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export const client = new DynamoDBClient({
  //endpoint: 'http://localhost:8000',
  region: "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);

type CreateProductRequest = {
  title: string;
  description?: string;
  price: number;
  count: number;
};

export const createProduct = async (product: CreateProductRequest) => {
  try {
    const generatedId = randomUUID();

    const productsResponse = await docClient.send(
      new PutCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
          id: generatedId,
          title: product.title,
          description: product.description,
          price: product.price,
        },
      })
    );

    const stocksResponse = await docClient.send(
      new PutCommand({
        TableName: process.env.STOCKS_TABLE,
        Item: {
          product_id: generatedId,
          count: product.count,
        },
      })
    );

    const response = await Promise.all([productsResponse, stocksResponse]);

    if (!response.every((out) => out.$metadata.httpStatusCode == 200)) {
      throw new Error("Error while creating product");
    }
    return 200;
  } catch (error) {
    return {
      status: 400,
      message: `Bad request ${JSON.stringify(error)}`,
    };
  }
};

export const queryProductById = async (id: string) => {
  const command = new GetItemCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: {
        S: id,
      },
    },
  });
  const response = await client.send(command);
  return response?.Item;
};

export const queryProductStock = async (id: string) => {
  const command = new GetItemCommand({
    TableName: process.env.STOCKS_TABLE,
    Key: {
      product_id: {
        S: id,
      },
    },
  });
  const response = await client.send(command);
  return response?.Item?.count;
};

export const scanProductsTable = async (): Promise<
  Record<string, ProductsTableElement>
> => {
  const command = new ScanCommand({
    TableName: process.env.PRODUCTS_TABLE,
  });

  const response = await client.send(command);

  return response?.Items.reduce(
    (acc: Record<string, ProductsTableElement>, item) => ({
      ...acc,
      [item.id?.S]: DBProductToBackendObject(item),
    }),
    {} as Record<string, ProductsTableElement>
  );
};

export const scanStocksTable = async (): Promise<
  Record<string, StocksTableElement>
> => {
  const command = new ScanCommand({
    TableName: process.env.STOCKS_TABLE,
  });

  const response = await client.send(command);

  return response?.Items.reduce(
    (acc: Record<string, StocksTableElement>, item) => ({
      ...acc,
      [item.product_id?.S]: mapDBStockResponse(item),
    }),
    {} as Record<string, StocksTableElement>
  );
};

const mapDBStockResponse = (
  response: Record<string, AttributeValue>
): StocksTableElement => {
  return {
    productId: response?.product_id?.S,
    count: Number(response?.count?.N),
  };
};

const DBProductToBackendObject = (
  item: Record<string, AttributeValue>
): ProductsTableElement => {
  return {
    id: item.id?.S,
    title: item.title?.S,
    description: item.description?.S,
    price: Number(item.price?.N),
  };
};
