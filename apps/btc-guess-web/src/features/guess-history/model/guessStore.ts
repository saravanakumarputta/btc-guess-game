import { create } from "zustand";
import type { GuessRecord } from "./types";
import { getGuesses } from "../api/getGuesses";

interface GuessStoreState {
  guesses: GuessRecord[];
  isLoading: boolean;
  isPolling: boolean;
  pollIntervalId: number | null;
  setGuesses: (list: GuessRecord[]) => void;
  addGuess: (guess: GuessRecord) => void;
  startPolling: (playerId: string) => void;
  stopPolling: () => void;
  fetchGuesses: (playerId: string) => Promise<void>;
}

export const useGuessStore = create<GuessStoreState>((set, get) => ({
  guesses: [],
  isLoading: false,
  isPolling: false,
  pollIntervalId: null,

  setGuesses: (list) => set({ guesses: list }),

  addGuess: (guess) =>
    set((state) => ({
      guesses: [guess, ...state.guesses],
    })),

  fetchGuesses: async (playerId: string) => {
    set({ isLoading: true });
    try {
      const list = await getGuesses(playerId);
      set({ guesses: list, isLoading: false });

      const hasInProgress = list.some((g) => g.status === "in_progress");
      const wasPolling = get().isPolling;

      if (!hasInProgress && wasPolling) {
        get().stopPolling();
        window.dispatchEvent(new CustomEvent("guessResolved"));
      }
    } catch (error) {
      console.error("Failed to fetch guesses:", error);
      set({ isLoading: false });
    }
  },

  startPolling: (playerId: string) => {
    const state = get();

    if (state.isPolling) return;

    state.fetchGuesses(playerId);

    const intervalId = window.setInterval(() => {
      get().fetchGuesses(playerId);
    }, 5000);

    set({ isPolling: true, pollIntervalId: intervalId });
  },

  stopPolling: () => {
    const state = get();
    if (state.pollIntervalId !== null) {
      clearInterval(state.pollIntervalId);
    }
    set({ isPolling: false, pollIntervalId: null });
  },
}));
