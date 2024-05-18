import basicAuthorizer from "@functions/basicAuthorizer";
import type { AWS } from "@serverless/typescript";
const serverlessConfiguration: AWS = {
  service: "cloudx-store-authorize",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
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
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  functions: { basicAuthorizer },
};

module.exports = serverlessConfiguration;
