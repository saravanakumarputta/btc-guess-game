import { GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";

import { dynamo, PLAYERS_TABLE, GUESSES_TABLE } from "../utils/dynamodb";
import { fetchBTCPrice } from "../utils/btcPrice";
import { ok, badRequest, serverError } from "../utils/response";

const scheduler = new SchedulerClient({ region: "us-east-1" });

export const handler = async (event: any) => {
  try {
    const { playerId, direction } = JSON.parse(event.body ?? "{}");

    if (!playerId || !direction) {
      return badRequest("playerId and direction are required");
    }

    if (!["up", "down"].includes(direction)) {
      return badRequest("direction must be up or down");
    }

    const { Item: player } = await dynamo.send(
      new GetCommand({
        TableName: PLAYERS_TABLE,
        Key: { playerId },
      }),
    );

    if (!player) {
      return badRequest("Player not found");
    }

    if (player.currentGuess) {
      return badRequest("You already have an active guess");
    }

    const btcPrice = await fetchBTCPrice();
    const entryPrice = btcPrice.usd;
    const timestamp = Date.now();
    const guessId = crypto.randomUUID();

    await dynamo.send(
      new UpdateCommand({
        TableName: PLAYERS_TABLE,
        Key: { playerId },
        UpdateExpression: "SET currentGuess = :guess",
        ExpressionAttributeValues: {
          ":guess": {
            guessId,
            direction,
            entryPrice,
            timestamp,
          },
        },
      }),
    );

    // Create guess record in guesses table (status in_progress; same record updated on resolve)
    await dynamo.send(
      new PutCommand({
        TableName: GUESSES_TABLE,
        Item: {
          playerId,
          timestamp,
          guessId,
          direction,
          entryPrice,
          status: "in_progress",
        },
      }),
    );

    const resolveAt = timestamp + 60000;

    const scheduleName = `resolve-${playerId}-${timestamp}`;
    await scheduler.send(
      new CreateScheduleCommand({
        Name: scheduleName,
        GroupName: process.env.SCHEDULER_GROUP!,
        ScheduleExpression: `at(${new Date(resolveAt).toISOString().split(".")[0]})`,
        FlexibleTimeWindow: { Mode: "OFF" },
        Target: {
          Arn: process.env.RESOLVE_GUESS_LAMBDA_ARN!,
          RoleArn: process.env.SCHEDULER_ROLE_ARN!,
          Input: JSON.stringify({ playerId, guessId, timestamp }),
        },
        ActionAfterCompletion: "DELETE",
      }),
    );

    const response: Record<string, unknown> = {
      playerId,
      guessId,
      direction,
      entryPrice,
      timestamp,
    };

    return ok(response);
  } catch (error) {
    console.error("submitGuess error:", error);
    return serverError("Failed to submit guess");
  }
};
