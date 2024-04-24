import { handlerPath } from "@libs/handler-resolver";
import { AWSFunction } from "@libs/lambda";
import "dotenv/config";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/products",
      },
    },
  ],
} as AWSFunction;
