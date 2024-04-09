import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { client } from '@libs/dynamo';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import schema from './schema';
import { randomUUID } from 'crypto';

const docClient = DynamoDBDocumentClient.from(client);

type CreateProductRequest = {
    title: string,
    description?: string,
    price: number,
    count: number
  }

const createProduct:ValidatedEventAPIGatewayProxyEvent<typeof schema> = async(event) => {
    const req:CreateProductRequest = {
        title: event.body.title,
        price: event.body.price,
        description: event.body.description,
        count: event.body.count
    }

    const generatedId = randomUUID();
    
    const response1 = await docClient.send(new PutCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
                id: generatedId,
                title: req.title,
                description: req.description,
                price: req.price
            }
    }))

    const response2 = await docClient.send(new PutCommand({
        TableName: process.env.STOCKS_TABLE,
        Item: {
            product_id: generatedId,
            count: req.count
        }
    }))

    const response = Promise.all([response1, response2])

    if (!(await response).every(out => out.$metadata.httpStatusCode==200)) {
        throw new Error("Error while creating product")
    }

    return response
}


export const main = middyfy(createProduct);