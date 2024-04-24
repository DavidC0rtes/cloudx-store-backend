import { handlerPath } from "@libs/handler-resolver";
import { AWSFunction } from "@libs/lambda";

console.log(`points to ${handlerPath(__dirname)}/handler.main`);
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:custom.bucket}",
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [
          {
            prefix: "uploaded/",
          },
          {
            suffix: ".csv",
          },
        ],
      },
    },
  ],
} as AWSFunction;
