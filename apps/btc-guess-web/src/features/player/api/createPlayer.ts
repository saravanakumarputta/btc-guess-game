import { post } from "@/shared/api/client";
import type { PlayerData } from "shared-types";

export async function createPlayer(userId?: string): Promise<PlayerData> {
  return post<PlayerData>("/player", userId ? { playerId: userId } : {});
}
