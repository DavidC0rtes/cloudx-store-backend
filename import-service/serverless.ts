import importFileParser from "@functions/importFileParser";
import importProductsFile from "@functions/importProductsFile";
import type { AWS } from "@serverless/typescript";
const serverlessConfiguration: AWS = {
  service: "cloudx-store-import",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=100",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:GetObject", "s3:PutObject"],
            Resource: [
              "arn:aws:s3:::${self:custom.bucket}",
              "arn:aws:s3:::${self:custom.bucket}/*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource:
              "arn:aws:sqs:${opt:region, self:provider.region}:640160916284:catalogItemsQueue*",
          },
        ],
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    bucket: "cloudx-store-backend-dev-import",
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
