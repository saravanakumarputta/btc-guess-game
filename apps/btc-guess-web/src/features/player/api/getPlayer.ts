import { get } from "@/shared/api/client";
import type { PlayerData } from "shared-types";

export type { PlayerData };

export async function getPlayer(playerId: string): Promise<PlayerData> {
  return get<PlayerData>(`/player/${playerId}`);
}
