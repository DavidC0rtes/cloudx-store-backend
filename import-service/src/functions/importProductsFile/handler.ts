import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { APIGatewayProxyEvent } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event: APIGatewayProxyEvent) => {
  const key = `uploaded/${event.pathParameters?.fileName}`;
  return await createPresignedUrlWithClient({
    region: "us-east-1",
    bucket: "cloudx-store-backend-dev-import",
    key: key,
  });
};

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const main = middyfy(importProductsFile);
