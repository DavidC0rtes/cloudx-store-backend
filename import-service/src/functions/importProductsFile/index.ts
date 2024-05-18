import { handlerPath } from "@libs/handler-resolver";
import { AWSFunction } from "@libs/lambda";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/import/{fileName}",
        authorizer: {
          arn: "arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:cloudx-store-authorize-dev-basicAuthorizer",
          type: "token",
        },
      },
    },
  ],
} as AWSFunction;
