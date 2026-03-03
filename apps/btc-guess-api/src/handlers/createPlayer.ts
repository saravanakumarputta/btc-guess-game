import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
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
        return ok({ ...Item });
      }
    }

    const playerId = crypto.randomUUID();

    await dynamo.send(
      new PutCommand({
        TableName: PLAYERS_TABLE,
        Item: {
          playerId,
          score: 0,
          currentGuess: null,
          createdAt: Date.now(),
        },
      }),
    );

    return {
      ...ok({ playerId, score: 0, currentGuess: null }),
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
