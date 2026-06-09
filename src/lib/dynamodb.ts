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

export async function getItem(pk: string, prefix: string) {
  try {
    const res = await doc.send(
      new GetCommand({ TableName: TABLE, Key: { pk, sk: prefix } })
    );
    return res.Item;
  } catch {
    return null;
  }
}

export async function putItem(pk: string, sk: string, item: Record<string, any>) {
  await doc.send(
    new PutCommand({
      TableName: TABLE,
      Item: { pk, sk, ...item },
    })
  );
}

export async function queryItems(pk: string, prefix: string) {
  const res = await doc.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":prefix": prefix,
      },
    })
  );
  return res.Items || [];
}

export async function updateItem(pk: string, sk: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  if (keys.length === 0) return;

  const expr = keys.map((k) => `#${k} = :${k}`).join(", ");
  const attrNames = Object.fromEntries(keys.map((k) => [`#${k}`, k]));
  const attrValues = Object.fromEntries(keys.map((k) => [`:${k}`, updates[k]]));

  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { pk, sk },
      UpdateExpression: `SET ${expr}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
    })
  );
}

export async function deleteItem(pk: string, sk: string) {
  await doc.send(
    new DeleteCommand({ TableName: TABLE, Key: { pk, sk } })
  );
}

export async function incrementAttribute(
  pk: string,
  sk: string,
  attr: string
) {
  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { pk, sk },
      UpdateExpression: `ADD #attr :one`,
      ExpressionAttributeNames: { "#attr": attr },
      ExpressionAttributeValues: { ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );
}
