import "source-map-support/register";
import * as aws from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";

aws.config.update({ region: "us-east-1" });
const dynamoDb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME ? process.env.TABLE_NAME : "";

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
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  };

  try {
    const userId = event.pathParameters ? event.pathParameters.id : "";

    const data = await dynamoDb
      .get({
        TableName: tableName,
        Key: {
          userId: userId,
        },
      })
      .promise();

    if (data.Item) {
      const data = await dynamoDb
        .delete({
          TableName: tableName,
          Key: {
            userId: userId,
          },
        })
        .promise();

      response = {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({ message: "User deleted successfully" }),
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
