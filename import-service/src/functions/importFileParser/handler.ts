import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

import { S3Event } from "aws-lambda";
import { parse } from "csv-parse";

const client = new S3Client({ region: "us-east-1" });

const importFileParser = async (event: S3Event) => {
  const bucket = event.Records[0].s3.bucket;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const params = {
    Bucket: bucket.name,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await client.send(command);

  await parseAndSendToQueue(response.Body);
};

const sqsClient = new SQSClient({});

const parseAndSendToQueue = async (stream) => {
  const parser = stream.pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      bom: true,
    })
  );

  for await (const record of parser) {
    await sendToQueue(JSON.stringify(record));
  }
};

const sendToQueue = async (body: string) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: body,
  });

  return await sqsClient.send(command);
};

export const main = importFileParser;
