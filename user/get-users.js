const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
const dynamoDb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

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
exports.lambdaHandler = async (event, context) => {
    const data = await dynamoDb.get({
        TableName: tableName
    }).promise();

    if (data.Item) {
        response = {
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }
    } else {
        throw new Error('User not found');
    }

    return response;
};
