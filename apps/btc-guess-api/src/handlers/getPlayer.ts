import { GetCommand } from "@aws-sdk/lib-dynamodb";
import type { PlayerData } from "shared-types";
import { dynamo, PLAYERS_TABLE } from "../utils/dynamodb";
import { ok, badRequest, serverError } from "../utils/response";

export const handler = async (event: any) => {
  try {
    const playerId = event.pathParameters?.id;

    if (!playerId) {
      return badRequest("playerId is required");
    }

    const { Item } = await dynamo.send(
      new GetCommand({
        TableName: PLAYERS_TABLE,
        Key: { playerId },
      }),
    );

    if (!Item) {
      return badRequest("Player not found");
    }

    return ok(Item as PlayerData);
  } catch (error) {
    console.error("getPlayer error:", error);
    return serverError("Failed to get player");
  }
};
