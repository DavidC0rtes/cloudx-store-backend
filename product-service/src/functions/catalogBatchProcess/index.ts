import { handlerPath } from "@libs/handler-resolver";
import { AWSFunction } from "@libs/lambda";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        maximumConcurrency: 100,
        batchSize: 5,
        arn: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
        },
      },
    },
  ],
} as AWSFunction;
