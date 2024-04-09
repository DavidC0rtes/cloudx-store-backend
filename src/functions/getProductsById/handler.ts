import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { queryProductById, queryProductStock } from '@libs/dynamo';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event:APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters
  const response = await findProduct(productId)
  return response
};

const findProduct = async (id: string) => {
  const response = await queryProductById(id)
  const stockResponse = await queryProductStock(id)

  if (!response || !stockResponse) {
    throw new Error(`Can't find product with id: ${id}`)
  }

  const product:Product = {
    id: response.id.S,
    title: response.title.S,
    description: response?.description?.S,
    price: Number(response.price.N),
    count: Number(stockResponse?.N)
  }

  return product
} 
export const main = middyfy(getProductById);
