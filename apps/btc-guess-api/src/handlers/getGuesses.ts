import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo, GUESSES_TABLE } from "../utils/dynamodb";
import { ok, badRequest, serverError } from "../utils/response";

export const handler = async (event: any) => {
  try {
    const playerId = event.pathParameters?.id;

    if (!playerId) {
      return badRequest("playerId is required");
    }

    const { Items } = await dynamo.send(
      new QueryCommand({
        TableName: GUESSES_TABLE,
        KeyConditionExpression: "playerId = :playerId",
        ExpressionAttributeValues: { ":playerId": playerId },
        ScanIndexForward: false,
      }),
    );

    return ok(Items ?? []);
  } catch (error) {
    console.error("getGuesses error:", error);
    return serverError("Failed to get guesses");
  }
};
