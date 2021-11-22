import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import CustomMondoClient from "../utils/mongodb";

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
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
  };

  try {
    const id = event.pathParameters ? event.pathParameters.id : "";
    const client = new CustomMondoClient();

    const data = await client.read("user", id);

    if (data) {
      const { firstName, lastName, email } = JSON.parse(event.body as string);

      const item = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };

      const data = await client.update("user", item, id);

      response = {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({ message: "User updated successfully" }),
      };
    } else {
      response = {
        headers: headers,
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }

  return response;
};
