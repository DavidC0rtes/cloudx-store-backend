import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { createProduct } from "@libs/dynamo";
import { SQSEvent } from "aws-lambda";

const snsClient = new SNSClient({ region: "us-east-1 " });
export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const result = await createProduct(JSON.parse(record.body));
      if (result == 200) {
        return await snsClient.send(
          new PublishCommand({
            Message: record.body,
            TopicArn: process.env.TOPIC_ARN,
          })
        );
      }
      throw new Error(result.message);
    } catch (error) {
      Promise.reject(error);
    }
  }
};
