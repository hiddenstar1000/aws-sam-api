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
        const {firstName, lastName, email} = JSON.parse(event.body);
        const item = {
            firstName: firstName,
            lastName: lastName,
            email: email
        }

        const data = await dynamoDb.put({
            TableName: tableName,
            Item: item
        }).promise();

        response = {
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            statusCode: 201,
            body: JSON.stringify(data.Item)
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
