import { GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo, PLAYERS_TABLE, GUESSES_TABLE } from "../utils/dynamodb";
import { fetchBTCPrice } from "../utils/btcPrice";
import { ok, badRequest, serverError } from "../utils/response";

export const handler = async (event: any) => {
  const payload = event.body ? JSON.parse(event.body) : event;
  const { playerId, guessId, timestamp } = payload;
  const isHttp = !!event.body;

  try {
    if (isHttp && (!playerId || !guessId || timestamp == null)) {
      return badRequest("playerId, guessId and timestamp are required");
    }

    const now = Date.now();
    if (now - timestamp < 60000) {
      console.log("Too early to resolve");
      return isHttp
        ? badRequest("Too early to resolve (wait 60s after submitting guess)")
        : undefined;
    }

    const { Item: player } = await dynamo.send(
      new GetCommand({
        TableName: PLAYERS_TABLE,
        Key: { playerId },
      }),
    );

    if (!player || !player.currentGuess) {
      console.log("No active guess found");
      return isHttp ? badRequest("No active guess found") : undefined;
    }

    if (player.currentGuess.guessId !== guessId) {
      console.log("Guess ID mismatch");
      return isHttp ? badRequest("Guess ID mismatch") : undefined;
    }

    const exitPrice = await fetchBTCPrice();
    const { direction, entryPrice } = player.currentGuess;

    const correct =
      direction === "up" ? exitPrice > entryPrice : exitPrice < entryPrice;

    const result = correct ? "correct" : "incorrect";
    const scoreDelta = correct ? 1 : -1;
    const resolvedAt = Date.now();

    // Update player score and clear current guess
    await dynamo.send(
      new UpdateCommand({
        TableName: PLAYERS_TABLE,
        Key: { playerId },
        UpdateExpression: `
        SET score = score + :delta,
            currentGuess = :null,
            lastGuess = :lastGuess
      `,
        ExpressionAttributeValues: {
          ":delta": scoreDelta,
          ":null": null,
          ":lastGuess": {
            guessId,
            direction,
            entryPrice,
            exitPrice,
            result,
            resolvedAt,
          },
        },
      }),
    );

    await dynamo.send(
      new PutCommand({
        TableName: GUESSES_TABLE,
        Item: {
          playerId,
          timestamp,
          guessId,
          direction,
          entryPrice,
          exitPrice,
          result,
          resolvedAt,
        },
      }),
    );

    console.log(`Resolved guess for ${playerId}: ${result}`);
    return isHttp ? ok({ resolved: true, result }) : undefined;
  } catch (error) {
    console.error("resolveGuess error:", error);
    if (isHttp) return serverError("Failed to resolve guess");
    throw error;
  }
};
