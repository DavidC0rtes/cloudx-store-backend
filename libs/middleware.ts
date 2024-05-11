import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "./api-gateway";
export const apiGatewayResponseMiddleware = () => {
  const after: middy.MiddlewareFn<APIGatewayProxyEvent, any> = async (req) => {
    if (req.response === undefined || req.response === null) {
      return;
    }

    console.log(`Request for:${req.context.functionName}`);
    console.log(`Request params:${JSON.stringify(req.event.pathParameters)}`);
    console.log(`Request body:${req.event.body}`);

    const existingKeys = Object.keys(req.response);
    const isHttpResponse =
      existingKeys.includes("statusCode") &&
      existingKeys.includes("headers") &&
      existingKeys.includes("body");

    if (isHttpResponse) {
      return;
    }

    req.response = formatJSONResponse(req.response, 200);
  };

  const onError: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    const { error } = request;
    console.error(error);
    let statusCode = 500;
    if (error instanceof TypeError) {
      statusCode = 400;
    }
    request.response = formatJSONResponse({ message: error?.name }, statusCode);
  };

  return { after, onError };
};
