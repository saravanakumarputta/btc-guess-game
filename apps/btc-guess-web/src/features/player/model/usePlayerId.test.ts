import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  usePlayerId,
  getStoredPlayerId,
  clearStoredPlayerId,
} from "./usePlayerId";
import * as createPlayerApi from "../api/createPlayer";
import type { PlayerData } from "shared-types";

vi.mock("../api/createPlayer");

describe("usePlayerId", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns null initially when no playerId is stored", () => {
    vi.spyOn(createPlayerApi, "createPlayer").mockResolvedValue({
      playerId: "new-player-123",
      score: 0,
    });

    const { result } = renderHook(() => usePlayerId());

    expect(result.current.playerId).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("creates a new anonymous player when no playerId exists", async () => {
    const mockPlayerData = {
      playerId: "new-player-123",
      score: 0,
    };

    vi.spyOn(createPlayerApi, "createPlayer").mockResolvedValue(mockPlayerData);

    const { result } = renderHook(() => usePlayerId());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.playerId).toBe("new-player-123");
    expect(result.current.playerData).toEqual(mockPlayerData);
    expect(localStorage.getItem("btc-guess-playerId")).toBe("new-player-123");
  });

  it("uses stored playerId when available", () => {
    localStorage.setItem("btc-guess-playerId", "stored-player-456");

    const { result } = renderHook(() => usePlayerId());

    expect(result.current.playerId).toBe("stored-player-456");
    expect(result.current.loading).toBe(false);
    expect(createPlayerApi.createPlayer).not.toHaveBeenCalled();
  });

  it("creates player with userId when provided", async () => {
    const mockPlayerData = {
      playerId: "auth-player-789",
      correctGuesses: 5,
      incorrectGuesses: 2,
      totalGuesses: 7,
      score: 5,
    };

    vi.spyOn(createPlayerApi, "createPlayer").mockResolvedValue(mockPlayerData);

    const { result } = renderHook(() => usePlayerId({ userId: "user-123" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(createPlayerApi.createPlayer).toHaveBeenCalledWith("user-123");
    expect(result.current.playerId).toBe("auth-player-789");
    expect(result.current.playerData).toEqual(mockPlayerData);
  });

  it("handles error when creating player fails", async () => {
    const errorMessage = "Network error";
    vi.spyOn(createPlayerApi, "createPlayer").mockRejectedValue(
      new Error(errorMessage),
    );

    const { result } = renderHook(() => usePlayerId());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.playerId).toBeNull();
  });

  it("stores playerId in localStorage when created", async () => {
    const mockPlayerData = {
      playerId: "new-player-999",
      correctGuesses: 0,
      incorrectGuesses: 0,
      totalGuesses: 0,
      score: 0,
    };

    vi.spyOn(createPlayerApi, "createPlayer").mockResolvedValue(mockPlayerData);

    renderHook(() => usePlayerId());

    await waitFor(() => {
      expect(localStorage.getItem("btc-guess-playerId")).toBe("new-player-999");
    });
  });

  it("cleans up on unmount", async () => {
    let resolveCreate: (value: PlayerData) => void;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });

    vi.spyOn(createPlayerApi, "createPlayer").mockReturnValue(
      createPromise as Promise<PlayerData>,
    );

    const { unmount } = renderHook(() => usePlayerId());

    unmount();

    resolveCreate!({
      playerId: "should-not-set",
      score: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(localStorage.getItem("btc-guess-playerId")).toBeNull();
  });
});

describe("getStoredPlayerId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns playerId from localStorage", () => {
    localStorage.setItem("btc-guess-playerId", "test-player-123");
    expect(getStoredPlayerId()).toBe("test-player-123");
  });

  it("returns null when no playerId is stored", () => {
    expect(getStoredPlayerId()).toBeNull();
  });
});

describe("clearStoredPlayerId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("removes playerId from localStorage", () => {
    localStorage.setItem("btc-guess-playerId", "test-player-123");
    expect(localStorage.getItem("btc-guess-playerId")).toBe("test-player-123");

    clearStoredPlayerId();

    expect(localStorage.getItem("btc-guess-playerId")).toBeNull();
  });

  it("does not throw when no playerId is stored", () => {
    expect(() => clearStoredPlayerId()).not.toThrow();
  });
});
