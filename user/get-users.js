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
    try {
        const headers = {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS"
        }

        const data = await dynamoDb.query({
            TableName: tableName
        }).promise();

        response = {
            headers: headers,
            statusCode: 200,
            body: JSON.stringify(data.Items)
        }
    } catch (error) {
        console.log(error);
        response = {
            headers: headers,
            statusCode: 500,
            body: JSON.stringify({message: 'Internal Server Error'})
        }
    }

    return response;
};
