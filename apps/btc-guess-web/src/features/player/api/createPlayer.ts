import { post } from "@/shared/api/client";
import type { PlayerData } from "shared-types";

export async function createPlayer(): Promise<PlayerData> {
  return post<PlayerData>("/player", {});
}
