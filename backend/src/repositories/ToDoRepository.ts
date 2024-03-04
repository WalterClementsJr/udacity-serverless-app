import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {Types} from "aws-sdk/clients/s3";
import {TodoItem} from "../models/TodoItem";
import {TodoItemUpdate} from "../models/ToDoItemUpdate";
import {createLogger} from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('ToDoRepository');

export class ToDoRepository {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({signatureVersion: "v4"}),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {
  }

  async getAllToDo(userId: string): Promise<TodoItem[]> {
    logger.info("Getting all todo");

    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await this.docClient.query(params).promise();
    logger.info(result);
    const items = result.Items;

    return items as TodoItem[];
  }

  async createToDo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("Creating new todo");

    const params = {
      TableName: this.todoTable,
      Item: todoItem,
    };

    const result = await this.docClient.put(params).promise();
    logger.info(result);

    return todoItem as TodoItem;
  }

  async updateToDo(
    todoUpdate: TodoItemUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoItemUpdate> {
    logger.info("Updating todo");

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: "set #a = :a, #b = :b, #c = :c, #d = :d",
      ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done",
        "#d": "attachmentUrl",
      },
      ExpressionAttributeValues: {
        ":a": todoUpdate["name"],
        ":b": todoUpdate["dueDate"],
        ":c": todoUpdate["done"],
        ":d": todoUpdate["attachmentUrl"],
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await this.docClient.update(params).promise();
    logger.info(result);
    const attributes = result.Attributes;

    return attributes as TodoItemUpdate;
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    logger.info("Deleting todo");

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    };

    const result = await this.docClient.delete(params).promise();
    logger.info(result);

    return "";
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    logger.info("Generating URL");

    const url = this.s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000,
    });
    logger.info(url);

    return url as string;
  }
}
