import * as aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

aws.config.update({ region: "us-east-1" });

export default class CustomDynamoClient {
  table: string;
  docClient: aws.DynamoDB.DocumentClient;

  constructor(table = process.env.TABLE_NAME) {
    this.docClient = new aws.DynamoDB.DocumentClient();
    this.table = table ? table : "";
  }

  async create(item: any) {
    const id = uuidv4();
    item.id = id;
    return await this.update(item);
  }

  async read(id: any) {
    const params = {
      TableName: this.table,
      Key: { id: id },
    };
    const data = await this.docClient.get(params).promise();

    return data.Item;
  }

  async readAll() {
    const data = await this.docClient.scan({ TableName: this.table }).promise();

    return data.Items;
  }

  async update(item: any) {
    const params = {
      TableName: this.table,
      Item: item,
    };

    return await this.docClient.put(params).promise();
  }

  async delete(id: any) {
    const params = {
      TableName: this.table,
      Key: { id: id },
    };

    return await this.docClient.delete(params).promise();
  }
}
