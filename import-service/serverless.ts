import type { AWS } from '@serverless/typescript';
const serverlessConfiguration: AWS = {
    service: 'cloudx-store-import',
    frameworkVersion: '3',
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        region: 'us-east-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=100',
        },
    },
    package: { individually: true },
}

module.exports = serverlessConfiguration