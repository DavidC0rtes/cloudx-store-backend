import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

  await parseAndLog(response.Body);
};

const parseAndLog = async (stream) => {
  const parser = stream.pipe(parse());

  for await (const record of parser) {
    console.info(`Received record ${record}`);
  }
};

export const main = importFileParser;
