import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import type { PlayerData } from "shared-types";
import { dynamo, PLAYERS_TABLE } from "../utils/dynamodb";
import { ok, serverError } from "../utils/response";

export const handler = async (event: any) => {
  try {
    const cookieHeader = event.headers?.Cookie ?? "";
    const cookieId = parseCookie(cookieHeader, "playerId");

    const bodyId = JSON.parse(event.body ?? "{}").playerId;

    const existingId = cookieId || bodyId;

    if (existingId) {
      const { Item } = await dynamo.send(
        new GetCommand({
          TableName: PLAYERS_TABLE,
          Key: { playerId: existingId },
        }),
      );

      if (Item) {
        return {
          ...ok(Item as PlayerData),
          multiValueHeaders: {
            "Set-Cookie": [
              `playerId=${existingId}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
            ],
          },
        };
      }
    }

    const playerId = existingId || crypto.randomUUID();
    const newPlayerData = {
      playerId,
      score: 0,
      currentGuess: null,
      createdAt: Date.now(),
    };

    await dynamo.send(
      new PutCommand({
        TableName: PLAYERS_TABLE,
        Item: newPlayerData,
      }),
    );

    return {
      ...ok(newPlayerData),
      multiValueHeaders: {
        "Set-Cookie": [
          `playerId=${playerId}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
        ],
      },
    };
  } catch (error) {
    console.error("createPlayer error:", error);
    return serverError("Failed to create player");
  }
};

const parseCookie = (cookieHeader: string, key: string): string | undefined => {
  const match = cookieHeader.match(new RegExp(`${key}=([^;]+)`));
  return match ? match[1] : undefined;
};
