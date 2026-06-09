import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const doc = DynamoDBDocumentClient.from(client);

const TABLE = process.env.DYNAMODB_TABLE || "linkbio";

export async function getItem(PK: string, SK: string) {
  try {
    const res = await doc.send(
      new GetCommand({ TableName: TABLE, Key: { PK, SK } })
    );
    return res.Item;
  } catch {
    return null;
  }
}

export async function putItem(PK: string, SK: string, item: Record<string, any>) {
  await doc.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK, SK, ...item },
    })
  );
}

export async function queryItems(PK: string, prefix: string) {
  const res = await doc.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": PK,
        ":prefix": prefix,
      },
    })
  );
  return res.Items || [];
}

export async function updateItem(PK: string, SK: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  if (keys.length === 0) return;

  const expr = keys.map((k) => `#${k} = :${k}`).join(", ");
  const attrNames = Object.fromEntries(keys.map((k) => [`#${k}`, k]));
  const attrValues = Object.fromEntries(keys.map((k) => [`:${k}`, updates[k]]));

  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK, SK },
      UpdateExpression: `SET ${expr}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
    })
  );
}

export async function deleteItem(PK: string, SK: string) {
  await doc.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK, SK } })
  );
}

export async function incrementAttribute(
  PK: string,
  SK: string,
  attr: string
) {
  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK, SK },
      UpdateExpression: `ADD #attr :one`,
      ExpressionAttributeNames: { "#attr": attr },
      ExpressionAttributeValues: { ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );
}
