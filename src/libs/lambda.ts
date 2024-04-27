import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { apiGatewayResponseMiddleware } from "./middleware";
import type { AWS } from "@serverless/typescript";
import httpHeaderNormalizer from "@middy/http-header-normalizer";

export const middyfy = (handler) => {
  return middy(handler)
    .use(httpHeaderNormalizer())
    .use(middyJsonBodyParser())
    .use(apiGatewayResponseMiddleware());
};
export type AWSFunction = AWS["functions"][0];
