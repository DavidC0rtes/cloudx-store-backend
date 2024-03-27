import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { books } from 'src/store/books';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters
  const { message, status } = findProduct(parseInt(productId))
  return formatJSONResponse({
    message: message,
    event,
  }, status);
};

const findProduct = (id: number) => {
  const product = books[id]
  if (product == null) {
    return { status: 404, message: `Can't find product with id: ${id}`}
  }
  return {status: 200, message: product}
} 
export const main = middyfy(getProductById);
