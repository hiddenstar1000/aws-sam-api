// import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
const url = "http://checkip.amazonaws.com/";
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext
) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  try {
    response = {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify({
        message: "OTEB API Serving ...",
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
