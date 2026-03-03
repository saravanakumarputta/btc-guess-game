import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { GuessHistoryList } from "./GuessHistoryList";
import type { GuessRecord } from "../model/types";

describe("GuessHistoryList", () => {
  it("renders the card title and description", () => {
    render(<GuessHistoryList guesses={[]} />);
    expect(screen.getByText("Guess history")).toBeInTheDocument();
    expect(
      screen.getByText("Your recent guesses and results"),
    ).toBeInTheDocument();
  });

  it("displays loading state", () => {
    const { container } = render(
      <GuessHistoryList guesses={[]} isLoading={true} />,
    );
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("displays empty state when no guesses", () => {
    render(<GuessHistoryList guesses={[]} />);
    expect(screen.getByText("No guesses yet")).toBeInTheDocument();
    expect(
      screen.getByText("Place a guess above to see it here"),
    ).toBeInTheDocument();
  });

  it("renders a single completed correct guess", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "1",
        playerId: "player1",
        direction: "up",
        entryPrice: 45000,
        exitPrice: 45100,
        result: true,
        status: "completed",
        timestamp: 1714732800000,
        resolvedAt: 1714732860000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    expect(screen.getByText("up")).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("$45,000.00")).toBeInTheDocument();
    expect(screen.getByText("$45,100.00")).toBeInTheDocument();
  });

  it("renders a single completed incorrect guess", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "2",
        playerId: "player1",
        direction: "down",
        entryPrice: 45000,
        exitPrice: 45100,
        result: false,
        status: "completed",
        timestamp: 1714732860000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    expect(screen.getByText("down")).toBeInTheDocument();
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("renders a pending guess", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "3",
        playerId: "player1",
        direction: "up",
        entryPrice: 45000,
        status: "in_progress",
        timestamp: 1714732800000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("$45,000.00")).toBeInTheDocument();
    expect(screen.getByText("→ …")).toBeInTheDocument();
  });

  it("renders multiple guesses in order", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "1",
        playerId: "player1",
        direction: "up",
        entryPrice: 45000,
        exitPrice: 45100,
        result: true,
        status: "completed",
        timestamp: 1714732800000,
        resolvedAt: 1714732860000,
      },
      {
        guessId: "2",
        playerId: "player1",
        direction: "down",
        entryPrice: 46000,
        status: "in_progress",
        timestamp: 1714732800000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("displays up arrow icon for up guesses", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "1",
        playerId: "player1",
        direction: "up",
        entryPrice: 45000,
        status: "in_progress",
        timestamp: 1714732800000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    const upText = screen.getByText("up");
    expect(upText).toBeInTheDocument();
  });

  it("displays down arrow icon for down guesses", () => {
    const guesses: GuessRecord[] = [
      {
        guessId: "1",
        playerId: "player1",
        direction: "down",
        entryPrice: 45000,
        status: "in_progress",
        timestamp: 1714732800000,
      },
    ];

    render(<GuessHistoryList guesses={guesses} />);
    const downText = screen.getByText("down");
    expect(downText).toBeInTheDocument();
  });
});
