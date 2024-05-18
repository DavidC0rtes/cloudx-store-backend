import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from "aws-lambda";

enum Effects {
  Allow,
  Deny,
}

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent
) => {
  console.info("Event:", event);
  const [_, decoded] = Buffer.from(
    event.authorizationToken.split(" ")[1],
    "base64"
  )
    .toString()
    .split(":");

  return decoded === process.env.DAVIDC0RTES
    ? generatePolicy("user", Effects.Allow, event.methodArn)
    : generatePolicy("user", Effects.Deny, event.methodArn);
};

const generatePolicy = (
  principalId: string,
  effect: Effects,
  arn: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: Effects[effect],
          Resource: arn,
        },
      ],
    },
  };
};

export const main = basicAuthorizer;
