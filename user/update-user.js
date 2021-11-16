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
        const userId = event.pathParameters.id;

        const data = await dynamoDb.get({
            TableName: tableName,
            Key: {
                userId: userId
            }
        }).promise();

        if (data.Item) {
            const {firstName, lastName, email} = JSON.parse(event.body);
            
            const item = {
                userId: userId,
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
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT"
                },
                statusCode: 200,
                body: JSON.stringify({message: 'User updated successfully'})
            }
        } else {
            response = {
                headers: {
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT"
                },
                statusCode: 404,
                body: JSON.stringify({message: 'User not found'})
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
