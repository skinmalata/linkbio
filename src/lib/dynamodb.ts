import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE || "linkbio";

export async function getItem(pk: string, sk: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );
  return result.Item;
}

export async function putItem(item: Record<string, unknown>) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );
}

export async function deleteItem(pk: string, sk: string) {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );
}

export async function queryItems(pk: string, skPrefix?: string) {
  const params: any = {
    TableName: TABLE_NAME,
    KeyConditionExpression: skPrefix
      ? "PK = :pk AND begins_with(SK, :sk)"
      : "PK = :pk",
    ExpressionAttributeValues: skPrefix
      ? { ":pk": pk, ":sk": skPrefix }
      : { ":pk": pk },
  };
  const result = await docClient.send(new QueryCommand(params));
  return result.Items || [];
}

export async function updateItem(
  pk: string,
  sk: string,
  updates: Record<string, unknown>
) {
  const keys = Object.keys(updates);
  const expression = keys
    .map((key, i) => `#${key} = :${key}`)
    .join(", ");
  const expressionAttributeNames = keys.reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {}
  );
  const expressionAttributeValues = keys.reduce(
    (acc, key) => ({ ...acc, [`:${key}`]: updates[key] }),
    {}
  );

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${expression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );
}

export async function incrementAttribute(
  pk: string,
  sk: string,
  attribute: string,
  amount: number = 1
) {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `ADD #attr :val`,
      ExpressionAttributeNames: { "#attr": attribute },
      ExpressionAttributeValues: { ":val": amount },
    })
  );
}

export { docClient, TABLE_NAME };
